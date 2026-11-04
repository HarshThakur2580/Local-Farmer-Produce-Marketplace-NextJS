// Product model schema (plain JS — to be connected to a DB later)

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} unit        - e.g. "kg", "bunch", "dozen"
 * @property {string} category    - e.g. "vegetables", "fruits", "grains"
 * @property {string} farmerId
 * @property {string} imageUrl
 * @property {boolean} isOrganic
 * @property {number} stock
 * @property {Date} createdAt
 */

/**
 * Creates a new Product object.
 * @param {Partial<Product>} data
 * @returns {Product}
 */
export function createProduct(data) {
  return {
    id: data.id || crypto.randomUUID(),
    name: data.name || '',
    description: data.description || '',
    price: data.price || 0,
    unit: data.unit || 'kg',
    category: data.category || 'vegetables',
    farmerId: data.farmerId || '',
    imageUrl: data.imageUrl || '',
    isOrganic: data.isOrganic ?? false,
    stock: data.stock || 0,
    createdAt: data.createdAt || new Date(),
  };
}

