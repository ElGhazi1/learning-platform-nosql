// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse :
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse :

// Fonctions utilitaires pour Redis
async function cacheData(client, key, data, ttl) {
  try {
    await client.set(key, JSON.stringify(data), {
      EX: ttl
    });
    console.log(`Data cached with key: ${key}`);
  } catch (error) {
    console.error('Error caching data:', error);
    throw error;
  }
}

module.exports = {
  cacheData
};