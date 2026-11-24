const aboutBannerImages = [
  {
    src: 'https://images.unsplash.com/photo-1620901433789-1d2f85a93653?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    alt: 'Local farm produce',
    span: 'md:col-span-3',
  },
  {
    src: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=643&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    alt: 'Fresh harvest in agriculture',
    span: 'md:col-span-3',
  },
  {
    src: 'https://plus.unsplash.com/premium_vector-1723128398558-6ab14043e6d8?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    alt: 'Farm to table illustration',
    span: 'md:col-span-2',
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1711697144877-b068f748bcd1?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    alt: 'Farmer harvesting crops',
    span: 'md:col-span-2',
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1661409151761-31d12ede6870?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    alt: 'Fresh organic vegetables',
    span: 'sm:col-span-2 md:col-span-2',
  },
];

export default function AboutBanners() {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50/60">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6 lg:gap-8">
          {aboutBannerImages.map((img, idx) => (
            <div
              key={idx}
              className={`${img.span} relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-gray-200/80 bg-white h-64 sm:h-72 lg:h-80 group transition-all duration-300`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
