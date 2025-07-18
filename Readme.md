# Node.js Express Application

A modern Node.js application built with Express.js and Pino logging.

## Features

- Express.js web framework
- Pino structured logging
- Health check endpoint
- Graceful shutdown handling
- Docker support with security best practices
- Environment variable configuration

## Prerequisites

- Node.js 20+ (LTS recommended)
- npm or yarn
- Docker (optional)

## Installation

```bash
npm install
```

## Nexus Repository Setup Guide

This section provides complete instructions for connecting to and publishing packages to a Nexus repository.

### Prerequisites for Nexus Integration
- Nexus Repository Manager (Community or Pro)
- Valid Nexus user account with publish permissions
- Node.js and npm installed
- PowerShell execution policy configured (Windows)

### Quick Start for New Users

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your Nexus details:**
   ```bash
   NEXUS_SERVER=http://your-nexus-server.com:8081
   NEXUS_REPOSITORY=npm-public
   NEXUS_USERNAME=your-username
   NEXUS_PASSWORD=your-password
   ```

3. **Update `.npmrc` with your server details:**
   ```bash
   # Replace the placeholder URLs with your actual Nexus server
   # Update username and password authentication
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Test connection:**
   ```bash
   node test-nexus-connection.js
   ```

### Step-by-Step Manual Configuration

#### 1. Fix PowerShell Execution Policy (Windows Only)

If you encounter npm script execution errors, fix the PowerShell execution policy:

```powershell
# Run this command in PowerShell as Administrator or for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. Configure npm Registry (.npmrc)

Create or edit the `.npmrc` file in your project root:

```properties
# Nexus Repository Configuration
registry=http://YOUR_NEXUS_SERVER:PORT/repository/REPO_NAME/

# Authentication using username/password
//YOUR_NEXUS_SERVER:PORT/repository/REPO_NAME/:username=YOUR_USERNAME
//YOUR_NEXUS_SERVER:PORT/repository/REPO_NAME/:_password=BASE64_ENCODED_PASSWORD

# Security settings
always-auth=true
cache-min=10
```

**Example with actual values:**
```properties
registry=http://nexus.mycompany.com:8081/repository/npm-group/
//nexus.mycompany.com:8081/repository/npm-group/:username=myusername
//nexus.mycompany.com:8081/repository/npm-group/:_password=bXlwYXNzd29yZA==
always-auth=true
cache-min=10
```

#### 3. Encode Password for .npmrc

To encode your password in base64:

```bash
# Using Node.js
node -e "console.log(Buffer.from('YOUR_PASSWORD').toString('base64'))"

# Using PowerShell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes('YOUR_PASSWORD'))
```

#### 4. Environment Variables Setup

Create a `.env` file with your Nexus configuration:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Nexus Repository Configuration
NEXUS_SERVER=http://nexus.mycompany.com:8081
NEXUS_REPOSITORY=npm-group
NEXUS_USERNAME=myusername
NEXUS_PASSWORD=mypassword
NEXUS_PASSWORD_BASE64=bXlwYXNzd29yZA==
```

#### 5. Update package.json for Publishing

Add publish configuration to your `package.json`:

```json
{
  "publishConfig": {
    "registry": "http://YOUR_NEXUS_SERVER:PORT/repository/REPO_NAME/"
  },
  "scripts": {
    "publish:nexus": "npm publish --registry http://YOUR_NEXUS_SERVER:PORT/repository/REPO_NAME/"
  }
}
```

### Testing Your Nexus Connection

#### 1. Test Basic Connectivity

```bash
# Test npm connection to Nexus
npm ping --registry http://nexus.mycompany.com:8081/repository/npm-group/

# Expected output: PONG with response time
npm notice PING http://nexus.mycompany.com:8081/repository/npm-group/
npm notice PONG 554ms
```

#### 2. Test Package Information

```bash
# View npm configuration
npm config list

# Test authentication
npm whoami --registry http://nexus.mycompany.com:8081/repository/npm-group/
```

#### 3. Dry Run Publishing

```bash
# Test what would be published without actually publishing
npm publish --dry-run --registry http://nexus.mycompany.com:8081/repository/npm-group/
```

### Manual Publishing Process

#### Method 1: Using npm Commands

```bash
# 1. Ensure your package.json version is correct
npm version patch  # or minor, major

# 2. Test the publish (dry run)
npm publish --dry-run

# 3. Publish to Nexus
npm publish --registry http://nexus.mycompany.com:8081/repository/npm-group/

# Or use the configured script
npm run publish:nexus
```

#### Method 2: Using npm pack and Manual Upload

```bash
# 1. Create a tarball of your package
npm pack

# 2. This creates a .tgz file (e.g., nodejs-app-1.0.0.tgz)
# 3. Upload manually through Nexus web interface:
#    - Navigate to http://YOUR_NEXUS_SERVER:PORT
#    - Login with your credentials
#    - Go to Browse → Components → Select your repository
#    - Click "Upload component"
#    - Select npm format and upload your .tgz file
```

#### Method 3: Using curl for Direct Upload

```bash
# Create package tarball
npm pack

# Upload using curl
curl -u USERNAME:PASSWORD \
  --upload-file nodejs-app-1.0.0.tgz \
  http://nexus.mycompany.com:8081/repository/npm-group/
