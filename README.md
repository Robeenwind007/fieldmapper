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

### v2.8.0 — Juin 2026
- Nouveau module **"Éclater des grilles croisées"** (accessible depuis le pied de page), indépendant du flux de mapping classique
- Détecte automatiquement une structure où plusieurs grilles tarifaires croisées sont superposées sur deux axes imbriqués : une ligne d'étiquettes (produits) + une ligne de dimensions (largeurs) en horizontal, une colonne d'étiquettes (types) + une colonne de dimensions (hauteurs) en vertical
- Détection générique (période, nombre de blocs et dimensions déduits dynamiquement), ajustable manuellement via une interface d'aperçu de la structure
- Reconstitue une grille par couple (étiquette horizontale × étiquette verticale)
- Export combinable : un seul fichier multi-onglets **ou** un fichier par grille ; format **croisé** (largeurs en colonnes, hauteurs en lignes) **ou** **liste aplatie** (Produit, Type, Largeur, Hauteur, Valeur)
- Fichiers concernés : `src/lib/gridSplitter.js`, `src/hooks/useGridSplitter.js`, `src/components/GridSplitter.jsx`, `GridStepImport.jsx`, `GridStepConfig.jsx`, `GridStepExport.jsx` ; ajout de `parseFileRaw` dans `src/lib/parser.js`

### v2.7.5 — Juin 2026
- Correctif : le lien "Changer de fichier" (`UploadZone` dans `UI.jsx`) ne réagissait plus, côté source comme côté cible. Le clic sur le bouton remontait jusqu'au `<label>` parent, qui annulait l'ouverture du sélecteur de fichier qu'on venait pourtant de déclencher. Ajout de `stopPropagation()` sur le bouton et d'une vérification de la cible de l'événement dans `handleLabelClick`.

### v2.7.4 — Juin 2026
- Correctif : l'aperçu avant export ne calculait que les 10 premières lignes, donc le tableau n'avait jamais besoin de défiler verticalement même sur un fichier de plusieurs centaines de lignes. La limite passe à 100 lignes (`StepExport.jsx`), ce qui permet un vrai scroll vertical sur les fichiers volumineux.
- Le texte du bandeau ("Aperçu — ...") indique désormais le nombre réel de lignes affichées, et précise le total du fichier source si celui-ci dépasse 100 lignes.

### v2.7.3 — Juin 2026
- Style du tableau d'aperçu à l'étape Export harmonisé avec celui de l'étape Mapping (`StepExport.jsx`) : en-tête collant sur fond gris (`bg-ink-50`) au lieu de blanc, défilement horizontal et vertical unifié sur le même conteneur

### v2.7.2 — Juin 2026
- L'étape "Export" du fil d'Ariane (`StepNav` dans `UI.jsx`) passe en coché après le téléchargement effectif du fichier, plutôt que de ne jamais se cocher puisqu'elle est la dernière étape
- Le coché disparaît si l'on revient modifier le mapping ou si l'on clique sur "Recommencer", pour ne pas laisser croire qu'un export à jour a déjà été fait

### v2.7.1 — Juin 2026
- Le bouton "Nouveautés" affiche désormais tout l'historique des versions (`CHANGELOG_HISTORY` dans `src/lib/changelog.js`), la plus récente ouverte par défaut et les précédentes accessibles en accordéon dans `ChangelogModal.jsx`

### v2.7.0 — Juin 2026
Lot de corrections UX suite aux retours de Stéphanie Gloaguen (service projet) :
- Fil d'Ariane cliquable pour revenir aux étapes déjà passées (`UI.jsx` / `App.jsx`)
- Onglet "Publics" sélectionné par défaut dans la bibliothèque si aucun mapping personnel n'existe
- Renommage de "Local" en "Personnel" (bibliothèque, modale de sauvegarde, documentation)
- Badge "Public" + tooltip explicite sur le bouton de suppression des mappings partagés
- Blocage du bouton "Aperçu et export" si une valeur fixe activée est vide, avec message explicite
- Aperçu d'export passé de 5 à 10 lignes, avec défilement vertical et en-tête collant
- Message d'avertissement à l'étape Import après un "Recommencer", rappelant que les fichiers précédents sont encore chargés
- Alignement en haut (`items-start`) des deux blocs source/cible à l'étape Import

### v2.6.3 — Juin 2026
- Passage complet sur tous les libellés visibles de l'application : correction d'une quarantaine d'accents manquants, répartis sur `UI.jsx`, `StepImport.jsx`, `StepMapping.jsx`, `StepExport.jsx`, `SheetPicker.jsx`, `MappingsLibrary.jsx`, `SaveMappingModal.jsx` (ex : Aperçu, Télécharger, Sélectionner, Générer, Sauvegardé, Mémoriser, Découpez, booléen, Visibilité, Privé...)

### v2.6.2 — Juin 2026
- Harmonisation : bouton "Changer de fichier" ajouté côté source dans `UploadZone` (`src/components/UI.jsx`), aligné sur le comportement qui n'existait jusque-là que côté cible
- Une fois un fichier chargé, cliquer sur la zone ne rouvre plus le sélecteur implicitement ; seul le bouton dédié déclenche le changement

### v2.6.1 — Juin 2026
- Correction de fautes d'accent dans les libellés des zones d'upload (« à convertir », « modèle »)

### v2.6.0 — Juin 2026
- Glisser-déposer des fichiers source et cible sur les zones d'upload, en plus du clic classique (`UploadZone` dans `src/components/UI.jsx`)
- Retour visuel (bordure et fond bordeaux) pendant le survol du fichier glissé

### v2.5.2 — Juin 2026
- Documentation intégrée (`DocumentationPage.jsx`) : suppression de la section "Déploiement", réservée à un usage technique interne. Cette information reste disponible dans ce README.

### v2.5.1 — Juin 2026
- Correctif : l'endpoint `GET /api/mappings` ne renvoyait pas la colonne `rules`, ce qui vidait silencieusement l'export JSON et le chargement d'un mapping public (les règles étaient absentes). Le détail complet est maintenant récupéré via `GET /api/mappings/:id` avant export ou chargement.
- Nouveau : lien "importer un mapping (.json) à la place du fichier" sous la zone d'upload du fichier cible, à l'étape Import — pratique pour réutiliser directement un gabarit exporté sans passer par la bibliothèque.

### v2.5.0 — Juin 2026
- Mode "mapping cible seule" (gabarit) : créer un mapping en chargeant uniquement un fichier cible, sans fichier source
- Pratique pour publier un format de sortie standard à disposition de clients, qui n'ont qu'à associer leurs propres colonnes ensuite
- Possibilité de pré-configurer des valeurs fixes sur ce gabarit avant sauvegarde (`src/components/StepMappingTargetOnly.jsx`)

### v2.4.1 — Juin 2026
- Bouton "Nouveautés" déplacé dans le pied de page, au-dessus du compteur de fichiers convertis
- Ajout d'une page de documentation complète (`src/components/DocumentationPage.jsx`), accessible depuis le pied de page
- Charte graphique bordeaux/gris HerculePro étendue à Tailwind (couleur `bordeaux`) et appliquée aux nouveaux éléments

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
