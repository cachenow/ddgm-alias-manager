# 构建阶段
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 安装必要的系统依赖
RUN apk add --no-cache gcc musl-dev

# 设置 Go 环境变量
ENV CGO_ENABLED=0
ENV GOOS=linux

# 复制并下载依赖项
COPY go.mod go.sum ./
RUN go mod download && go mod verify

# 复制源代码
COPY . .

# 构建应用
RUN go build -o main .

# 最终阶段
FROM alpine:latest

WORKDIR /app

# 从构建阶段复制二进制文件
COPY --from=builder /app/main .

# 复制静态文件和模板
COPY --from=builder /app/static ./static
COPY --from=builder /app/templates ./templates

# 创建数据目录
RUN mkdir -p /app/data

# 设置环境变量
ENV DB_PATH=/app/data/email_manager.db

# 添加构建时间戳参数
ARG BUILDTIME=unknown

# 使用构建时间戳更新文件
RUN echo "// Build: ${BUILDTIME}" >> /app/static/js/translations.js
RUN echo "// Build: ${BUILDTIME}" >> /app/static/js/app.js
RUN echo "<!-- Build: ${BUILDTIME} -->" >> /app/templates/index.html
RUN echo "/* Build: ${BUILDTIME} */" >> /app/static/css/style.css

# 安装 curl 用于健康检查
RUN apk add --no-cache curl

# 暴露端口
EXPOSE 8080

# 声明数据卷
VOLUME ["/app/data"]

# 健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# 运行应用
CMD ["./main"]