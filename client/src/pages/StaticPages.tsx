import { Link } from "wouter";

function PageContainer({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-10 text-foreground">{title}</h1>
        <div className="prose prose-lg prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-p:font-medium prose-p:tracking-wide prose-p:leading-relaxed prose-a:text-primary prose-p:text-muted-foreground bg-card p-8 md:p-12 rounded-3xl border-2 border-border shadow-lg shadow-black/[0.04]">
          {children}
        </div>
      </div>
    </div>
  );
}

export function CGV() {
  return (
    <PageContainer title="Conditions Générales de Vente">
      <h2>1. Objet</h2>
      <p>Les présentes conditions générales de vente visent à définir les relations contractuelles entre Beauty Privé et l'acheteur, et les conditions applicables à tout achat effectué par le biais du site marchand.</p>
      <h2>2. Produits et Prix</h2>
      <p>Beauty Privé propose des produits de déstockage. Les stocks sont limités. Les prix figurant dans le catalogue sont des prix TTC en euros tenant compte de la TVA applicable au jour de la commande.</p>
      <h2>3. Commandes</h2>
      <p>L'acheteur, qui souhaite acheter un produit, doit obligatoirement : valider son panier, s'identifier, valider le paiement. La confirmation de la commande entraîne acceptation des présentes conditions de vente.</p>
    </PageContainer>
  );
}

export function Refund() {
  return (
    <PageContainer title="Politique de Remboursement">
      <h2>Droit de rétractation</h2>
      <p>Conformément à la législation en vigueur, vous disposez d'un délai de 14 jours à compter de la réception de vos produits pour exercer votre droit de rétractation sans avoir à justifier de motifs ni à payer de pénalité.</p>
      <h2>Conditions de retour</h2>
      <p>Les produits doivent être retournés dans leur état d'origine et complets (emballage, accessoires, notice...) permettant leur recommercialisation à l'état neuf.</p>
      <h2>Remboursement</h2>
      <p>Le remboursement sera effectué via le moyen de paiement utilisé lors de la commande sous 14 jours après réception du produit par nos services.</p>
    </PageContainer>
  );
}

export function Legal() {
  return (
    <PageContainer title="Mentions Légales">
      <h2>Éditeur du site</h2>
      <p>Beauty Privé SAS<br/>Capital social : 10 000€<br/>Siège social : Paris, France</p>
      <h2>Hébergement</h2>
      <p>Ce site est hébergé sur des serveurs sécurisés garantissant la protection de vos données.</p>
      <h2>Données personnelles</h2>
      <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et d'opposition aux données personnelles vous concernant.</p>
    </PageContainer>
  );
}

export function Cookies() {
  return (
    <PageContainer title="Politique de Cookies">
      <p className="text-lg font-medium text-foreground mb-6">Beauty Privé utilise des cookies pour améliorer votre expérience, la sécurité du site et le bon fonctionnement des services.</p>
      <h2>Qu'est-ce qu'un cookie ?</h2>
      <p>Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette, smartphone) lors de la visite d'un site. Il permet de mémoriser vos préférences, de sécuriser la navigation et d'analyser l'usage du site.</p>
      <h2>Cookies utilisés</h2>
      <p><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site (panier, session, préférence de consentement). Ils ne peuvent pas être désactivés.</p>
      <p><strong>Cookies de préférences :</strong> mémorisent vos choix (langue, consentement aux cookies) pour une durée d'un an.</p>
      <h2>Vos choix</h2>
      <p>Lors de votre première visite, vous pouvez accepter ou refuser les cookies via le bandeau affiché en bas de la page. Votre choix est enregistré et un cookie technique est déposé pour mémoriser votre préférence.</p>
      <h2>Gestion des cookies</h2>
      <p>Vous pouvez à tout moment modifier vos préférences via les paramètres de votre navigateur (Android, iOS, Chrome, Safari, Firefox, etc.). La suppression des cookies peut limiter certaines fonctionnalités du site.</p>
      <h2>Contact</h2>
      <p>Pour toute question relative aux cookies : contact@beautyprive.fr</p>
    </PageContainer>
  );
}

export function Contact() {
  return (
    <PageContainer title="Nous Contacter">
      <p>Notre service client premium est à votre écoute du lundi au vendredi de 9h à 18h.</p>
      <h3>Email</h3>
      <p>Pour toute demande concernant une commande : contact@beautyprive.fr</p>
      <h3>Téléphone</h3>
      <p>01 23 45 67 89 (Appel non surtaxé)</p>
      <p>Nous nous engageons à vous répondre dans un délai maximum de 24h ouvrées.</p>
    </PageContainer>
  );
}

export function FAQ() {
  return (
    <PageContainer title="Questions Fréquentes">
      <h2>Pourquoi vos prix sont-ils si bas ?</h2>
      <p>Beauty Privé est spécialisé dans le déstockage de produits premium. Nous rachetons les invendus, fins de séries ou anciens packagings de grandes marques pour vous les proposer à des prix défiant toute concurrence.</p>
      <h2>Les produits sont-ils neufs et authentiques ?</h2>
      <p>Absolument. Nous garantissons l'authenticité de 100% de nos produits. Ils sont neufs et n'ont jamais été utilisés.</p>
      <h2>Quels sont les délais de livraison ?</h2>
      <p>Nous expédions nos commandes sous 24h. La livraison prend ensuite 48 à 72h selon le transporteur choisi.</p>
    </PageContainer>
  );
}
