export async function fetchProductsFromAPI() {
  const res = await fetch('https://fakestoreapi.com/products')
  if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch products`)
  return res.json()
}
