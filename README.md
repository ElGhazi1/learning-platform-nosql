# Learning Platform NoSQL

## Table des Matières
- [Introduction](#introduction)
- [Comment Installer et Lancer le Projet](#comment-installer-et-lancer-le-projet)
- [Structure du Projet](#structure-du-projet)
- [Choix Techniques](#choix-techniques)
- [Tests et Validation](#tests-et-validation)
- [Réponses aux Questions](#réponses-aux-questions)
- [Conclusion](#conclusion)
- [Auteur](#auteur)

---

## Introduction
Ce projet est une API backend pour une plateforme d'apprentissage en ligne, élaborée dans le cadre du module NoSQL. L'objectif est de mettre en pratique les bonnes pratiques de développement d'API, tout en utilisant une base de données NoSQL pour gérer les données.

## Comment Installer et Lancer le Projet

### Prérequis
- [Node.js](https://nodejs.org/) (version 14+ recommandée)
- [MongoDB](https://www.mongodb.com/) installé localement ou accessible via un service cloud (par ex., MongoDB Atlas)
- [Redis](https://redis.io/) installé pour la gestion de la mise en cache
- Un terminal ou un environnement de développement comme VS Code

### Étapes d'installation
1. Clonez ce dépôt dans votre environnement local :
   ```bash
   git clone https://github.com/elghazi1/learning-platform-nosql
   ```

2. Accédez au dossier du projet :
   ```bash
   cd learning-platform-nosql
   ```

3. Installez les dépendances :
   ```bash
   npm install
   ```

4. Configurez les variables d'environnement dans un fichier `.env` à la racine du projet. Exemple :
   ```env
   PORT=3000
   DB_URI=mongodb://localhost:27017/learning-platform
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   JWT_SECRET=your_jwt_secret
   ```

### Lancer le Projet
Pour démarrer le serveur en mode développement :
```bash
npm run dev
```

Pour démarrer le serveur en mode production :
```bash
npm start
```

Le projet sera disponible à l'adresse suivante : [http://localhost:3000](http://localhost:3000).

![Initialisation du projet](screens/logs_sc/log-0-Cache-miss-Fetching-data-Data-cached.PNG)

## Structure du Projet
Voici une description de l'organisation du code :

```plaintext
src/
|-- config/
|   |-- db.js            # Configuration de la connexion à la base de données
|   |-- env.js           # Gestion des variables d'environnement
|-- controllers/
|   |-- courseController.js  # Logique métier liée aux cours
|-- routes/
|   |-- courseRoutes.js      # Définition des routes pour les cours
|-- services/
|   |-- mongoService.js      # Services pour MongoDB
|   |-- redisService.js      # Services pour Redis
|-- app.js                # Point d'entrée principal de l'application
```

![MongoDB avec collection](screens/MONGODB_with_courses_collection.PNG)

## Choix Techniques

### Base de données
- **MongoDB** a été choisi pour sa flexibilité dans la gestion de données non structurées et son intégration facile avec Node.js.

### Mise en cache
- **Redis** est utilisé pour la gestion de la mise en cache des données fréquemment demandées, réduisant ainsi les appels à MongoDB.

### Framework
- **Express.js** a été utilisé pour sa simplicité et sa robustesse dans la création d'API RESTful.

### Variables d'environnement
- Les paramètres sensibles comme l'URI de la base de données et les clés secrètes sont gérés via un fichier `.env` pour sécuriser les configurations.

### Gestion des erreurs
- Une gestion centralisée des erreurs permet de renvoyer des réponses cohérentes à l'utilisateur.

### Modélisation des données
- Les schémas MongoDB sont définis dans `services/mongoService.js` pour assurer la cohérence des données.

## Tests et Validation

### Outils Utilisés
- **Postman** : pour tester les routes de l'API.
- **MongoDB Compass** : pour vérifier les données insérées dans la base de données.
- **Redis Insights** : pour monitorer la gestion du cache.

### Tests Effectués

1. **Création d'un cours**
   - **URL** : POST `http://localhost:3000/courses`
   - **Payload** :
     ```json
     {
       "name": "API Basics",
       "description": "Introduction to APIs"
     }
     ```
   - **Résultat attendu** : Code 201 avec un message de succès et l'ID du cours créé.
   - **Capture d'écran** :
     ![POST Test](screens/TESTs_postman/api_create_course_201ok.PNG)

2. **Récupération d'un cours valide**
   - **URL** : GET `http://localhost:3000/courses/{id}`
   - **Résultat attendu** : Code 200 avec les détails du cours.
   - **Capture d'écran** :
     ![GET Valid ID](screens/TESTs_postman/api_get_course_200ok.PNG)

3. **Statistiques des cours**
   - **URL** : GET `http://localhost:3000/courses/stats`
   - **Résultat attendu** : Code 200 avec le total des cours.
   - **Capture d'écran** :
     ![GET Stats](screens/TESTs_postman/api_get_stats_200ok.PNG)

4. **Gestion du cache Redis**
   - **Avant ajout** : Redis était vide.
     ![Redis vide](screens/redis_insights/initially_none_inside_redis_memory.PNG)
   - **Après ajout** : Les données des cours sont mises en cache avec une durée de vie de 20 minutes.
     ![Redis avec données](screens/redis_insights/courses-set-data-added-inside-redis-memory-one-of-them-with-ttl-20min.PNG)

5. **Erreurs de cache**
   - **Cache manquant** : Données récupérées de MongoDB et mises en cache.
     ![Cache manquant](screens/logs_sc/log-0-Cache-miss-Fetching-data-Data-cached.PNG)
   - **Cache actif** : Données récupérées directement de Redis.
     ![Cache actif](screens/logs_sc/log-1-Cache-hit-Returning-data-from-Redis-cache.PNG)
   - **Redis hors service** : Erreur capturée et bascule vers MongoDB.
     ![Redis Down](screens/logs/log-3-error-redis-down.PNG)

## Réponses aux Questions

1. **Pourquoi Redis est-il utile ?**
   - Pour réduire la charge sur MongoDB et améliorer les temps de réponse.

2. **Comment gérer les erreurs critiques ?**
   - Avec une gestion centralisée des erreurs dans le serveur et des tests approfondis.

## Conclusion
Ce projet illustre les bonnes pratiques de développement pour une API backend en utilisant une base de données NoSQL et des outils modernes comme Redis pour optimiser les performances. Chaque fonctionnalité a été testée et documentée avec des captures d'écran.

## Auteur
- **Nom** : Mohamed EL GHAZI
- **Email** : mohamed.elghazi6-etu@etu.univh2c.ma
- **GitHub** : [https://github.com/ElGhazi1](https://github.com/ElGhazi1)