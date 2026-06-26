# FieldMapper — HerculePro

Outil de mapping et conversion de fichiers tableur (XLS, XLSX, CSV, TXT, FAB-DIS).
Traitement 100% côté navigateur — aucun fichier n'est envoyé sur un serveur.

**URL de production** : https://fieldmapper.fr
**URL de secours** : https://fieldmapper.pages.dev

---

## Stack technique

- **React 18** + **Vite** — frontend
- **Tailwind CSS** — styles
- **SheetJS (xlsx)** — lecture/ecriture de tous les formats tableur y compris multi-onglets
- **Cloudflare Pages** — hebergement statique + CDN mondial
- **Cloudflare D1** — persistance des mappings publics (SQLite serverless)
- **Cloudflare Pages Functions** — API REST legere (Workers)
- **localStorage** — persistance des mappings prives (navigateur)

---

## Convention de version et de changelog

**À chaque modification notable de l'application**, mettre à jour :

1. `src/lib/changelog.js` :
   - `CURRENT_VERSION` → nouveau numéro de version
   - `CHANGELOG_NOTE` → remplacer par la note de la nouvelle version (date + liste des changements). Cette note est affichée dans le bouton "Nouveautés" en haut à droite du logo dans l'application — elle ne montre que la dernière version, pas l'historique.
2. Ce README (section "Historique des versions" ci-dessous) → ajouter une entrée pour garder une trace complète, contrairement au modal qui n'affiche que la dernière.

Le footer de l'application affiche automatiquement `v{CURRENT_VERSION}` — pas besoin de le modifier manuellement ailleurs dans le code.

---

## Historique des versions

### v2.4.0 — Juin 2026
- Ajout d'un bouton "Notes de version" en haut à droite du logo
- Modal affichant la note de la dernière version (`src/components/ChangelogModal.jsx`)
- Source de vérité centralisée pour la version (`src/lib/changelog.js`)

### v2.3.1 — Juin 2026
- Réintégration et adaptation du mode "valeur fixe" pour les champs cibles (compatible multi-onglets / FAB-DIS)
- Choix explicite, à la sauvegarde d'un mapping, de mémoriser ou non les valeurs fixes saisies

### v2.3.0 — Mai 2026
- Support des fichiers multi-onglets (XLS, XLSX, FAB-DIS)
- SheetPicker : choix de l'onglet, fusion de tous les onglets, fusion d'onglets sélectionnés
- Mapping onglet par onglet pour les fichiers cibles multi-onglets
- Export XLSX multi-onglets (génération de fichiers FAB-DIS)
- Restauration du SheetPicker au retour arrière depuis l'étape mapping
- Indicateur d'onglets complétés / à faire dans l'étape mapping
- Avertissement taille fichier : orange > 5 Mo, rouge bloquant > 20 Mo

### v2.2.0 — Mai 2026
- Bouton "Mappings sauvegardés" déplacé à côté de "Configurer le mapping"
- Couleur bouton Mappings : `#c02226`, fond actif `#e4b9ba`
- Suppression du lien "Mappings sauvegardés" en haut à droite
- Compteur de fichiers convertis en bas à gauche (localStorage)

### v2.1.0 — Mai 2026
- Modèle hybride de mappings : Local (navigateur) et Public (D1, visible par tous)
- Sauvegarde publique protégée par code administrateur
- Suppression publique protégée par code administrateur
- Suppression locale avec confirmation visuelle (box centrée, sans alert système)
- Onglets Local / Publics dans la bibliothèque de mappings
- Import/export JSON des mappings pour partage entre utilisateurs

### v2.0.0 — Mai 2026
- Détection automatique des types de champs (texte, nombre, date, booléen, vide)
- Indicateur de compatibilité par champ mappé
- Transformations contextuelles automatiques (formats de date, conversion num/texte, casse)
- Aperçu colorisé des transformations appliquées
- Sauvegarde et réutilisation des mappings en base Cloudflare D1
- Chargement d'un mapping sauvegardé sans recharger le fichier cible
- Logo HerculePro, copyright et version en pied de page
- Déploiement sur Cloudflare Pages + domaine fieldmapper.fr

