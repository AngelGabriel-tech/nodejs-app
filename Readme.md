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

## Nexus Repository Configuration

### Option 1: Automated Setup
Run the interactive setup script:
```bash
node setup-nexus.js
```

### Option 2: Manual Configuration
1. Copy `.env.example` to `.env` and fill in your Nexus credentials
2. Update `.npmrc` with your Nexus server details:
   ```
   registry=https://your-nexus-server.com/repository/npm-public/
   //your-nexus-server.com/repository/npm-public/:_authToken=${NEXUS_AUTH_TOKEN}
   always-auth=true
   ```

### Option 3: Per-command Registry
Use Nexus for specific commands without changing global config:
```bash
npm install --registry https://your-nexus-server.com/repository/npm-public/
npm publish --registry https://your-nexus-server.com/repository/npm-private/
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

## Publishing to Nexus

After configuring your Nexus repository:

```bash
# Publish to your configured Nexus repository
npm run publish:nexus

# Or publish using npm directly
npm publish
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
├── Dockerfile          # Docker configuration
├── package.json        # Dependencies and scripts
└── README.md          # This file
```
