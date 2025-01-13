// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Le contrôleur contient la logique métier pour traiter les requêtes HTTP. Il contient les fonctions qui effectuent des actions comme la création, la récupération ou la modification de données. La route, quant à elle, est un "endpoint" défini pour écouter et répondre aux requêtes HTTP spécifiques (GET, POST, etc.).

// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : La séparation de la logique métier (dans les contrôleurs) et des routes permet de rendre le code plus propre, modulable et réutilisable. Les routes définissent uniquement les chemins d'accès et l'acheminement des requêtes, tandis que les contrôleurs gèrent la logique et les interactions avec la base de données ou autres services.

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const redisService = require('../services/redisService');

// TTL pour les données en cache Redis
const TTL = 3600; // 1 heure

// Contrôleur pour créer un cours
async function createCourse(req, res) {
  try {
    const { name, description, instructor, duration, level, createdAt } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const course = {
      name,
      description,
      instructor: instructor || 'Unknown',
      duration: duration || 0,
      level: level || 'Beginner',
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    };

    const result = await db.getDb().collection('courses').insertOne(course);

    res.status(201).json({ message: 'Course created successfully', courseId: result.insertedId });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).send('Internal server error');
  }
}

// Contrôleur pour récupérer un cours spécifique par ID
async function getCourse(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const redisClient = db.getRedisClient();
    const cacheKey = `course:${id}`;

    // Vérification du cache Redis
    const cachedData = await redisService.getCachedData(redisClient, cacheKey);
    if (cachedData) {
      console.log('Returning data from Redis cache');
      return res.status(200).json(cachedData);
    }

    console.log('Fetching data from MongoDB');
    const course = await db.getDb().collection('courses').findOne({ _id: new ObjectId(id) });

    if (!course) {
      console.log('Course not found in MongoDB');
      return res.status(404).json({ error: 'Course not found' });
    }

    // Mise en cache des données
    await redisService.cacheData(redisClient, cacheKey, course, TTL);
    console.log('Returning data from MongoDB');
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).send('Internal server error');
  }
}

// Contrôleur pour obtenir les statistiques des cours
async function getCourseStats(req, res) {
  try {
    const stats = await db.getDb().collection('courses').aggregate([
      { $group: { _id: null, totalCourses: { $sum: 1 } } }
    ]).toArray();

    res.status(200).json({ totalCourses: stats[0]?.totalCourses || 0 });
  } catch (error) {
    console.error('Error fetching course stats:', error);
    res.status(500).send('Internal server error');
  }
}

module.exports = {
  createCourse,
  getCourse,
  getCourseStats,
};