```

### Troubleshooting Common Issues

#### Authentication Errors (401)
```bash
# Verify credentials
npm whoami --registry http://nexus.mycompany.com:8081/repository/npm-group/

# Check base64 encoding
node -e "console.log(Buffer.from('myusername:mypassword').toString('base64'))"
```

#### Connection Errors
```bash
# Test basic connectivity
curl -u myusername:mypassword http://nexus.mycompany.com:8081/repository/npm-group/

# Check firewall and network access
telnet nexus.mycompany.com 8081
```

#### Permission Errors (403)
- Verify user has publish permissions in Nexus
- Check repository allows deployment
- Ensure repository format is set to npm

#### Package Already Exists
```bash
# Update version and republish
npm version patch
npm publish
```

### Best Practices

1. **Version Management**: Always increment version before publishing
2. **Security**: Never commit `.npmrc` with plain text passwords
3. **Environment Variables**: Use `.env` files for sensitive data
4. **Testing**: Always run `npm publish --dry-run` first
5. **Backup**: Keep local copies of published packages

### Verification After Publishing

```bash
# 1. Verify package exists in Nexus
npm view nodejs-app --registry http://nexus.mycompany.com:8081/repository/npm-group/

# 2. Install from Nexus to test
npm install nodejs-app --registry http://nexus.mycompany.com:8081/repository/npm-group/

# 3. Check Nexus web interface
# Navigate to: http://nexus.mycompany.com:8081/#browse/browse:npm-group
```

## Running the Application

### Development
```bash
npm run dev  # Uses Node.js --watch flag for auto-restart
```

### Production
```bash
npm start
```

## Docker

### Build the Docker image
```bash
npm run docker:build
# or
docker build -t node-app .
```

### Run the Docker container
```bash
npm run docker:run
# or
docker run -p 3000:3000 node-app
```

## Quick Publishing Commands

After completing the Nexus setup above, use these commands for publishing:

```bash
# Quick publish to configured Nexus repository
npm run publish:nexus

# Standard npm publish (uses .npmrc configuration)
npm publish

# Publish with explicit registry (bypasses .npmrc)
npm publish --registry http://nexus.mycompany.com:8081/repository/npm-group/

# Version bump and publish
npm version patch && npm publish
```

### Automated Publishing Script

For convenience, you can also use the setup script:
```bash
node setup-nexus.js
```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint
- `GET /api/status` - Application status

## Environment Variables

- `PORT` - Port number (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level (default: info)

## Project Structure

```
├── app/
│   └── server.js       # Main application file
├── .env.example        # Environment variables template
├── .env.personal       # Personal environment configuration (for project owner)
├── .gitignore          # Git ignore patterns
├── .npmrc              # npm registry configuration template
├── Dockerfile          # Docker configuration
├── package.json        # Dependencies and scripts
├── setup-nexus.js      # Interactive Nexus setup script
├── test-nexus-connection.js  # Connection testing script
├── simple-publish-test.js    # Publishing readiness test
└── README.md          # This file
```

## Git Repository Management

### Current Repository
This project is configured with the following remote:
- **Origin**: `https://gitlab.com/twn-devops-bootcamp/latest/04-build-tools/node-app.git`

### Setting Up Your Own Repository

#### Option 1: Change Origin to Your Repository
```bash
# Remove current origin
git remote remove origin

# Add your repository as origin
git remote add origin https://github.com/yourusername/your-repo.git
# or for GitLab
git remote add origin https://gitlab.com/yourusername/your-repo.git

# Push to your repository
git push -u origin master
```

#### Option 2: Add Additional Remote
```bash
# Keep original origin and add your repository
git remote add myrepo https://github.com/yourusername/your-repo.git

# Push to your repository
git push -u myrepo master
```

#### Option 3: Fork and Clone
1. Fork the original repository on GitLab/GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/node-app.git
   cd node-app
   ```

### Pushing Changes

#### First-time Setup
```bash
# Stage all files
git add .

# Commit changes
git commit -m "Initial commit: Modern Node.js app with Nexus integration"

# Push to remote repository
git push -u origin master
```

#### Regular Updates
```bash
# Stage modified files
git add .

# Commit with descriptive message
git commit -m "Update: Description of your changes"

# Push to remote
git push origin master
```

### Git Best Practices

1. **Commit Messages**: Use descriptive commit messages
2. **Staging**: Review changes before committing with `git diff`
3. **Branches**: Use feature branches for new features
4. **Security**: Never commit sensitive data (`.env` files are in `.gitignore`)
5. **Regular Pushes**: Push changes regularly to backup your work

### Working with Sensitive Data

The project is configured to exclude sensitive files:
- `.env` - Your personal environment configuration
- `.env.personal` - Personal Nexus credentials
- `node_modules/` - Dependencies
- `*.log` - Log files
- `.npmrc.personal` - Personal npm configuration

### Contributing to the Project

If you want to contribute back to the original repository:

```bash
# Add upstream remote (original repository)
git remote add upstream https://gitlab.com/twn-devops-bootcamp/latest/04-build-tools/node-app.git

# Fetch latest changes from upstream
git fetch upstream

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: Your feature description"

# Push feature branch to your fork
git push origin feature/your-feature-name

# Create pull request via GitLab/GitHub web interface
```
