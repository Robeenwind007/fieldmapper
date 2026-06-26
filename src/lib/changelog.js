// Source de vérité pour la version affichée dans le footer et le bouton "Notes de version".
// À chaque modification notable de l'application, mettre à jour CURRENT_VERSION et CHANGELOG_NOTE.

export const CURRENT_VERSION = '2.5.1'

export const CHANGELOG_NOTE = {
  version: '2.5.1',
  date: '26 juin 2026',
  items: [
    'Correctif : l\'export JSON et le chargement d\'un mapping public ne récupéraient pas toujours les règles (champ "rules" manquant)',
    'Nouveau : lien pour importer directement un mapping .json à la place du fichier cible, à l\'étape Import',
  ],
}
