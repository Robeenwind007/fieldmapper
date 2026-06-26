// Source de vérité pour la version affichée dans le footer et le bouton "Notes de version".
// À chaque modification notable de l'application, mettre à jour CURRENT_VERSION et CHANGELOG_NOTE.

export const CURRENT_VERSION = '2.6.2'

export const CHANGELOG_NOTE = {
  version: '2.6.2',
  date: '26 juin 2026',
  items: [
    'Ajout d\'un bouton "Changer de fichier" côté source, harmonisé avec celui qui existait déjà côté cible',
    'Le clic sur la zone une fois un fichier chargé ne rouvre plus le sélecteur par accident : seul le bouton dédié le fait',
  ],
}
