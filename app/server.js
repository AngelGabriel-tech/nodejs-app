const express = require('express');
const pino = require('pino');
const pinoHttp = require('pino-http');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Pino logger
const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    formatters: {
        level: (label) => {
            return { level: label };
        }
    }
});

// Add HTTP request logging middleware
app.use(pinoHttp({ logger }));

// Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Basic route
app.get('/', (req, res) => {
    logger.info('Root endpoint accessed');
    res.json({ 
        message: 'Hello World!', 
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.get('/api/status', (req, res) => {
    logger.info('Status endpoint accessed');
    res.json({
        status: 'running',
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err, 'Unhandled error');
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    logger.warn(`404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ 
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

const server = app.listen(PORT, () => {
    logger.info(`App listening on port ${PORT}!`);
    logger.info('Environment:', process.env.NODE_ENV || 'development');
});
