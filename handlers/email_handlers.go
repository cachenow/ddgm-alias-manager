package handlers

import (
	"log"
	"net/http"

	"anonymail/models"
	"anonymail/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GenerateAddress(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			RealAddress string `json:"real_address"`
			TokenID     uint   `json:"token_id"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userInterface, _ := c.Get("user")
		user := userInterface.(models.User)

		var token models.Token
		if err := db.First(&token, req.TokenID).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid token"})
			return
		}

		convertedAddress, err := services.GenerateEmailAddress(db, user.ID, req.RealAddress, token.Value, token.Description)
		if err != nil {
			log.Printf("Failed to generate email address for user %d: %v", user.ID, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate email address"})
			return
		}

		log.Printf("Generated email address for user %d", user.ID)
		c.JSON(http.StatusOK, gin.H{"generated_address": convertedAddress})
	}
}

func GetTokens(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userInterface, _ := c.Get("user")
		user := userInterface.(models.User)

		var tokens []struct {
			ID          uint
			Value       string
			Description string
		}
		if err := db.Model(&models.Token{}).Where("user_id = ?", user.ID).Select("id, value, description").Find(&tokens).Error; err != nil {
			log.Printf("Failed to retrieve tokens for user %d: %v", user.ID, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve tokens"})
			return
		}

		log.Printf("Retrieved %d tokens for user %d", len(tokens), user.ID)
		c.JSON(http.StatusOK, gin.H{"tokens": tokens})
	}
}

func AddToken(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenData struct {
			Value       string `json:"value" binding:"required"`
			Description string `json:"description"`
		}
		if err := c.ShouldBindJSON(&tokenData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userInterface, _ := c.Get("user")
		user := userInterface.(models.User)

		token := models.Token{
			UserID:      user.ID,
			Value:       tokenData.Value,
			Description: tokenData.Description,
			IsDefault:   false,
		}

		if err := db.Create(&token).Error; err != nil {
			log.Printf("Failed to add token for user %d: %v", user.ID, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add token"})
			return
		}

		log.Printf("Token added successfully for user %d", user.ID)
		c.JSON(http.StatusOK, gin.H{"message": "Token added successfully"})
	}
}

func DeleteToken(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenID := c.Param("id")

		userInterface, _ := c.Get("user")
		user := userInterface.(models.User)

		if err := db.Where("id = ? AND user_id = ?", tokenID, user.ID).Delete(&models.Token{}).Error; err != nil {
			log.Printf("Failed to delete token %s for user %d: %v", tokenID, user.ID, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete token"})
			return
		}

		log.Printf("Token %s deleted successfully for user %d", tokenID, user.ID)
		c.JSON(http.StatusOK, gin.H{"message": "Token deleted successfully"})
	}
}

func GetAddresses(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userInterface, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}
		user, ok := userInterface.(models.User)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user data"})
			return
		}

		var addresses []models.Address
		if err := db.Where("user_id = ?", user.ID).Find(&addresses).Error; err != nil {
			log.Printf("Failed to retrieve addresses for user %d: %v", user.ID, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve addresses"})
			return
		}

		log.Printf("Retrieved %d addresses for user %d", len(addresses), user.ID)
		c.JSON(http.StatusOK, gin.H{"addresses": addresses})
	}
}

func DeleteAddress(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		addressID := c.Param("id")

		userInterface, exists := c.Get("user")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
			return
		}
		user, ok := userInterface.(models.User)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user data"})
			return
		}

		var address models.Address
		if err := db.Where("id = ? AND user_id = ?", addressID, user.ID).First(&address).Error; err != nil {
			log.Printf("Address %s not found for user %d", addressID, user.ID)
			c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
			return
		}

		if err := db.Delete(&address).Error; err != nil {
			log.Printf("Failed to delete address %s for user %d: %v", addressID, user.ID, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete address"})
			return
		}

		log.Printf("Address %s deleted successfully for user %d", addressID, user.ID)
		c.JSON(http.StatusOK, gin.H{"message": "Address deleted successfully"})
	}
}

func SaveToken(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var tokenData struct {
			Token string `json:"token" binding:"required"`
		}
		if err := c.ShouldBindJSON(&tokenData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userInterface, _ := c.Get("user")
		user := userInterface.(models.User)

		user.Token = tokenData.Token
		if err := db.Save(&user).Error; err != nil {
			log.Printf("Failed to save token for user %d: %v", user.ID, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save token"})
			return
		}

		log.Printf("Token saved successfully for user %d", user.ID)
		c.JSON(http.StatusOK, gin.H{"message": "Token saved successfully"})
	}
}

func GetToken(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userInterface, _ := c.Get("user")
		user := userInterface.(models.User)

		c.JSON(http.StatusOK, gin.H{"token": user.Token})
	}
}
