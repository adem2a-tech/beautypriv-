import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { STATIC_PRODUCTS } from "@/data/static-products";

export function useProducts() {
  return useQuery({
    queryKey: [api.products.list.path],
    queryFn: async () => {
      try {
        const res = await fetch(api.products.list.path, { credentials: "include" });
        if (res.ok) return api.products.list.responses[200].parse(await res.json());
      } catch {
        /* API indisponible (ex. Vercel front-only) */
      }
      return STATIC_PRODUCTS;
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: [api.products.get.path, id],
    queryFn: async () => {
      try {
        const url = buildUrl(api.products.get.path, { id });
        const res = await fetch(url, { credentials: "include" });
        if (res.status === 404) return null;
        if (res.ok) return api.products.get.responses[200].parse(await res.json());
      } catch {
        /* API indisponible */
      }
      return STATIC_PRODUCTS.find((p) => p.id === id) ?? null;
    },
  });
}

export function useProductReviews(productId: number) {
  return useQuery({
    queryKey: [api.reviews.listByProduct.path, productId],
    queryFn: async () => {
      try {
        const url = buildUrl(api.reviews.listByProduct.path, { productId });
        const res = await fetch(url, { credentials: "include" });
        if (res.ok) return api.reviews.listByProduct.responses[200].parse(await res.json());
      } catch {
        /* API indisponible */
      }
      return [];
    },
    enabled: !!productId,
  });
}
