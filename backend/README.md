# Backend - Application Solidaire

Backend pour l'application solidaire de mise en relation d'étudiants et d'hôtes.

## 🚀 Fonctionnalités

- **Authentification JWT** - Inscription, connexion et gestion des sessions
- **Gestion des utilisateurs** - Profils étudiants et hôtes
- **Système d'offres** - Invitations et paniers anti-gaspi
- **Réservations** - Système de réservation avec statuts
- **Système d'avis** - Évaluations bidirectionnelles
- **Chat en temps réel** - Messagerie entre utilisateurs
- **Notifications** - Système de notifications push
- **Emails automatiques** - Notifications par email
- **API RESTful** - Architecture REST complète
- **Validation des données** - Validation robuste des entrées
- **Sécurité** - Middleware de sécurité et authentification

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM pour base de données
- **MariaDB** - Base de données relationnelle
- **JWT** - Authentification par tokens
- **bcrypt** - Hachage des mots de passe
- **Nodemailer** - Envoi d'emails
- **Express Validator** - Validation des données
- **Helmet** - Sécurité HTTP
- **CORS** - Gestion des requêtes cross-origin

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- MariaDB ou MySQL
- npm ou yarn

## 🔧 Installation

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd backend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   ```
   Puis éditer le fichier `.env` avec vos configurations.

4. **Configuration de la base de données**
   - Créer une base de données MariaDB/MySQL
   - Mettre à jour les variables d'environnement dans `.env`

5. **Initialiser la base de données**
   ```bash
   npm run db:setup
   ```

## 🚀 Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

L'API sera accessible sur `http://localhost:3000`

## 📚 Scripts disponibles

- `npm start` - Démarrer en mode production
- `npm run dev` - Démarrer en mode développement avec nodemon
- `npm test` - Lancer les tests
- `npm run db:setup` - Réinitialiser la base de données avec des données de démo
- `npm run db:seed-demo` - Ajouter des données de démonstration
- `npm run db:reset` - Réinitialiser complètement la base de données

## 🔐 Variables d'environnement

Créer un fichier `.env` basé sur `.env.example` :

```env
# Configuration de l'application
NODE_ENV=development
PORT=3000

# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=solidaire_db
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRES_IN=24h

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app
SMTP_FROM=noreply@solidaire.com
```

## 📖 API Documentation

### Authentification

#### POST /api/utilisateurs
Créer un nouvel utilisateur (inscription)

#### POST /api/utilisateurs/login
Connexion utilisateur

### Utilisateurs

#### GET /api/utilisateurs
Lister les utilisateurs (avec pagination et filtres)

#### GET /api/utilisateurs/:id
Récupérer un utilisateur par ID

#### PUT /api/utilisateurs/:id
Mettre à jour un utilisateur (authentification requise)

#### DELETE /api/utilisateurs/:id
Supprimer un utilisateur (authentification requise)

### Offres

#### GET /api/offres
Lister les offres (avec pagination et filtres)

#### POST /api/offres
Créer une offre (hôtes uniquement)

#### GET /api/offres/:id
Récupérer une offre par ID

#### PUT /api/offres/:id
Mettre à jour une offre (hôte propriétaire uniquement)

#### DELETE /api/offres/:id
Supprimer une offre (hôte propriétaire uniquement)

### Réservations

#### GET /api/reservations
Lister les réservations (authentification requise)

#### POST /api/reservations
Créer une réservation (étudiants uniquement)

#### GET /api/reservations/:id
Récupérer une réservation par ID

#### PUT /api/reservations/:id
Mettre à jour une réservation

#### DELETE /api/reservations/:id
Supprimer une réservation

### Avis

#### GET /api/avis
Lister les avis (avec pagination et filtres)

#### POST /api/avis
Créer un avis (authentification requise)

#### GET /api/avis/:id
Récupérer un avis par ID

#### GET /api/avis/stats/:userId
Obtenir les statistiques d'avis d'un utilisateur

#### PUT /api/avis/:id
Mettre à jour un avis

#### DELETE /api/avis/:id
Supprimer un avis

### Chat

#### GET /api/chat/salles
Lister les salles de chat de l'utilisateur

#### POST /api/chat/salles
Créer une salle de chat

#### GET /api/chat/salles/:id
Récupérer une salle de chat

#### GET /api/chat/salles/:idSalle/messages
Lister les messages d'une salle

#### POST /api/chat/messages
Envoyer un message

#### DELETE /api/chat/messages/:id
Supprimer un message

### Notifications

#### GET /api/notifications
Récupérer les notifications de l'utilisateur

#### GET /api/notifications/count
Compter les notifications non lues

#### PUT /api/notifications/:id/read
Marquer une notification comme lue

#### PUT /api/notifications/mark-all-read
Marquer toutes les notifications comme lues

## 🗄️ Structure de la base de données

### Tables principales

- **Utilisateurs** - Profils des utilisateurs (étudiants et hôtes)
- **Offres** - Offres d'invitations et paniers
- **Reservations** - Réservations des étudiants
- **Avis** - Évaluations bidirectionnelles
- **SalleDeChats** - Salles de conversation
- **Messages** - Messages du chat
- **Notifications** - Notifications utilisateur

## 🔒 Sécurité

- Authentification JWT
- Hachage des mots de passe avec bcrypt
- Validation des entrées avec express-validator
- Protection CORS
- Headers de sécurité avec Helmet
- Gestion des erreurs sécurisée

## 🧪 Tests

```bash
npm test
```

## 📝 Comptes de démonstration

Après avoir exécuté `npm run db:setup`, vous aurez accès à ces comptes :

**Hôtes :**
- marie.dupont@example.com / password123
- sophie.leroy@example.com / password123

**Étudiants :**
- paul.martin@example.com / password123
- emma.dubois@example.com / password123

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

## 📞 Support

Pour toute question ou problème, ouvrir une issue sur GitHub.