import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'Local Farmer Produce Marketplace',
  description:
    'Connecting local farmers directly with customers to provide fresh, affordable and locally grown agricultural products.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
