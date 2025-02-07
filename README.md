## 𝕏²

𝕏² C'est comme 𝕏, mais en mieux.

Wassim Bacha

[Evaluation](https://gist.github.com/Punkte/71aa7808c6b14896f2d6566633c9e519)

Réseau social fait en GraphQL, Vue & TypeScript.
Base de données en MySQL.

# Comment initialiser le projet :

## 🔹 Pré-requis

- Node.js (v16+)

- WampServer (ou tout autre serveur MySQL local)

- Git (pour cloner le projet)

# 📌 Étape 1 : Cloner le projet

Ouvrez un terminal et exécutez :

``git clone https://github.com/abwii/GraphQL-eval``

``cd GraphQL-Social-Network``

# 📌 Étape 2 : Installer les dépendances

Exécutez cette commande pour installer les modules nécessaires côté serveur et client :

```npm install```

# 📌 Étape 3 : Configuration de la Base de Données MySQL


Lancez WampServer et assurez-vous que Apache et MySQL sont en vert.

Ouvrez phpMyAdmin (http://localhost/phpmyadmin).

Connectez-vous avec utilisateur : root et mot de passe : (vide par défaut).

Dans phpMyAdmin, créez une nouvelle base de données nommée :

``` CREATE DATABASE social_network; ```

Ajoutez le .env suivant 

.env :
```
DATABASE_URL="mysql://root:@localhost:3306/social_network"
JWT_SECRET="supersecretkey"
```

# 📌 Étape 4 : Migration

Dans le dossier server :

```npx prisma generate```

```npx prisma migrate dev --name init```

# 📌 Étape 5 : Executer le projet

faire la même commande dans client & server :

```npm run dev```

Et voilà ça devrait marcher 🤞
