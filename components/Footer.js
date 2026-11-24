import Link from 'next/link';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Farmers', href: '/farmers' },
  { label: 'Shopping Cart', href: '/cart' },
  { label: 'About Us', href: '/about' },
];

const farmerLinks = [
  { label: 'Register Your Farm', href: '/register' },
  { label: 'List Products', href: '/register' },
  { label: 'Manage Orders', href: '/login' },
  { label: 'Farmer Dashboard', href: '/login' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="font-bold text-white text-base">
                Local Farmer Marketplace
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bridging the gap between local farmers and consumers for a fresher, fairer food system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-green-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Farmers */}
          <div>
            <h4 className="font-semibold text-white mb-4">For Farmers</h4>
            <ul className="space-y-2 text-sm">
              {farmerLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-green-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📩 officialharsh2581@gmail.com</li>
              <li>📩 shubhamyadav10082001@gmail.com</li>
              <li>📩 akashbhartee@gmail.com</li>
              <li>📞 +91 7857902009, Harsh</li>
              <li>📞 +91 7851030266, Shubham</li>
              <li>📞 +91 7541945308, Akash</li>
              <li>📍 Jalandhar & Phagwara (Law Gate, Green Valley), Punjab</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>© 2026 Local Farmer Produce Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-green-400 transition-colors font-medium flex items-center gap-1">
              <span>🛡️</span> Super Admin
            </Link>
            <Link href="#" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-green-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
