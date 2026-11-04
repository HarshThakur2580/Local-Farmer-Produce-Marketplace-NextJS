// Farmer model schema (plain JS — to be connected to a DB later)

/**
 * @typedef {Object} Farmer
 * @property {string} id
 * @property {string} name
 * @property {string} farmName
 * @property {string} location
 * @property {string} bio
 * @property {string} email
 * @property {string} phone
 * @property {string} avatarUrl
 * @property {string[]} specialties  - e.g. ["vegetables", "fruits"]
 * @property {number} rating
 * @property {Date} joinedAt
 */

/**
 * Creates a new Farmer object.
 * @param {Partial<Farmer>} data
 * @returns {Farmer}
 */
export function createFarmer(data) {
  return {
    id: data.id || crypto.randomUUID(),
    name: data.name || '',
    farmName: data.farmName || '',
    location: data.location || '',
    bio: data.bio || '',
    email: data.email || '',
    phone: data.phone || '',
    avatarUrl: data.avatarUrl || '',
    specialties: data.specialties || [],
    rating: data.rating || 0,
    joinedAt: data.joinedAt || new Date(),
  };
}

