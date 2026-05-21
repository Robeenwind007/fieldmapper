# FieldMapper

Outil de mapping et conversion de fichiers tableur (XLS, XLSX, CSV, TXT).  
Traitement 100% côté navigateur — aucun fichier n'est envoyé sur un serveur.

## Stack

- **React 18** + **Vite** — frontend
- **Tailwind CSS** — styles
- **SheetJS (xlsx)** — lecture/écriture de tous les formats tableur
- **Cloudflare Pages** — hébergement statique + CDN mondial
- **Cloudflare D1** — persistance des mappings sauvegardés (SQLite serverless)
- **Cloudflare Pages Functions** — API REST légère (Workers)

---

## Fonctionnalités

### V1 — Mapping basique
- Upload de deux fichiers tableur
- Récupération automatique des en-têtes
- Mapping visuel champ par champ
- Auto-détection des colonnes au nom identique
- Export dans le format du fichier cible

### V2 — Gestion des types
- Détection automatique des types (texte, nombre, date, booléen, vide)
- Indicateur de compatibilité par champ
- Transformations contextuelles (formats de date, conversion num/texte, casse…)
- Aperçu colorisé des transformations appliquées

### V3 — Mappings persistants (Cloudflare D1)
- Sauvegarde et réutilisation de configurations de mapping
- Bibliothèque de mappings avec recherche
- Suppression des mappings obsolètes

---

## Démarrage local

```bash
# 1. Installer les dépendances
npm install

# 2. Développement (frontend uniquement, sans D1)
npm run dev

# 3. Développement avec D1 (nécessite wrangler)
npm run cf:dev
```

---

## Déploiement sur Cloudflare Pages

### Prérequis
- Compte Cloudflare (gratuit)
- `wrangler` CLI installé (`npm install -g wrangler`)
- Repo GitHub avec ce code

### Étape 1 — Authentification Wrangler

```bash
wrangler login
```

### Étape 2 — Créer la base D1

```bash
wrangler d1 create fieldmapper-db
```

Copiez l'`id` retourné et remplacez `REPLACE_WITH_YOUR_D1_DATABASE_ID` dans `wrangler.toml`.

### Étape 3 — Appliquer le schéma SQL

```bash
wrangler d1 execute fieldmapper-db --file=schema.sql
```

### Étape 4 — Connecter GitHub à Cloudflare Pages

1. Pushez ce repo sur GitHub
2. Ouvrez [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create
3. Connectez votre repo GitHub
4. Configuration du build :
   - **Framework preset** : Vite
   - **Build command** : `npm run build`
   - **Build output directory** : `dist`
5. Dans les paramètres du projet → **Bindings** → D1 Database
   - Variable name : `DB`
   - Database : `fieldmapper-db`
6. **Save and Deploy**

Cloudflare Pages redéploie automatiquement à chaque push sur `main`.

### Déploiement manuel (sans GitHub)

```bash
npm run build
npm run cf:deploy
```

---

## Structure du projet

```
fieldmapper/
├── functions/
│   └── api/
│       ├── mappings.js          # GET /api/mappings, POST /api/mappings
│       └── mappings/[id].js     # GET/PUT/DELETE /api/mappings/:id
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── UI.jsx               # Composants réutilisables
│   │   ├── StepImport.jsx       # Étape 1 — upload
│   │   ├── StepMapping.jsx      # Étape 2 — mapping & types
│   │   ├── StepExport.jsx       # Étape 3 — aperçu & export
│   │   ├── SaveMappingModal.jsx # Modal de sauvegarde
│   │   └── MappingsLibrary.jsx  # Bibliothèque de mappings
│   ├── hooks/
│   │   └── useMapper.js         # State machine centrale
│   ├── lib/
│   │   ├── types.js             # Détection de types + transformations
│   │   ├── parser.js            # Lecture/écriture fichiers (SheetJS)
│   │   └── api.js               # Client API D1
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── schema.sql                   # Schéma D1
├── wrangler.toml                # Config Cloudflare
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Coûts

Tout gratuit dans le cadre de ce projet :

| Service | Limite gratuite |
|---|---|
| Cloudflare Pages | Bande passante illimitée, 500 builds/mois |
| Cloudflare D1 | 5 millions de lectures/jour, 100 000 écritures/jour |
| Cloudflare Workers | 100 000 requêtes/jour |

---

## Roadmap V3+

- [ ] Authentification (Cloudflare Access ou magic link)
- [ ] Partage de mappings entre équipes
- [ ] Historique des conversions
- [ ] Validation des données avant export
- [ ] Support des fichiers > 10 Mo (streaming)
