import { db } from "./db";
import { products, reviews } from "@shared/schema";
import { eq } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL doit être défini. Créez un fichier .env avec DATABASE_URL=postgresql://...");
  process.exit(1);
}

async function seed() {
  if (!db) {
    console.error("Connexion base de données indisponible.");
    process.exit(1);
  }
  const existingProducts = await db.select().from(products);
  if (existingProducts.length > 0) {
     await db.delete(reviews);
     await db.delete(products);
  }

  const seededProducts = await db.insert(products).values([
    {
      name: "Multi-styler Dyson Airwrap i.d™ - cheveux bouclés à frisés (Soie Ambrée)",
      description: "Des boucles simplifiées, personnalisées juste pour votre type de cheveu. Version Soie Ambrée dédiée aux cheveux bouclés à frisés : profil capillaire dans l'app My Dyson (raides, ondulés, bouclés, crépus) et réglages envoyés à l'appareil via Bluetooth. Coffret avec diffuseur, barillet boucles, brosses lissantes et volumisantes, peigne à dents larges, étui rigide et pochette de voyage.",
      category: "Soin & beauté",
      price: 29900,
      originalPrice: 59900,
      stock: 5,
      imageUrl: "/images/airwrap-id-soie-ambree-1.png",
      isFeatured: true,
      brand: "Dyson",
      partnership: "Darty",
    },
    {
      name: "Multi-styler Dyson Airwrap i.d™ - cheveux bouclés à frisés (Bleu de Prusse/Cuivré)",
      description: "Des boucles simplifiées, personnalisées juste pour vous. Version Bleu de Prusse et cuivré : corps bleu marine, accents cuivrés. Profil capillaire dans l'app My Dyson et réglages envoyés à l'appareil via Bluetooth. Coffret avec diffuseur, barillet boucles, brosses lissantes et volumisantes, étui Bleu de Prusse et pochette de voyage.",
      category: "Soin & beauté",
      price: 29900,
      originalPrice: 59900,
      stock: 5,
      imageUrl: "/images/airwrap-id-bleu-prusse-1.png",
      isFeatured: true,
      brand: "Dyson",
      partnership: "Darty",
    },
    {
      name: "Dyson Airwrap Coanda 2x",
      description: "Multistyle Coanda avec séchage lissant, barillets boucles 30 mm et 40 mm, brosses lissantes et volumisantes. Coffret complet avec étui. Connexion Bluetooth et app My Dyson pour personnaliser les temps de coiffure.",
      category: "Soin & beauté",
      price: 32499,
      originalPrice: 64900,
      stock: 6,
      imageUrl: "/images/airwrap-coanda-2x-1.png",
      isFeatured: true,
      brand: "Dyson",
      partnership: "Darty",
    },
    {
      name: "Dyson Airwrap™ Complete Long Volumise",
      description: "Sèche. Boucle. Sculpte. Lisse et maîtrise les cheveux rebelles. Sans dommages thermiques. Multistyle complet long avec barillets boucles, brosses lissantes et volumisantes, coffret avec étui.",
      category: "Soin & beauté",
      price: 54900,
      originalPrice: 69900,
      stock: 5,
      imageUrl: "/images/dyson-airwrap-complete-long-1.png",
      isFeatured: true,
      brand: "Dyson",
      partnership: "Darty",
    },
    {
      name: "Aspirateur robot laveur Dyson Spot+Scrub™ Ai",
      description: "Détecte et élimine les taches persistantes grâce à l'IA. Aspire et lave encore et encore, jusqu'à disparition complète. Station d'accueil avec vidage automatique. Indice de réparabilité 8/10. Livré en 24/72h.",
      category: "Électroménager premium",
      price: 71900,
      originalPrice: 119900,
      stock: 4,
      imageUrl: "/images/dyson-spot-scrub-1.png",
      isFeatured: true,
      brand: "Dyson",
      partnership: "Darty",
    },
    {
      name: "Aspirateur laveur Dyson V16 Piston Animal Submarine™",
      description: "L'aspirateur 3-en-1 auto-démêlant le plus puissant : aspire, lave et se transforme en aspirateur à main. Laser pour détecter la poussière. Brosse Submarine™ 2.0 pour sols durs. Plusieurs configurations (sans-fil + 3 accessoires, ou + brosse Submarine™ + 3 accessoires, ou + 6 accessoires). Livré en 24/72h.",
      category: "Électroménager premium",
      price: 59900,
      originalPrice: 99900,
      stock: 5,
      imageUrl: "/images/dyson-v16-submarine-1.png",
      isFeatured: true,
      brand: "Dyson",
      partnership: "Darty",
    },
  ]).returning();

  await db.insert(reviews).values([
    {
      productId: seededProducts[0].id,
      customerName: "Léa R.",
      rating: 5,
      comment: "Incroyable, le Airwrap à ce prix là c'est une affaire de fou. Produit authentique vérifié !"
    },
    {
      productId: seededProducts[1].id,
      customerName: "Sarah J.",
      rating: 5,
      comment: "Qualité GHD au rendez-vous. Livraison Darty ultra rapide."
    }
  ]);

  console.log("Database seeded successfully with Dyson/Premium products");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
