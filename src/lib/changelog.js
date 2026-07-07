// Source de vérité pour la version affichée dans le footer et le bouton "Notes de version".
// À chaque modification notable de l'application, ajouter une nouvelle entrée en tête de
// CHANGELOG_HISTORY (la plus récente en premier) et mettre à jour CURRENT_VERSION.

export const CURRENT_VERSION = '2.8.1'

export const CHANGELOG_HISTORY = [
  {
    version: '2.8.1',
    date: '7 juillet 2026',
    items: [
      'L\'accès à l\'éclatement de grilles est désormais un bouton encadré bien visible en haut de l\'écran d\'accueil, au lieu d\'un lien discret dans le pied de page',
    ],
  },
  {
    version: '2.8.0',
    date: '26 juin 2026',
    items: [
      'Nouveau module "Éclater des grilles croisées" : reconstitue automatiquement des grilles tarifaires imbriquées (ex: largeur × hauteur, répétées par produit et par type)',
      'Détection automatique des axes, ajustable manuellement, avec aperçu de la structure',
      'Export au choix : un fichier multi-onglets ou un fichier par grille, en format croisé ou en liste aplatie',
    ],
  },
  {
    version: '2.7.5',
    date: '26 juin 2026',
    items: [
      'Correctif : le lien "Changer de fichier" était devenu inopérant (source et cible) à cause d\'un conflit entre le clic du bouton et celui de la zone de dépôt',
    ],
  },
  {
    version: '2.7.4',
    date: '26 juin 2026',
    items: [
      'L\'aperçu avant export calcule désormais jusqu\'à 100 lignes (au lieu de 10), avec un vrai défilement vertical pour les fichiers volumineux',
      'Le texte du bandeau indique le nombre réel de lignes affichées, et le total du fichier si celui-ci dépasse 100 lignes',
    ],
  },
  {
    version: '2.7.3',
    date: '26 juin 2026',
    items: [
      'Style du tableau d\'aperçu (étape Export) harmonisé avec celui de l\'étape Mapping : en-tête collant sur fond gris, défilement plus net',
    ],
  },
  {
    version: '2.7.2',
    date: '26 juin 2026',
    items: [
      'L\'étape "Export" du fil d\'Ariane passe en coché après le téléchargement du fichier',
      'Le coché disparaît si l\'on revient modifier le mapping ou si l\'on clique sur "Recommencer"',
    ],
  },
  {
    version: '2.7.1',
    date: '26 juin 2026',
    items: [
      'Le bouton "Nouveautés" affiche désormais tout l\'historique des versions, la plus récente ouverte par défaut et les précédentes accessibles en accordéon',
    ],
  },
  {
    version: '2.7.0',
    date: '26 juin 2026',
    items: [
      'Fil d\'Ariane (Import / Mapping / Export) cliquable pour revenir aux étapes déjà passées',
      'Onglet "Publics" sélectionné par défaut dans la bibliothèque si aucun mapping personnel n\'existe',
      'Renommage de "Local" en "Personnel" pour plus de clarté',
      'Badge "Public" affiché sur les mappings partagés avant suppression, pour éviter toute ambiguïté',
      'Blocage de "Aperçu et export" si une valeur fixe est activée mais laissée vide',
      'Aperçu d\'export élargi à 10 lignes avec défilement',
      'Message d\'avertissement après "Recommencer" pour rappeler que les fichiers précédents restent chargés',
      'Alignement corrigé entre les blocs source et cible à l\'étape Import',
    ],
  },
  {
    version: '2.6.3',
    date: '26 juin 2026',
    items: [
      'Passage complet sur tous les libellés de l\'application : correction d\'une quarantaine d\'accents manquants',
    ],
  },
  {
    version: '2.6.2',
    date: '26 juin 2026',
    items: [
      'Bouton "Changer de fichier" ajouté côté source, harmonisé avec le comportement déjà présent côté cible',
      'Le clic sur la zone une fois un fichier chargé ne rouvre plus le sélecteur par accident',
    ],
  },
  {
    version: '2.6.1',
    date: '26 juin 2026',
    items: [
      'Correction de fautes d\'accent dans les libellés des zones d\'upload',
    ],
  },
  {
    version: '2.6.0',
    date: '26 juin 2026',
    items: [
      'Glisser-déposer des fichiers source et cible, en plus du clic classique',
      'Indicateur visuel pendant le survol du fichier glissé',
    ],
  },
  {
    version: '2.5.2',
    date: '26 juin 2026',
    items: [
      'Documentation : suppression de la section "Déploiement", réservée à un usage technique interne',
    ],
  },
  {
    version: '2.5.1',
    date: '26 juin 2026',
    items: [
      'Correctif : l\'export JSON et le chargement d\'un mapping public récupèrent désormais bien toutes les règles',
      'Lien pour importer directement un mapping .json à la place du fichier cible, à l\'étape Import',
    ],
  },
  {
    version: '2.5.0',
    date: '26 juin 2026',
    items: [
      'Nouveau : créer un mapping "cible seule" (gabarit) sans fichier source',
      'Possibilité de pré-configurer des valeurs fixes sur ce gabarit avant de le sauvegarder',
    ],
  },
  {
    version: '2.4.1',
    date: '26 juin 2026',
    items: [
      'Bouton "Nouveautés" déplacé dans le pied de page, au-dessus du compteur de fichiers convertis',
      'Ajout d\'une page de documentation complète, accessible depuis le pied de page',
      'Charte graphique bordeaux/gris HerculePro appliquée aux nouveaux éléments',
    ],
  },
  {
    version: '2.4.0',
    date: '26 juin 2026',
    items: [
      'Ajout d\'un bouton "Notes de version" pour consulter les nouveautés de l\'application',
    ],
  },
  {
    version: '2.3.1',
    date: '26 juin 2026',
    items: [
      'Mode "valeur fixe" pour les champs cibles (compatible multi-onglets / FAB-DIS)',
      'Choix explicite, à la sauvegarde d\'un mapping, de mémoriser ou non les valeurs fixes saisies',
    ],
  },
  {
    version: '2.3.0',
    date: 'Mai 2026',
    items: [
      'Support des fichiers multi-onglets (XLS, XLSX, FAB-DIS)',
      'Choix de l\'onglet, fusion de tous les onglets, ou fusion d\'onglets sélectionnés',
      'Mapping onglet par onglet pour les fichiers cibles multi-onglets, export XLSX multi-onglets',
      'Avertissement de taille fichier (orange dès 5 Mo, blocage au-delà de 20 Mo)',
    ],
  },
  {
    version: '2.2.0',
    date: 'Mai 2026',
    items: [
      'Bouton "Mappings sauvegardés" déplacé à côté de "Configurer le mapping"',
      'Compteur de fichiers convertis ajouté en pied de page',
    ],
  },
  {
    version: '2.1.0',
    date: 'Mai 2026',
    items: [
      'Modèle hybride de mappings : personnel (navigateur) et public (visible par tous)',
      'Sauvegarde et suppression publiques protégées par code administrateur',
      'Import/export JSON des mappings pour partage entre utilisateurs',
    ],
  },
  {
    version: '2.0.0',
    date: 'Mai 2026',
    items: [
      'Détection automatique des types de champs et indicateur de compatibilité',
      'Transformations contextuelles automatiques entre champs source et cible',
      'Sauvegarde et réutilisation des mappings en base de données',
      'Logo HerculePro et déploiement sur fieldmapper.fr',
    ],
  },
]

export const CHANGELOG_NOTE = CHANGELOG_HISTORY[0]
