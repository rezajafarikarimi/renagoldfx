import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './lib/auth.jsx';
import { LogoMark } from './components/Brand.jsx';

import Landing from './pages/Landing.jsx';
import ContentPage from './pages/ContentPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';

import Overview from './pages/dashboard/Overview.jsx';
import Profile from './pages/dashboard/Profile.jsx';
import Plans from './pages/dashboard/Plans.jsx';
import Wallet from './pages/dashboard/Wallet.jsx';
import Investments from './pages/dashboard/Investments.jsx';
import Trading from './pages/dashboard/Trading.jsx';
import Referrals from './pages/dashboard/Referrals.jsx';
import MyUsers from './pages/dashboard/MyUsers.jsx';
import Security from './pages/dashboard/Security.jsx';
import Support from './pages/dashboard/Support.jsx';

import AdminOverview from './pages/admin/Overview.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import AdminFinance from './pages/admin/Finance.jsx';
import AdminPlans from './pages/admin/Plans.jsx';
import AdminSupport from './pages/admin/Support.jsx';
import AdminContent from './pages/admin/Content.jsx';
import AdminAudit from './pages/admin/Audit.jsx';

function FullPageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LogoMark size={46} className="animate-pulse" />
        <p className="text-[11px] uppercase tracking-[0.3em] text-mute/50">RENA</p>
      </div>
    </div>
  );
}

function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  return children;
}

function AdminGate({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/services" element={<ContentPage id="services" />} />
        <Route path="/copy-trade" element={<ContentPage id="copy-trade" />} />
        <Route path="/prop" element={<ContentPage id="prop" />} />
        <Route path="/investment" element={<ContentPage id="investment" />} />
        <Route path="/loan" element={<ContentPage id="loan" />} />
        <Route path="/about" element={<ContentPage id="about" />} />
        <Route path="/contact" element={<ContentPage id="contact" />} />
        <Route path="/faq" element={<ContentPage id="faq" />} />
        <Route path="/privacy" element={<ContentPage id="privacy" />} />
        <Route path="/terms" element={<ContentPage id="terms" />} />
        <Route path="/risk" element={<ContentPage id="risk" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Protected><Overview /></Protected>} />
        <Route path="/dashboard/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/dashboard/plans" element={<Protected><Plans /></Protected>} />
        <Route path="/dashboard/wallet" element={<Protected><Wallet /></Protected>} />
        <Route path="/dashboard/investments" element={<Protected><Investments /></Protected>} />
        <Route path="/dashboard/trading" element={<Protected><Trading /></Protected>} />
        <Route path="/dashboard/referrals" element={<Protected><Referrals /></Protected>} />
        <Route path="/dashboard/users" element={<Protected><MyUsers /></Protected>} />
        <Route path="/dashboard/security" element={<Protected><Security /></Protected>} />
        <Route path="/dashboard/support" element={<Protected><Support /></Protected>} />

        <Route path="/admin" element={<AdminGate><AdminOverview /></AdminGate>} />
        <Route path="/admin/users" element={<AdminGate><AdminUsers /></AdminGate>} />
        <Route path="/admin/finance" element={<AdminGate><AdminFinance /></AdminGate>} />
        <Route path="/admin/plans" element={<AdminGate><AdminPlans /></AdminGate>} />
        <Route path="/admin/support" element={<AdminGate><AdminSupport /></AdminGate>} />
        <Route path="/admin/content" element={<AdminGate><AdminContent /></AdminGate>} />
        <Route path="/admin/audit" element={<AdminGate><AdminAudit /></AdminGate>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
