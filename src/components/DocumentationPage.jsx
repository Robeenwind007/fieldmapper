import { ArrowLeft } from 'lucide-react'

function Section({ id, title, children }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-lg font-semibold text-bordeaux-800 mb-3 pb-2 border-b border-ink-100">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-ink-700 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

function SubTitle({ children }) {
  return <h3 className="text-sm font-semibold text-ink-900 mt-4 mb-1">{children}</h3>
}

function List({ items }) {
  return (
    <ul className="space-y-1.5 ml-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-bordeaux-600 mt-1.5 text-[6px]">●</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function NavLink({ href, children }) {
  return (
    <a href={href} className="block text-sm text-ink-600 hover:text-bordeaux-600 transition-colors py-1">
      {children}
    </a>
  )
}

export default function DocumentationPage({ onClose }) {
  return (
    <div className="min-h-screen bg-ink-50/40">
      <div className="sticky top-0 z-10 bg-white border-b border-ink-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-bordeaux-600 border border-bordeaux-200 hover:bg-bordeaux-50 transition-colors">
            <ArrowLeft size={14} /> Retour à l'application
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border-2 border-bordeaux-600 rounded flex items-center justify-center text-bordeaux-600 font-bold text-xs">
              H
            </div>
            <span className="text-base font-medium text-ink-900">Documentation FieldMapper</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex gap-8">
        <nav className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-xl border border-ink-100 p-4">
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-2">Sommaire</p>
            <NavLink href="#intro">Présentation</NavLink>
            <NavLink href="#mapping">Mapping visuel</NavLink>
            <NavLink href="#valeur-fixe">Valeur fixe</NavLink>
            <NavLink href="#multi-onglets">Multi-onglets &amp; FAB-DIS</NavLink>
            <NavLink href="#types">Détection des types</NavLink>
            <NavLink href="#transformations">Transformations</NavLink>
            <NavLink href="#mappings">Mappings sauvegardés</NavLink>
            <NavLink href="#limites">Limites fichiers</NavLink>
            <NavLink href="#deploiement">Déploiement</NavLink>
          </div>
        </nav>

        <div className="flex-1 bg-white rounded-2xl border border-ink-100 p-8 max-w-3xl">

          <Section id="intro" title="Présentation">
            <p>
              FieldMapper est un outil de mapping et de conversion de fichiers tableur
              (XLS, XLSX, CSV, TXT, FAB-DIS). Tout le traitement se fait côté navigateur :
              aucun fichier n'est envoyé sur un serveur, ce qui garantit la confidentialité
              des données traitées.
            </p>
            <p>
              L'application fonctionne en trois étapes : <strong>Import</strong> des fichiers
              source et cible, <strong>Mapping</strong> des champs avec détection automatique
              des types, puis <strong>Export</strong> du fichier converti.
            </p>
          </Section>

          <Section id="mapping" title="Mapping visuel">
            <p>
              Une fois les deux fichiers chargés, FieldMapper tente un mapping automatique
              en associant les colonnes au nom identique (insensible à la casse et aux espaces).
            </p>
            <List items={[
              'Pour chaque champ cible, un menu déroulant propose tous les champs source disponibles.',
              'Un champ source déjà attribué à une autre colonne cible disparaît des listes restantes, pour éviter les doublons involontaires.',
              'La sélection peut être modifiée à tout moment avant l\'export.',
            ]} />
            <SubTitle>Mapping "cible seule" (gabarit)</SubTitle>
            <p>
              Si seul un fichier cible est chargé, un lien apparaît pour créer un mapping
              "cible seule" : un gabarit basé uniquement sur la structure du fichier de
              sortie attendu, sans fichier source associé. Pratique pour publier un format
              standard à disposition de plusieurs clients, qui n'auront ensuite qu'à
              associer leurs propres colonnes source en chargeant ce mapping depuis la
              bibliothèque. Des valeurs fixes peuvent y être préconfigurées avant
              sauvegarde.
            </p>
          </Section>

          <Section id="valeur-fixe" title="Valeur fixe">
            <p>
              Certains champs cibles ont besoin d'une valeur identique sur toutes les lignes,
              quel que soit le contenu du fichier source — par exemple un identifiant de
              fournisseur, un coefficient de vente, ou un GUID de liaison.
            </p>
            <SubTitle>Comment l'utiliser</SubTitle>
            <List items={[
              'Dans le menu déroulant du champ source, choisir l\'option « 📌 Valeur fixe… ».',
              'Un champ de saisie libre apparaît : la valeur tapée sera recopiée à l\'identique sur toutes les lignes exportées.',
              'Une flèche permet de revenir au mapping normal depuis une colonne source.',
            ]} />
            <SubTitle>Compatibilité multi-onglets</SubTitle>
            <p>
              En mode « mapper onglet par onglet » (fichiers FAB-DIS), chaque onglet conserve
              ses propres valeurs fixes indépendamment des autres.
            </p>
            <SubTitle>Sauvegarde dans un mapping</SubTitle>
            <p>
              Lorsqu'un mapping contenant une valeur fixe est sauvegardé, une case à cocher
              permet de choisir si la valeur saisie doit être mémorisée ou non. Par défaut,
              seul le <em>mode</em> « valeur fixe » est conservé : la saisie sera à refaire à
              chaque réutilisation du mapping, ce qui évite de réinjecter par erreur une
              ancienne valeur (un fournisseur différent, par exemple).
            </p>
          </Section>

          <Section id="multi-onglets" title="Multi-onglets & FAB-DIS">
            <p>
              Le FAB-DIS est un standard d'échange de données produits entre fabricants et
              distributeurs du bâtiment, structuré en plusieurs onglets Excel reliés par une
              référence fabricant commune.
            </p>
            <SubTitle>Fichier source multi-onglets</SubTitle>
            <List items={[
              'Lire un seul onglet spécifique.',
              'Fusionner tous les onglets (jointure sur Reference_Fabricant).',
              'Fusionner uniquement les onglets sélectionnés.',
            ]} />
            <SubTitle>Fichier cible multi-onglets</SubTitle>
            <List items={[
              'Lire un seul onglet.',
              'Mapper onglet par onglet, pour générer un fichier de sortie multi-onglets (mode FAB-DIS).',
            ]} />
            <p>
              En mode « onglet par onglet », un indicateur visuel signale les onglets déjà
              configurés (coche verte) et l'onglet actif. Le choix d'onglets est restauré si
              l'on revient à l'étape d'import.
            </p>
          </Section>

          <Section id="types" title="Détection des types">
            <p>
              Chaque colonne est analysée automatiquement sur l'ensemble de ses valeurs pour
              déterminer son type : texte, nombre, date, booléen ou vide. Un badge de
              compatibilité (OK / différence) indique si les types source et cible
              correspondent.
            </p>
          </Section>

          <Section id="transformations" title="Transformations">
            <p>
              Lorsque les types source et cible diffèrent, des transformations contextuelles
              sont proposées automatiquement :
            </p>
            <List items={[
              'Texte → nombre : extraction du nombre, suppression des caractères non numériques.',
              'Nombre → texte : format FR (virgule décimale) ou EN (point décimal).',
              'Texte → date : formats FR (JJ/MM/AAAA), ISO, ou EN.',
              'Booléen → texte : Oui/Non, True/False, ou 1/0.',
              'Texte : MAJUSCULES, minuscules, ou suppression des espaces (trim).',
              'Nombre : arrondi à l\'entier ou à 2 décimales.',
            ]} />
          </Section>

          <Section id="mappings" title="Mappings sauvegardés">
            <p>
              Une configuration de mapping (association des champs, transformations, valeurs
              fixes) peut être sauvegardée pour être réutilisée plus tard sans repasser par
              le mapping manuel.
            </p>
            <SubTitle>Privé (local)</SubTitle>
            <p>
              Stocké dans le navigateur (localStorage). Visible uniquement sur l'appareil
              courant, sans code requis pour sauvegarder ou supprimer.
            </p>
            <SubTitle>Public (partagé)</SubTitle>
            <p>
              Stocké en base Cloudflare D1, visible par tous les utilisateurs de
              fieldmapper.fr. Un code administrateur est requis pour publier ou supprimer
              un mapping public.
            </p>
            <SubTitle>Import / export JSON</SubTitle>
            <p>
              Chaque mapping peut être exporté en fichier .json pour être partagé entre
              collègues, puis réimporté en mapping local sur un autre poste.
            </p>
          </Section>

          <Section id="limites" title="Limites fichiers">
            <List items={[
              'Avertissement (orange) pour un fichier entre 5 Mo et 20 Mo : le traitement peut être lent sur certains appareils.',
              'Blocage (rouge) au-delà de 20 Mo : risque de crash du navigateur, il est recommandé de découper le fichier.',
              'Limite pratique recommandée : 10 Mo / 50 000 lignes environ.',
            ]} />
          </Section>

          <Section id="deploiement" title="Déploiement">
            <p>
              FieldMapper est une application React/Vite déployée sur Cloudflare Pages, avec
              une base Cloudflare D1 pour la persistance des mappings publics et des Pages
              Functions pour l'API REST légère.
            </p>
            <p>
              Le détail technique de la stack, de la structure du projet et des commandes de
              déploiement est disponible dans le fichier <code className="px-1.5 py-0.5 rounded bg-ink-50 text-ink-800 text-xs">README.md</code> du dépôt.
            </p>
          </Section>

          <p className="text-xs text-ink-300 pt-4 border-t border-ink-100">
            © Olivier BERNARD pour HerculePro 2026
          </p>

        </div>
      </div>
    </div>
  )
}
