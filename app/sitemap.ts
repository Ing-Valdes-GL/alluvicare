import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alluvihealthcareuk.store'

  // 1. Récupérer tous les produits actifs depuis Supabase
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .eq('is_active', true)

  // 2. Créer les URLs des produits
  const productUrls = products?.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.updated_at || new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) ?? []

  // 3. URLs statiques (Accueil, Boutique, À propos)
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  return [...staticUrls, ...productUrls]
}