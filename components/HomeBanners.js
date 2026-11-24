export default function HomeBanners() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50/60">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Banner 1: Fresh Grocery Harvest Bag */}
          <div className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-gray-200/80 bg-white h-72 sm:h-80 lg:h-96 group transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop"
              alt="Fresh farm produce grocery bag"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          {/* Banner 2: Farm Produce & Harvest Field */}
          <div className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-gray-200/80 bg-white h-72 sm:h-80 lg:h-96 group transition-all duration-300">
            <img
              src="https://images.unsplash.com/photo-1703273839860-f47bb53bedf4?q=80&w=1200&auto=format&fit=crop"
              alt="Local farm harvest and agriculture"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
