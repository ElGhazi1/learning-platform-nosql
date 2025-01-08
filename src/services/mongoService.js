// Question: Pourquoi créer des services séparés ?
// Réponse: 

const { ObjectId } = require('mongodb');

async function findOneById(collection, id) {
  try {
    return await collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error('Error finding document by ID:', error);
    throw error;
  }
}

module.exports = {
  findOneById
};