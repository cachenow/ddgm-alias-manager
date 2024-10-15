## DuckDuckGo 邮箱别名管理系统

本项目是一个 DuckDuckGo 邮箱别名管理系统。它允许用户通过友好的界面生成、管理和转换 DuckDuckGo 邮箱别名，并支持多语言。

### 功能

- 用户注册和登录系统
- 生成 DuckDuckGo 邮箱别名
- 管理用于生成邮箱别名的令牌
- 生成或转换实际收（发）件人地址和 DuckDuckGo 别名
  - 一键生成 someone@example.com → someone_at_example.com_someone@duck.com
  - 一键转换 someone_at_example.com_someone@duck.com → someone@example.com
- 地址列表管理
- 管理员面板用于用户管理
- 多语言支持（英语和中文）
- 密码修改功能
- 安全的令牌管理

### 安装和运行

#### 使用 Docker

1. 克隆仓库：
   ```
   git clone https://github.com/cachenow/ddgm-alias-manager.git
   ```

2. 进入项目目录：
   ```
   cd ddgm-alias-manager
   ```

3. 构建 Docker 镜像：
   ```
   docker build -t ddgm-alias-manager .
   ```

4. 运行 Docker 容器：
   ```
   docker run -d -p 8080:8080 -v /path/on/host:/app/data -e ADMIN_PASSWORD=your_admin_password ddgm-alias-manager
   ```
   或者
   ```
   docker run -d -p 8080:8080 -v /path/on/host:/app/data -e ADMIN_PASSWORD=your_admin_password ghcr.io/cachenow/ddgm-alias-manager:latest
   ```

   将 `/path/on/host` 替换为您主机上实际想要用来存储数据库文件的路径，并将 `your_admin_password` 设置为您想要的管理员密码。

   注意：如果您没有设置 `ADMIN_PASSWORD` 环境变量，默认的管理员密码将是 "admin"。强烈建议设置自定义密码，特别是在生产环境中。

5. 在浏览器中访问 `http://localhost:8080`

#### 直接使用 Go 运行

1. 克隆仓库：
   ```
   git clone https://github.com/cachenow/ddgm-alias-manager.git
   ```

2. 进入项目目录：
   ```
   cd ddgm-alias-manager
   ```

3. 安装依赖：
   ```
   go mod download
   ```

4. 设置管理员密码环境变量（推荐）：
   ```
   export ADMIN_PASSWORD=your_admin_password
   ```

   注意：如果您没有设置 `ADMIN_PASSWORD` 环境变量，默认的管理员密码将是 "admin"。强烈建议设置自定义密码，特别是在生产环境中。

5. 运行应用：
   ```
   go run main.go
   ```

6. 在浏览器中访问 `http://localhost:8080`

### 使用方法

1. 注册新账户或登录现有账户。
2. 对于管理员访问，使用用户名 "admin" 和在 `ADMIN_PASSWORD` 中设置的密码（如果未设置，则使用 "admin"）。
3. 生成新的邮箱别名：
   - 转到 "生成地址" 部分
   - 可选择输入实际收件人地址（例如：someone@example.com）
   - 从已保存的令牌中选择一个
   - 点击 "生成地址"
4. 管理您的令牌：
   - 转到 "管理令牌" 部分
   - 添加新令牌或删除现有令牌
5. 转换地址：
   - 使用 "地址转换器" 在 DuckDuckGo 地址和实际地址之间切换
6. 在地址列表中查看和管理您生成的地址
7. 管理员可以通过管理员面板管理用户

### 安全注意事项

如果没有提供自定义密码，默认的管理员密码设置为 "admin"。这仅用于开发和测试目的。对于任何生产或面向公众的部署，使用 `ADMIN_PASSWORD` 环境变量设置一个强大的自定义管理员密码至关重要。

### 贡献

欢迎贡献！请随时提交 Pull Request。

### 许可证

本项目采用 MIT 许可证。
