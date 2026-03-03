import { db } from "./db";
import { products, reviews } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  const existingProducts = await db.select().from(products);
  if (existingProducts.length > 0) {
    console.log("Database already seeded");
    return;
  }

  const seededProducts = await db.insert(products).values([
    {
      name: "Sérum Anti-Âge Premium",
      description: "Un sérum révolutionnaire pour une peau éclatante de jeunesse. Enrichi en acide hyaluronique.",
      category: "Soin & beauté",
      price: 4900,
      originalPrice: 12000,
      stock: 45,
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800",
      isFeatured: true,
    },
    {
      name: "Sèche-cheveux Ionique Pro",
      description: "Technologie ionique avancée pour un séchage ultra-rapide sans abîmer les cheveux.",
      category: "Électroménager premium",
      price: 8900,
      originalPrice: 19900,
      stock: 12,
      imageUrl: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=800",
      isFeatured: true,
    },
    {
      name: "Sac à Main Cuir Nude",
      description: "Design minimaliste et cuir véritable de haute qualité. Le compagnon idéal au quotidien.",
      category: "Accessoires",
      price: 15900,
      originalPrice: 35000,
      stock: 5,
      imageUrl: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800",
      isFeatured: true,
    },
    {
      name: "Crème Hydratante Nuit",
      description: "Hydratation intense pendant votre sommeil pour un réveil en beauté.",
      category: "Soin & beauté",
      price: 2900,
      originalPrice: 6500,
      stock: 80,
      imageUrl: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=800",
      isFeatured: false,
    },
    {
      name: "Épilateur à Lumière Pulsée",
      description: "Résultats professionnels à domicile pour une peau douce durablement.",
      category: "Électroménager premium",
      price: 12900,
      originalPrice: 29900,
      stock: 2,
      imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800",
      isFeatured: false,
    },
    {
      name: "Montre Minimaliste Dorée",
      description: "Une touche d'élégance intemporelle à votre poignet.",
      category: "Accessoires",
      price: 7900,
      originalPrice: 15000,
      stock: 18,
      imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
      isFeatured: true,
    }
  ]).returning();

  console.log("Inserted products:", seededProducts.length);

  await db.insert(reviews).values([
    {
      productId: seededProducts[0].id,
      customerName: "Sophie M.",
      rating: 5,
      comment: "Produit incroyable, je vois la différence après seulement une semaine !"
    },
    {
      productId: seededProducts[1].id,
      customerName: "Claire D.",
      rating: 4,
      comment: "Très efficace et léger. Je recommande."
    },
    {
      productId: seededProducts[2].id,
      customerName: "Marie T.",
      rating: 5,
      comment: "Superbe sac, très belle qualité. L'envoi a été très rapide."
    }
  ]);

  console.log("Database seeded successfully");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
