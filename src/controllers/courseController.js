// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: 

// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : 

const { ObjectId } = require('mongodb');
const db = require('../config/db');

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

    const course = await db.getDb().collection('courses').findOne({ _id: new ObjectId(id) });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

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
