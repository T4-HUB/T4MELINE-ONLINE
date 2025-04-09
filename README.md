# T4MELINE
# FriseServicePublic



Frise Service Public est une application web proposant un jeu de construction d'une frise historique des services publics, à base de cartes

## Description du jeu

### Matériel :

Un jeu de cartes, disposant chacune de :

* Un titre
* Un type
* Un service public
* Une description
* Une date

Deux zones :

* Une pioche centrale
* Une frise centrale, de cartes disposées dans leur ordre chronologique

### Paramètres de la partie :

* Nombre de joueurs
* Nombre de points pour gagner

### Déroulement de la partie :

Une carte est tirée au sort et posée dans la frise centrale. Elle sert de point de départ.

Chaque joueur à tour de rôle :

* pioche une carte décrivant une étape historique, mais sans voir sa date
* dispose cette carte dans la frise centrale (à gauche, à droite, ou entre deux cartes déjà posées)
* si la carte est la bonne place (la chronologie est respectée), le joueur marque un point
* sinon, la carte est déplacée à la bonne place et le joueur ne marque aucun point

Le premier jouer à atteindre le nombre de points de victoire gagne

## Source des données

<https://docs.google.com/spreadsheets/d/1flhwZlPYWQPWKSotmz7wDzBZnBYAL5JJHu_-vY38zcg/edit?gid=1020174904#gid=1020174904> 

Export automatique en format csv, **qui doit être utilisé au lancement de l'application web (pas de téléchargement offline, sinon pour mise en cache).**

<https://docs.google.com/spreadsheets/d/e/2PACX-1vQlzxMUajqLjmCZ_I-NAie0g-ZxTsJqjOnj6R-w139EnpG-XY3DTJ4Hg5iTtzgnfQmSxJnhu0Tl502b/pub?gid=1517720865&single=true&output=csv> 


