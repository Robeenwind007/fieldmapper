// Source de vérité pour la version affichée dans le footer et le bouton "Notes de version".
// À chaque modification notable de l'application, mettre à jour CURRENT_VERSION et CHANGELOG_NOTE.

export const CURRENT_VERSION = '2.5.0'

export const CHANGELOG_NOTE = {
  version: '2.5.0',
  date: '26 juin 2026',
  items: [
    'Nouveau : créer un mapping "cible seule" (gabarit) sans fichier source, pratique pour publier un format de sortie standard à disposition de vos clients',
    'Possibilité de pré-configurer des valeurs fixes sur ce gabarit avant de le sauvegarder',
  ],
}
