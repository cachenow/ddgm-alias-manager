# DuckDuckGo Email Alias Manager

![Build and Push Docker image](https://github.com/cachenow/ddgm-alias-manager/actions/workflows/Build.yml/badge.svg)

[English](#english) | [中文](https://github.com/cachenow/ddgm-alias-manager/blob/main/README-CN.md)

## English

This project is a management system for DuckDuckGo email aliases. It allows users to generate, manage, and convert DuckDuckGo email aliases with a user-friendly interface and multi-language support.

### Features

- User registration and login system
- Generate DuckDuckGo email aliases
- Manage tokens for email alias generation
- Generate or Convert between real email addresses and DuckDuckGo aliases
- Address list management
- Admin panel for user management
- Multilingual support (English and Chinese)
- Password change functionality
- Secure token management

### Installation and Running

#### Using Docker

1. Clone the repository:
   ```
   git clone https://github.com/cachenow/ddgm-alias-manager.git
   ```

2. Navigate to the project directory:
   ```
   cd ddgm-alias-manager
   ```

3. Build the Docker image:
   ```
   docker build -t ddgm-alias-manager .
   ```

4. Run the Docker container:
   ```
   docker run -d -p 8080:8080 -v /path/on/host:/app/data -e ADMIN_PASSWORD=your_admin_password ddgm-alias-manager
   ```
   or
   ```
   docker run -d -p 8080:8080 -v /path/on/host:/app/data -e ADMIN_PASSWORD=your_admin_password ghcr.io/cachenow/ddgm-alias-manager:latest
   ```
   
   Replace `/path/on/host` with the actual path on your host machine where you want to store the database file, and set `your_admin_password` to your desired admin password.

   Note: If you don't set the `ADMIN_PASSWORD` environment variable, the default admin password will be "admin". It's strongly recommended to set a custom password, especially in production environments.

5. Access the application at `http://localhost:8080`

#### Using Go directly

1. Clone the repository:
   ```
   git clone https://github.com/cachenow/ddgm-alias-manager.git
   ```

2. Navigate to the project directory:
   ```
   cd ddgm-alias-manager
   ```

3. Install dependencies:
   ```
   go mod download
   ```

4. Set the admin password environment variable (recommended):
   ```
   export ADMIN_PASSWORD=your_admin_password
   ```

   Note: If you don't set the `ADMIN_PASSWORD` environment variable, the default admin password will be "admin". It's strongly recommended to set a custom password, especially in production environments.

5. Run the application:
   ```
   go run main.go
   ```

6. Access the application at `http://localhost:8080`

### Usage

1. Register a new account or log in to an existing one.
2. For admin access, use the username "admin" and the password set in `ADMIN_PASSWORD` (or "admin" if not set).
3. Generate new email aliases:
   - Go to the "Generate Address" section
   - Optionally enter a real recipient address(e.g. someone@example.com)
   - Select a token from your saved tokens
   - Click "Generate Address"
4. Manage your tokens:
   - Go to the "Manage Tokens" section
   - Add new tokens or delete existing ones
5. Convert addresses:
   - Use the "Address Converter" to switch between DuckDuckGo and real addresses
6. View and manage your generated addresses in the address list
7. Admins can manage users through the admin panel

### Security Note

The default admin password is set to "admin" if no custom password is provided. This is intended for development and testing purposes only. For any production or public-facing deployment, it is crucial to set a strong, custom admin password using the `ADMIN_PASSWORD` environment variable.

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### License

This project is licensed under the MIT License.
