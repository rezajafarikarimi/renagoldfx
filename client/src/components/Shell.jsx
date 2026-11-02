import { useState } from 'react';
import Ticker from './Ticker.jsx';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';
import ReferenceFooter from './ReferenceFooter.jsx';

export default function Shell({ variant = 'public', reference = false, children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={reference ? 'reference-shell' : 'flex min-h-screen flex-col'}>
      <Ticker />
      <Header reference={reference} onOpenMenu={() => setMenuOpen(true)} />
      <div className={reference ? 'reference-body' : 'mx-auto flex w-full max-w-[1600px] flex-1 gap-6 px-3 sm:px-5'}>
        <Sidebar reference={reference} variant={variant} open={menuOpen} onClose={() => setMenuOpen(false)} />
        <main className={reference ? 'reference-main' : 'min-w-0 flex-1 py-6'}>{children}</main>
      </div>
      {reference ? <ReferenceFooter /> : <Footer />}
    </div>
  );
}
