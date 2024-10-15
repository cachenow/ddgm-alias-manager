# 🚀 DuckDuckGo Email Alias Manager

![Build and Push Docker image](https://github.com/cachenow/ddgm-alias-manager/actions/workflows/Build.yml/badge.svg)
![Docker Pulls](https://img.shields.io/docker/pulls/onereduck/ddgm-alias-manager)
![Docker Stars](https://img.shields.io/docker/stars/onereduck/ddgm-alias-manager)
![Docker Image Version](https://img.shields.io/docker/v/onereduck/ddgm-alias-manager)
![Docker Image Size](https://img.shields.io/docker/image-size/onereduck/ddgm-alias-manager)

[🇬🇧 English](#english) | [🇨🇳 中文](https://github.com/cachenow/ddgm-alias-manager/blob/main/README-CN.md)

## 📖 Overview

This project is a management system for DuckDuckGo email aliases. It allows users to **generate**, **manage**, and **convert** DuckDuckGo email aliases with a user-friendly interface and multi-language support.

---

## 🌟 Features

- ✅ **User registration and login system**
- 📧 **Generate DuckDuckGo email aliases**
- 🔑 **Manage tokens** for email alias generation
- 🔄 **Generate or convert** actual sender/recipient addresses and DuckDuckGo aliases
  - One-click generate: `someone@example.com` → `someone_at_example.com_someone@duck.com`
  - One-click convert: `someone_at_example.com_someone@duck.com` → `someone@example.com`
- 📜 **Address list management**
- 🛠️ **Admin panel** for user management
- 🌐 **Multilingual support** (English and Chinese)
- 🔒 **Password change functionality**
- 🗝️ **Secure token management**

---

## 🛠️ Installation and Running

### Using Docker

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cachenow/ddgm-alias-manager.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd ddgm-alias-manager
   ```

3. **Build the Docker image:**
   ```bash
   docker build -t ddgm-alias-manager .
   ```

4. **Run the Docker container:**
   ```bash
   docker run -d \
     -p 8080:8080 \
     -v /path/on/host:/app/data \
     -e ADMIN_PASSWORD=your_admin_password \
     ddgm-alias-manager
   ```
   or
   ```bash
   docker run -d \
     -p 8080:8080 \
     -v /path/on/host:/app/data \
     -e ADMIN_PASSWORD=your_admin_password \
     ghcr.io/cachenow/ddgm-alias-manager:latest
   ```
   
   **Note:** Replace `/path/on/host` with the actual path on your host machine where you want to store the database file, and set `your_admin_password` to your desired admin password.

   *If you don't set the `ADMIN_PASSWORD`, the default admin password will be "admin". It's strongly recommended to set a custom password, especially in production environments.*

5. **Access the application at** `http://localhost:8080`

### Using Go directly

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cachenow/ddgm-alias-manager.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd ddgm-alias-manager
   ```

3. **Install dependencies:**
   ```bash
   go mod download
   ```

4. **Set the admin password environment variable (recommended):**
   ```bash
   export ADMIN_PASSWORD=your_admin_password
   ```

5. **Run the application:**
   ```bash
   go run main.go
   ```

6. **Access the application at** `http://localhost:8080`

---

## 🛠️ Usage

1. **Register a new account** or log in to an existing one.
2. For admin access, use the username **"admin"** and the password set in `ADMIN_PASSWORD` (or "admin" if not set).
3. **Generate new email aliases:**
   - Go to the **"Generate Address"** section
   - Optionally enter a real recipient address (e.g. `someone@example.com`)
   - Select a token from your saved tokens
   - Click **"Generate Address"**
4. **Manage your tokens:**
   - Go to the **"Manage Tokens"** section
   - Add new tokens or delete existing ones
5. **Convert addresses:**
   - Use the **"Address Converter"** to switch between DuckDuckGo and real addresses
6. **View and manage your generated addresses** in the address list
7. **Admins can manage users** through the admin panel

---

## 🔒 Security Note

The default admin password is set to **"admin"** if no custom password is provided. This is intended for development and testing purposes only. For any production or public-facing deployment, it is crucial to set a strong, custom admin password using the `ADMIN_PASSWORD` environment variable.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📜 License

This project is licensed under the MIT License.
