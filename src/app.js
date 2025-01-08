// Question: Comment organiser le point d'entrée de l'application ?
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?

// Point d'entrée de l'application
const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

const courseRoutes = require('./routes/courseRoutes');

const app = express();

async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await db.connectMongo();
    console.log('MongoDB connection successful.');

    console.log('Connecting to Redis...');
    await db.connectRedis();
    console.log('Redis connection successful.');

    app.use(express.json());
    
    app.use('/courses', courseRoutes);

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  if (db.mongoClient) await db.mongoClient.close();
  if (db.redisClient) await db.redisClient.disconnect();
  console.log('Cleanly shut down connections.');
});

startServer();
