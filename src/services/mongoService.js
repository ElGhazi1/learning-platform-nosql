// Question: Pourquoi créer des services séparés ?
// Réponse: 

const { ObjectId } = require('mongodb');

// Fonction pour récupérer un document par ID dans une collection MongoDB
async function findOneById(collection, id) {
  try {
    // Vérification si l'ID est valide avant d'effectuer la recherche
    if (!ObjectId.isValid(id)) {
      console.error(`Invalid ObjectId: ${id}`);
      throw new Error('Invalid ID format');
    }

    console.log(`Fetching document with ID: ${id}`);

    // Recherche du document par ID dans la collection
    const document = await collection.findOne({ _id: new ObjectId(id) });

    if (!document) {
      console.log(`No document found with ID: ${id}`);
      return null;  // Retourner null si aucun document n'est trouvé
    }

    console.log(`Document found with ID: ${id}`);
    return document;
  } catch (error) {
    console.error('Error finding document by ID:', error);
    throw error;  // Rejeter l'erreur pour la gestion dans le contrôleur
  }
}

module.exports = {
  findOneById
};