### v1.0.0 — Mai 2026
- Upload de deux fichiers tableur (XLS, XLSX, CSV, TXT)
- Récupération automatique des en-têtes de colonnes
- Mapping visuel champ par champ
- Auto-détection des colonnes au nom identique
- Export dans le format du fichier cible

---

## Fonctionnalités

### Mapping visuel
- Upload fichier source (à convertir) et fichier cible (format de destination)
- Auto-mapping des colonnes au nom identique (insensible à la casse)
- Sélection manuelle pour chaque champ non mappé automatiquement
- Les champs source déjà attribués disparaissent des listes déroulantes restantes

### Valeur fixe (v2.3.1+)
- Pour un champ cible, possibilité de saisir une valeur constante (GUID, coefficient, nom fournisseur...) plutôt qu'un mapping depuis une colonne source
- La valeur est recopiée à l'identique sur toutes les lignes exportées
- Compatible avec le mode multi-onglets (chaque onglet garde ses propres valeurs fixes)
- À la sauvegarde d'un mapping, choix explicite de mémoriser ou non la valeur saisie (par défaut : non)

### Support multi-onglets & FAB-DIS
- Détection automatique des fichiers multi-onglets à l'upload
- SheetPicker pour le fichier source :
  - Lire un seul onglet spécifique
  - Fusionner tous les onglets sur Reference_Fabricant
  - Fusionner les onglets sélectionnés sur Reference_Fabricant
- SheetPicker pour le fichier cible :
  - Lire un seul onglet
  - Mapper onglet par onglet (mode FAB-DIS)
- Export XLSX multi-onglets avec les données mappées par onglet
- Restauration du choix d'onglets au retour arrière

### Détection des types
- Analyse automatique de chaque colonne sur l'ensemble des valeurs
- Types détectés : texte, nombre, date, booléen, vide
- Indicateur de compatibilité source/cible par champ

### Transformations
- Texte vers nombre : extraction, suppression non-numériques
- Nombre vers texte : format FR (virgule) ou EN (point)
- Texte vers date : formats FR (JJ/MM/AAAA), ISO, EN
- Booléen vers texte : Oui/Non, True/False, 1/0
- Texte : MAJUSCULES, minuscules, trim
- Nombre : arrondi entier ou 2 décimales

### Mappings — modèle hybride

**Local (privé)**
- Stocké dans le localStorage du navigateur
- Visible uniquement sur l'appareil courant
- Pas de code requis pour sauvegarder ou supprimer
- Persiste jusqu'à la suppression manuelle ou le vidage du cache

**Public (partagé)**
- Stocké en base D1 Cloudflare
- Visible par tous les utilisateurs connectés à fieldmapper.fr
- Code administrateur requis pour publier et pour supprimer

### Import / Export JSON
- Export d'un mapping en fichier .json (bouton sur chaque mapping)
- Import d'un fichier .json pour ajouter un mapping en local
- Format portable pour partage entre collègues

### Limites fichiers
- Avertissement orange : fichier entre 5 Mo et 20 Mo
- Erreur rouge + bouton bloqué : fichier au-dessus de 20 Mo
- Limite pratique recommandée : 10 Mo / 50 000 lignes

---

## Structure du projet

```
fieldmapper/
├── functions/
│   └── api/
│       ├── mappings.js
│       └── mappings/[id].js
├── public/
│   ├── favicon.svg
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── UI.jsx
│   │   ├── StepImport.jsx
│   │   ├── StepMapping.jsx
│   │   ├── StepExport.jsx
│   │   ├── SheetPicker.jsx
│   │   ├── SaveMappingModal.jsx
│   │   ├── MappingsLibrary.jsx
│   │   └── ChangelogModal.jsx
│   ├── hooks/
│   │   └── useMapper.js
│   ├── lib/
│   │   ├── types.js
│   │   ├── parser.js
│   │   ├── api.js
│   │   └── changelog.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── schema.sql
├── wrangler.toml
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Déploiement

```bash
npm install
npm run build
git add -A
git commit -m "..."
git push origin main
```

Cloudflare Pages redéploie automatiquement à chaque push sur `main` (build command : `npm run build`, output : `dist`).
