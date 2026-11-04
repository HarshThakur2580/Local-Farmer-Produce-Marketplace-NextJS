const features = [
  {
    icon: '🥕',
    title: 'Fresh & Organic Produce',
    description:
      'Browse a wide variety of seasonal vegetables, fruits, and grains sourced directly from verified local farms.',
  },
  {
    icon: '🤝',
    title: 'Direct Farm-to-Table',
    description:
      'Cut out the middlemen. Buy directly from farmers and ensure fair prices for both buyers and growers.',
  },
  {
    icon: '📍',
    title: 'Locally Sourced',
    description:
      'Support your community by purchasing from farmers in your region, reducing food miles and carbon footprint.',
  },
  {
    icon: '💰',
    title: 'Affordable Prices',
    description:
      'Get the best value for fresh produce. Farmers set competitive prices without retail markups.',
  },
  {
    icon: '🚚',
    title: 'Fast & Reliable Delivery',
    description:
      'Choose farm pickup or doorstep delivery options that work best for your schedule and location.',
  },
  {
    icon: '⭐',
    title: 'Trusted Reviews',
    description:
      'Read verified reviews from real customers to make informed purchasing decisions every time.',
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Why Choose Our Marketplace?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We make it simple, transparent, and rewarding to buy and sell local produce.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-green-50 rounded-2xl p-7 hover:shadow-md transition-shadow border border-green-100"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

