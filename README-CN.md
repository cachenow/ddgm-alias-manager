# 🚀 DuckDuckGo 邮件别名管理器

## 📖 概述

这个项目是一个 DuckDuckGo 邮件别名的管理系统。它允许用户通过用户友好的界面生成、管理和转换 DuckDuckGo 邮件别名，并支持多语言。

---

## 🌟 功能

- ✅ **用户注册和登录系统**
- 📧 **生成 DuckDuckGo 邮件别名**
- 🔑 **管理邮件别名生成的令牌**
- 🔄 **生成或转换** 实际的发件人/收件人地址和 DuckDuckGo 别名
  - 一键生成: `someone@example.com` → `someone_at_example.com_someone@duck.com`
  - 一键转换: `someone_at_example.com_someone@duck.com` → `someone@example.com`
- 📜 **地址列表管理**
- 🛠️ **用户管理的管理面板**
- 🌐 **多语言支持**（英语和中文）
- 🔒 **密码更改功能**
- 🗝️ **安全令牌管理**

---

## 🛠️ 安装与运行

### 使用 Docker

1. **克隆仓库：**
   ```bash
   git clone https://github.com/cachenow/ddgm-alias-manager.git
   ```

2. **进入项目目录：**
   ```bash
   cd ddgm-alias-manager
   ```

3. **构建 Docker 镜像：**
   ```bash
   docker build -t ddgm-alias-manager .
   ```

4. **运行 Docker 容器：**
   ```bash
   docker run -d \
     -p 8080:8080 \
     -v /path/on/host:/app/data \
     -e ADMIN_PASSWORD=your_admin_password \
     ddgm-alias-manager
   ```
   或者
   ```bash
   docker run -d \
     -p 8080:8080 \
     -v /path/on/host:/app/data \
     -e ADMIN_PASSWORD=your_admin_password \
     ghcr.io/cachenow/ddgm-alias-manager:latest
   ```
   
   **注意：** 将 `/path/on/host` 替换为您希望在主机上存储数据库文件的实际路径，并将 `your_admin_password` 设置为您希望的管理员密码。

   *如果不设置 `ADMIN_PASSWORD`，默认管理员密码将是 "admin"。强烈建议在生产环境中设置自定义密码。*

5. **访问应用程序：** `http://localhost:8080`

### 直接使用 Go

1. **克隆仓库：**
   ```bash
   git clone https://github.com/cachenow/ddgm-alias-manager.git
   ```

2. **进入项目目录：**
   ```bash
   cd ddgm-alias-manager
   ```

3. **安装依赖：**
   ```bash
   go mod download
   ```

4. **设置管理员密码环境变量（推荐）：**
   ```bash
   export ADMIN_PASSWORD=your_admin_password
   ```

5. **运行应用程序：**
   ```bash
   go run main.go
   ```

6. **访问应用程序：** `http://localhost:8080`

---

## 🛠️ 使用方法

1. **注册新账户**或登录现有账户。
2. 对于管理员访问，使用用户名 **"admin"** 和在 `ADMIN_PASSWORD` 中设置的密码（如果未设置，则为 "admin"）。
3. **生成新的邮件别名：**
   - 转到 **"生成地址"** 部分
   - 可选地输入真实收件人地址（例如 `someone@example.com`）
   - 从您保存的令牌中选择一个
   - 点击 **"生成地址"**
4. **管理您的令牌：**
   - 转到 **"管理令牌"** 部分
   - 添加新令牌或删除现有令牌
5. **转换地址：**
   - 使用 **"地址转换器"** 在 DuckDuckGo 和真实地址之间切换
6. **查看和管理您生成的地址** 在地址列表中
7. **管理员可以通过管理面板管理用户**

---

## 🔒 安全提示

如果未提供自定义密码，默认管理员密码设置为 **"admin"**。这仅用于开发和测试目的。对于任何生产或面向公众的部署，务必通过 `ADMIN_PASSWORD` 环境变量设置强大且自定义的管理员密码。

---

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

---

## 📜 许可证

该项目遵循 MIT 许可证。
