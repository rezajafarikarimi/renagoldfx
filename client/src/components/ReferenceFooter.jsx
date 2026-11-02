import { Link } from 'react-router-dom';
import { Send, Youtube, Instagram, Twitter } from 'lucide-react';
import ReferenceArt from './ReferenceArt.jsx';
import { useLang } from '../lib/lang.jsx';

export default function ReferenceFooter() {
  const { L } = useLang();
  return <footer className="reference-footer" dir="ltr">
    <ReferenceArt region="mountains" className="reference-footer-art" />
    <div className="reference-socials">
      {[
        ['https://t.me/rena', Send, 'Telegram'], ['https://youtube.com', Youtube, 'YouTube'],
        ['https://instagram.com', Instagram, 'Instagram'], ['https://x.com', Twitter, 'X'],
      ].map(([href, Icon, label]) => <a href={href} key={label} aria-label={label} target="_blank" rel="noreferrer noopener"><Icon size={17}/></a>)}
    </div>
    <div className="reference-footer-center"><p>RENA TRADING COUPLE <span>|</span> TWO MINDS <span>•</span> ONE VISION</p>
      <div className="reference-footer-legal"><Link to="/privacy">{L('حریم خصوصی', 'Privacy')}</Link><Link to="/terms">{L('قوانین و شرایط', 'Terms')}</Link><Link to="/risk">{L('افشای ریسک', 'Risk disclosure')}</Link></div>
    </div>
    <p className="reference-footer-signature">Trade Together<br/>Grow Together</p>
  </footer>;
}
