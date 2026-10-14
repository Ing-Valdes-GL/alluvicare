// app/category/[id]/page.tsx — le segment s'appelle [id] mais contient le slug de la catégorie
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal'
import { SplitText } from '@/components/motion/SplitText'
import { Tilt3D } from '@/components/motion/Tilt3D'

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  // Le param s'appelle `id` (nom du dossier) : lire `slug` renvoyait toujours undefined → "Nothing Found"
  const { id: slug } = await params;

  // Requête Supabase filtrant par le slug de la catégorie et le stock disponible
  const { data: products } = await supabase
    .from('products')
    .select('*, categories!inner(*)')
    .eq('categories.slug', slug)
    .gt('stock_quantity', 0); // Filtre pour n'afficher que les produits en stock

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* SECTION BANNIÈRE (Style image_2e82e0.png) */}
      <div className="bg-[#FFF5EB] py-20 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">
           <SplitText trigger="mount" text={slug ? decodeURIComponent(slug).replace(/-/g, ' & ') : 'Category'} />
        </h1>
        <Reveal delay={0.3}>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
             Shop / {slug}
          </p>
        </Reveal>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* Affichage "Nothing Found" si aucun produit n'est en stock (image_2e82e0.png) */}
        {(!products || products.length === 0) ? (
          <Reveal variant="scale" className="text-center py-20">
            <h2 className="text-6xl font-black tracking-tighter text-gray-900 mb-4 uppercase">Nothing Found</h2>
            <p className="text-gray-400 font-medium">No products available in this category for now.</p>
          </Reveal>
        ) : (
          <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-8" stagger={0.08}>
            {products.map((product) => (
              <StaggerItem key={product.id} variant="tilt">
              <Tilt3D max={9} className="rounded-xl bg-white">
              <div className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-500">
                <div className="aspect-square bg-[#F5F5F5] p-8 flex items-center justify-center">
                  <img 
                    src={product.main_image_url} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-sm mb-3 group-hover:text-orange-600 transition-colors uppercase">
                    {product.name}
                  </h3>
                  <p className="text-[#9C27B0] font-black text-lg mb-4">
                    £{product.price}
                  </p>
                  <button className="w-full border border-gray-200 py-3 rounded-md text-[11px] font-black uppercase flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all">
                    Add To Cart
                  </button>
                </div>
              </div>
              </Tilt3D>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  )
}