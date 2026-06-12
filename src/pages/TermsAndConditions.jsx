// pages/TermsAndConditions.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Clock,
  RefreshCw,
  Truck,
  FileText,
  Users,
  Gift,
  Code,
  AlertCircle,
  ShoppingBag,
  Smartphone,
  DollarSign,
} from "lucide-react";

const TermsAndConditions = () => {
  const lastUpdated = "1er Juin 2026";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-700 to-purple-900 px-8 py-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-10 h-10" />
              <h1 className="text-3xl md:text-4xl font-bold">
                Conditions Générales d'Utilisation
              </h1>
            </div>
            <p className="text-purple-200">
              PUZZLE - Là où la mode rencontre le mystère
            </p>
            <p className="text-purple-300 text-sm mt-4">
              Dernière mise à jour : {lastUpdated}
            </p>
          </div>

          <div className="p-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-8">
              <p className="text-yellow-800 text-sm">
                <strong>⚠️ Document Juridiquement Important</strong>
                <br />
                Ces conditions générales régissent votre utilisation du site web
                et de la plateforme PUZZLE. En utilisant nos services, vous
                acceptez d'être lié par ces conditions. Veuillez les lire
                attentivement.
              </p>
            </div>

            {/* Navigation rapide */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Navigation rapide
              </h2>
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-purple-100 transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-12">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-20"
                >
                  <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-2">
                    <section.icon className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <div className="prose prose-purple max-w-none text-gray-700 space-y-4">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>

            {/* Signature & Acceptation */}
            <div className="mt-12 pt-6 border-t-2 border-gray-200">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  En naviguant sur ce site, vous acceptez nos conditions
                  générales.
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Si vous n'acceptez pas ces conditions, veuillez ne pas
                  utiliser ce site.
                </p>
                <div className="flex gap-4">
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    J'accepte les conditions
                  </Link>
                  <Link
                    to="/"
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const sections = [
  {
    id: "article-1",
    title: "Article 1 : Préambule et Objet",
    icon: FileText,
    content: (
      <>
        <p>
          Les présentes conditions générales d'utilisation (CGU) régissent
          l'accès et l'utilisation du site internet et de la plateforme{" "}
          <strong>PUZZLE</strong>, éditée par la société <strong>PUZZLE</strong>
          , inscrite au registre du commerce de Tunis sous le numéro [À
          compléter], dont le siège social est situé à [Adresse, Tunis,
          Tunisie].
        </p>
        <p>
          <strong>PUZZLE</strong> est une plateforme de commerce électronique
          innovante qui fusionne la vente d'articles de mode avec une expérience
          de jeu de piste et de résolution d'énigmes. Elle propose des
          "Enigmes", des "Chroniques" et des "Fragments" limités dont
          l'acquisition permet de participer à des mystères collaboratifs pour
          gagner des récompenses.
        </p>
        <p>
          Les présentes CGU ont pour objet de définir les droits et obligations
          des parties dans le cadre de la vente en ligne de produits et services
          proposés par <strong>PUZZLE</strong> aux consommateurs (ci-après
          dénommés "le Client" ou "le Gardien"). Conformément à la loi
          tunisienne n°98-40 du 2 juin 1998 relative aux techniques de vente et
          à la publicité commerciale [citation:3], toute vente à distance est
          soumise à des obligations d'information précontractuelle
          [citation:5][citation:8].
        </p>
      </>
    ),
  },
  {
    id: "article-2",
    title: "Article 2 : Identité et Coordonnées du Vendeur",
    icon: Users,
    content: (
      <>
        <p>
          Conformément à la législation tunisienne sur le commerce électronique
          [citation:5][citation:8], voici nos informations :
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Raison Sociale</strong> : PUZZLE
          </li>
          <li>
            <strong>Adresse du siège social</strong> : [Votre adresse complète],
            Tunis, Tunisie
          </li>
          <li>
            <strong>Numéro de téléphone</strong> : [+216 Votre numéro]
          </li>
          <li>
            <strong>Adresse e-mail</strong> :{" "}
            <a
              href="mailto:contact@puzzle.tn"
              className="text-purple-600 hover:underline"
            >
              contact@puzzle.tn
            </a>
          </li>
          <li>
            <strong>Numéro d'identification unique (matricule fiscal)</strong> :
            [À compléter]
          </li>
          <li>
            <strong>Hébergement du site</strong> : [Nom de l'hébergeur et
            coordonnées]
          </li>
        </ul>
        <p>
          Ces informations sont disponibles sur notre site conformément à
          l'article 28 de la loi n°98-40 [citation:3].
        </p>
      </>
    ),
  },
  {
    id: "article-3",
    title: "Article 3 : Produits et Commandes",
    icon: ShoppingBag,
    content: (
      <>
        <p>
          <strong>3.1. Caractéristiques des produits</strong>
        </p>
        <p>
          Les produits vendus sur PUZZLE sont de deux types : des articles de
          mode standards (prêts à porter) et des "Fragments", qui sont des
          éditions limitées et uniques. Les caractéristiques essentielles
          (description, prix, rareté, taille disponible) sont présentées sur
          chaque fiche produit. Les photographies sont fournies à titre
          indicatif.
        </p>

        <p>
          <strong>
            3.2. Le processus de commande d'un Fragment (Pré-commande
            collaborative)
          </strong>
        </p>
        <p>
          La commande d'un Fragment est un pré-achat conditionné : la
          fabrication du produit ne débutera qu'après que l'intégralité des
          fragments d'une même Chronique soit vendue. Le Client en est informé
          avant la validation de sa commande et un compteur de vente est visible
          sur la plateforme.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Le Client sélectionne un Fragment, choisit sa taille et valide sa
            commande.
          </li>
          <li>
            Un bon de commande récapitulatif lui est fourni par voie
            électronique, conformément à l'article 28 de la loi n°98-40
            [citation:3]. Ce bon mentionne : l'identité du vendeur, la
            désignation précise du Fragment, le prix, les conditions de
            paiement, les modalités de rétractation, et la nature conditionnelle
            de la fabrication.
          </li>
          <li>
            Conformément à l'article 29 de la loi n°98-40 [citation:3], le
            contrat de vente n'est définitivement conclu qu'après un délai de
            dix (10) jours ouvrables suivant l'établissement du bon de commande,
            durant lequel le Client peut exercer son droit de rétractation.
          </li>
          <li>
            La fabrication ne débutera{" "}
            <strong>qu'après la vente de tous les Fragments</strong> de la
            Chronique concernée.
          </li>
        </ul>

        <p>
          <strong>3.3. Obtention aléatoire de Fragments</strong>
        </p>
        <p>
          PUZZLE peut offrir la possibilité d'obtenir un Fragment de manière
          aléatoire lors de l'achat d'un produit standard (via un QR code,
          etc.). Il s'agit d'un avantage commercial aléatoire, dont la
          probabilité est indiquée sur le site.
        </p>
      </>
    ),
  },
  {
    id: "article-4",
    title: "Article 4 : Prix, Paiement et Sécurité",
    icon: DollarSign,
    content: (
      <>
        <p>
          <strong>4.1. Prix</strong>
        </p>
        <p>
          Les prix sont indiqués en Dinars Tunisiens (TND) toutes taxes
          comprises (TTC), incluant la TVA au taux de 19% en vigueur en Tunisie.
          Les frais de livraison sont indiqués en sus avant la validation
          définitive de la commande. PUZZLE se réserve le droit de modifier ses
          prix à tout moment, les produits étant facturés sur la base des tarifs
          en vigueur au moment de l'enregistrement de la commande.
        </p>

        <p>
          <strong>4.2. Modalités de paiement</strong>
        </p>
        <p>
          Le règlement des achats s'effectue par les moyens suivants : Carte
          Bancaire (via notre prestataire de paiement sécurisé Stripe), E-Dinar,
          ou Paiement à la livraison (uniquement pour les livraisons en
          Tunisie).
        </p>

        <p>
          <strong>
            4.3. Sécurité des paiements et conservation des données
          </strong>
        </p>
        <p>
          Conformément à la loi tunisienne n°63 de 2004 sur la protection des
          données personnelles, et face aux enjeux de sécurité des données
          personnelles [citation:2], PUZZLE s'engage à prendre toutes les
          mesures nécessaires pour assurer la sécurité et la confidentialité des
          données fournies par les Clients. Les informations relatives aux
          cartes bancaires ne sont pas conservées par PUZZLE mais directement
          traitées par notre prestataire de paiement certifié PCI-DSS.
        </p>
        <p>
          Pour rappel, le non-respect de la législation sur la protection des
          données expose à des sanctions administratives
          [citation:2][citation:6].
        </p>
      </>
    ),
  },
  {
    id: "article-5",
    title: "Article 5 : Livraison, Délais et Fabrication",
    icon: Truck,
    content: (
      <>
        <p>
          <strong>5.1. Délais de livraison indicatifs</strong>
        </p>
        <p>
          Pour les produits standards en stock, les délais de livraison varient
          de 3 à 7 jours ouvrables.
        </p>
        <p>
          Pour les Fragments, le délai de livraison est conditionné par la vente
          complète de la série. Un délai indicatif de fabrication de 6 à 8
          semaines s'ajoute à la livraison une fois le seuil de vente atteint.
          Le Client en est averti lors de sa commande.
        </p>

        <p>
          <strong>5.2. Modalités de livraison</strong>
        </p>
        <p>
          Les livraisons sont assurées par nos services de transport
          partenaires, à l'adresse indiquée par le Client lors de sa commande.
        </p>

        <p>
          <strong>5.3. Non-livraison et retard</strong>
        </p>
        <p>
          En cas de non-respect du délai de livraison initialement prévu (hors
          cas de force majeure), le Client a la possibilité d'annuler sa
          commande conformément à l'article 32 de la loi n°98-40 [citation:3].
          Le remboursement intégral sera alors effectué.
        </p>
      </>
    ),
  },
  {
    id: "article-6",
    title: "Article 6 : Droit de Rétractation et Retour",
    icon: RefreshCw,
    content: (
      <>
        <p>
          <strong>6.1. Droit de rétractation applicable (pré-commande)</strong>
        </p>
        <p>
          Conformément aux articles 29 et 31 de la loi n°98-40 [citation:3], le
          Client dispose d'un droit de rétractation.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Pour les commandes standards</strong> : un délai de dix (10)
            jours ouvrables à compter de la livraison pour retourner le produit
            non conforme à sa commande.
          </li>
          <li>
            <strong>Pour les Fragments (pré-commandes)</strong> : un droit de
            rétractation de dix (10) jours ouvrables à compter de la validation
            du bon de commande, conformément à l'article 29 [citation:3]. Passé
            ce délai, la commande est définitive.
          </li>
        </ul>
        <p>
          <strong>6.2. Procédure de retour pour les Fragments</strong>
        </p>
        <p>
          Les Fragments, en raison de leur nature unique et de leur fabrication
          à la demande, ne peuvent être ni échangés ni remboursés, sauf en cas
          de défaut de conformité ou de vice caché (conformément à la garantie
          légale, article 17 de la loi n°92-117 relative à la protection du
          consommateur [citation:5]) ou en cas de non-livraison. Le Client est
          informé de cette absence de droit de retour standard au moment de
          l'achat.
        </p>
      </>
    ),
  },
  {
    id: "article-7",
    title: "Article 7 : Obligations des Parties et Garanties",
    icon: Shield,
    content: (
      <>
        <p>
          <strong>7.1. Obligations de PUZZLE</strong>
        </p>
        <p>
          PUZZLE s'engage à fournir un service conforme aux descriptions et à
          respecter ses obligations légales de garantie. Le Client bénéficie de
          la garantie légale de conformité et de la garantie contre les vices
          cachés [citation:5]. PUZZLE s'engage également à protéger les données
          personnelles des utilisateurs conformément à la loi tunisienne 63-2004
          [citation:2].
        </p>

        <p>
          <strong>7.2. Obligations du Client</strong>
        </p>
        <p>
          Le Client s'engage à fournir des informations exactes lors de sa
          commande. Il est responsable de la conservation de ses identifiants de
          connexion. En cas de collaboration dans le cadre d'une Enigme, il
          s'engage à adopter un comportement respectueux envers les autres
          membres de la communauté.
        </p>

        <p>
          <strong>7.3. Collaboration et Résolution d'Enigmes</strong>
        </p>
        <p>
          La participation aux énigmes est soumise au respect des règles de la
          communauté. Toute tentative de fraude ou de triche pourra entraîner la
          suspension du compte et la perte des récompenses. Les Gardiens
          ("Keepers") peuvent collaborer via les outils mis à disposition
          (salons de discussion) et sont responsables de l'usage qu'ils font de
          ces espaces.
        </p>
      </>
    ),
  },
  {
    id: "article-8",
    title: "Article 8 : Propriété Intellectuelle",
    icon: Code,
    content: (
      <>
        <p>
          L'intégralité du contenu du site PUZZLE (textes, logos, vidéos,
          design, nom commercial, etc.) est la propriété exclusive de PUZZLE ou
          de ses partenaires. Toute reproduction, distribution ou utilisation
          non autorisée est interdite et constitue une contrefaçon. Les droits
          sur les marques et personnages utilisés dans les énigmes sont la
          propriété de leurs détenteurs respectifs (ex: One Piece est la
          propriété de Eiichiro Oda et Shueisha) ; PUZZLE utilise ces contenus
          sous licence ou dans le cadre d'une utilisation autorisée.
        </p>
      </>
    ),
  },
  {
    id: "article-9",
    title: "Article 9 : Responsabilité et Force Majeure",
    icon: AlertCircle,
    content: (
      <>
        <p>
          PUZZLE met en œuvre tous les moyens raisonnables pour assurer l'accès
          et le fonctionnement du site, mais ne peut garantir une disponibilité
          absolue. La responsabilité de PUZZLE ne saurait être engagée en cas de
          dommages indirects liés à l'utilisation de la plateforme. Aucune
          responsabilité ne pourra être attribuée à PUZZLE en cas de
          non-exécution dû à un cas de force majeure (conformément à la
          jurisprudence tunisienne et l'article 269 du Code des Obligations et
          des Contrats).
        </p>
      </>
    ),
  },
  {
    id: "article-10",
    title: "Article 10 : Droit Applicable et Litiges",
    icon: Users,
    content: (
      <>
        <p>
          Les présentes CGU sont régies par le droit tunisien. En cas de litige,
          le Client est invité à contacter notre service client pour trouver une
          solution amiable. Conformément à la loi tunisienne, le Client peut
          recourir, en cas d'échec de la réclamation préalable, à une procédure
          de médiation ou saisir les juridictions compétentes. Pour toute
          question relative à la protection des consommateurs, le Client peut
          contacter le ministère du Commerce via son site web [citation:5].
        </p>
        <p>
          <strong>Service client PUZZLE</strong> :{" "}
          <a href="mailto:support@puzzle.tn" className="text-purple-600">
            support@puzzle.tn
          </a>
        </p>
      </>
    ),
  },
];

export default TermsAndConditions;
