import { useState } from 'react';
import Ticker from './Ticker.jsx';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';

export default function Shell({ variant = 'public', children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Ticker />
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 gap-6 px-3 sm:px-5">
        <Sidebar variant={variant} open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className="min-w-0 flex-1 py-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
