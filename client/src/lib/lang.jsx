import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('rena_lang') || 'fa');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    localStorage.setItem('rena_lang', lang);
  }, [lang]);

  const L = useCallback((fa, en) => (lang === 'fa' ? fa : en || fa), [lang]);

  const value = useMemo(() => ({ lang, setLang, L, dir: lang === 'fa' ? 'rtl' : 'ltr' }), [lang, L]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used inside LangProvider');
  return context;
}
