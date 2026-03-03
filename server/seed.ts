import { db } from "./db";
import { products, reviews } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  const existingProducts = await db.select().from(products);
  if (existingProducts.length > 0) {
     await db.delete(reviews);
     await db.delete(products);
  }

  const seededProducts = await db.insert(products).values([
    {
      name: "Dyson Airwrap Multi-styler Complete Long",
      description: "Le boucleur iconique pour cheveux longs. Boucle, sculpte, lisse et maîtrise les cheveux rebelles. Sans chaleur extrême.",
      category: "Soin & beauté",
      price: 29900,
      originalPrice: 59900,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
      isFeatured: true,
      brand: "Dyson",
      partnership: "Darty",
    },
    {
      name: "GHD Platinum+",
      description: "Le lisseur intelligent qui prédit les besoins de vos cheveux. Technologie ultra-zone prédictive.",
      category: "Soin & beauté",
      price: 14900,
      originalPrice: 29900,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
      isFeatured: true,
      brand: "GHD",
      partnership: "Darty",
    },
    {
      name: "Airpods Max",
      description: "L'équilibre parfait entre un son haute fidélité impressionnant et la magie intuitive des AirPods.",
      category: "Accessoires",
      price: 31400,
      originalPrice: 62900,
      stock: 4,
      imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800",
      isFeatured: true,
      brand: "Apple",
      partnership: "Boulanger",
    },
    {
      name: "Dyson Airwrap i.d. Multistyle",
      description: "Le nouveau fer multistyle connecté pour définir votre routine cheveux via l'application MyDyson.",
      category: "Soin & beauté",
      price: 27400,
      originalPrice: 54900,
      stock: 12,
      imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
      isFeatured: true,
      brand: "Dyson",
      partnership: "Darty",
    },
    {
      name: "GHD Chronos",
      description: "Le nouveau lisseur professionnel HD motion-responsive de ghd. 2x plus de réactivité.",
      category: "Soin & beauté",
      price: 17900,
      originalPrice: 35900,
      stock: 7,
      imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
      isFeatured: false,
      brand: "GHD",
      partnership: "Darty",
    },
    {
      name: "Airpods Pro 3",
      description: "Réduction active du bruit deux fois plus performante et Audio spatial personnalisé.",
      category: "Accessoires",
      price: 13900,
      originalPrice: 27900,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1588423019284-441a0f27bc39?auto=format&fit=crop&q=80&w=800",
      isFeatured: false,
      brand: "Apple",
      partnership: "Fnac",
    }
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
