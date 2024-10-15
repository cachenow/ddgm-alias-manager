package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"anonymail/handlers"
	"anonymail/middleware"
	"anonymail/models"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	// 设置生产模式
	gin.SetMode(gin.ReleaseMode)

	// 初始化数据库
	initDB()

	// 检查是否需要创建管理员账户
	createAdminIfNotExists()

	// 设置路由
	r := setupRouter()

	// 从环境变量获取端口，如果没有设置则使用默认值
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	// 在一个新的 goroutine 中启动服务器
	go func() {
		log.Printf("Server is running on port %s", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// 等待中断信号以优雅地关闭服务器（设置 5 秒的超时时间）
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}

func setupRouter() *gin.Engine {
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.Logger())

	// 加载HTML模板
	r.LoadHTMLGlob("templates/*")

	// 添加静态文件服务
	r.Static("/static", "./static")

	// 添加根路径处理
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{
			"title": "DuckDuckGo Email Alias Manager",
		})
	})

	// 添加健康检查路由
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// 公开路由
	r.POST("/register", handlers.RegisterUser(db))
	r.POST("/login", handlers.LoginUser(db))

	// 需要认证的路由
	auth := r.Group("/")
	auth.Use(middleware.AuthRequired(db))
	{
		auth.POST("/change-password", handlers.ChangePassword(db))
		auth.POST("/save-token", handlers.SaveToken(db))
		auth.POST("/generate-address", handlers.GenerateAddress(db))
		auth.GET("/addresses", handlers.GetAddresses(db))
		auth.DELETE("/address/:id", handlers.DeleteAddress(db))
		auth.GET("/get-token", handlers.GetToken(db))
		auth.GET("/get-tokens", handlers.GetTokens(db))
		auth.POST("/add-token", handlers.AddToken(db))
		auth.DELETE("/delete-token/:id", handlers.DeleteToken(db))
		auth.GET("/check-auth", handlers.CheckAuth(db))
	}

	// 管理员路由
	admin := r.Group("/admin")
	admin.Use(middleware.AuthRequired(db), middleware.AdminRequired())
	{
		admin.POST("/create-user", handlers.CreateUser(db))
		admin.DELETE("/delete-user/:id", handlers.DeleteUser(db))
		admin.POST("/reset-password/:id", handlers.ResetPassword(db))
		admin.GET("/users", handlers.GetUsers(db))
	}

	return r
}

func initDB() {
	var err error
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "email_manager.db"
	}
	db, err = gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	// 自动迁移模式
	err = db.AutoMigrate(&models.User{}, &models.Address{}, &models.Token{})
	if err != nil {
		log.Fatal("Failed to auto migrate:", err)
	}
	log.Println("Database migration completed successfully")
}

func createAdminIfNotExists() {
	var count int64
	if err := db.Model(&models.User{}).Count(&count).Error; err != nil {
		log.Printf("Error checking user count: %v", err)
		return
	}
	if count == 0 {
		adminPassword := os.Getenv("ADMIN_PASSWORD")
		if adminPassword == "" {
			adminPassword = "admin" // 默认密码
			log.Println("Warning: ADMIN_PASSWORD not set. Using default password 'admin'. Please change it immediately.")
		}
		err := db.Transaction(func(tx *gorm.DB) error {
			hashedPassword, err := bcrypt.GenerateFromPassword([]byte(adminPassword), bcrypt.DefaultCost)
			if err != nil {
				return fmt.Errorf("failed to hash admin password: %w", err)
			}
			admin := models.User{
				Username:     "admin",
				PasswordHash: string(hashedPassword),
				IsAdmin:      true,
			}
			if err := tx.Create(&admin).Error; err != nil {
				return fmt.Errorf("failed to create admin user: %w", err)
			}
			return nil
		})
		if err != nil {
			log.Printf("Error creating admin user: %v", err)
			return
		}
		log.Println("Created default admin account. Username: admin")
	}
}
