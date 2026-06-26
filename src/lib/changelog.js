// Source de vérité pour la version affichée dans le footer et le bouton "Notes de version".
// À chaque modification notable de l'application, mettre à jour CURRENT_VERSION et CHANGELOG_NOTE.

export const CURRENT_VERSION = '2.7.0'

export const CHANGELOG_NOTE = {
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
}
