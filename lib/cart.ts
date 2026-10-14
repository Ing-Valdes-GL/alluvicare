// Panier localStorage partagé (ajout identique sur toutes les pages).
type CartLine<T> = T & { quantity: number }

export function addToCart<T extends { id: string }>(product: T, quantity = 1) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]') as CartLine<T>[]
  const existing = cart.find((item) => item.id === product.id)
  if (existing) existing.quantity += quantity
  else cart.push({ ...product, quantity })
  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated')) // badge du Header (même onglet)
}
