import { useEffect, useState } from 'react';
import { Megaphone, Image, Save, Plus, Pencil, Radio } from 'lucide-react';
import Shell from '../../components/Shell.jsx';
import {
  Badge,
  Button,
  Card,
  Field,
  LoadingBlock,
  PageHeader,
  Spinner,
  useToast,
} from '../../components/ui.jsx';
import { get, patch, post, useApi, ERROR_LABELS } from '../../lib/api.js';
import { useLang } from '../../lib/lang.jsx';

const EMPTY_BANNER = {
  titleFa: '',
  titleEn: '',
  subtitleFa: '',
  subtitleEn: '',
  ctaLabel: '',
  ctaHref: '',
  sort: 0,
  active: true,
};

export default function AdminContent() {
  const { L } = useLang();
  const toast = useToast();
  const { data: settingsData, loading, reload: reloadSettings } = useApi('/admin/settings');
  const { data: bannersData, reload: reloadBanners } = useApi('/admin/banners');

  const settings = settingsData?.settings || {};
  const banners = bannersData?.banners || [];

  const [announcement, setAnnouncement] = useState('');
  const [cards, setCards] = useState([]);
  const [marketSource, setMarketSource] = useState('auto');
  const [busyKey, setBusyKey] = useState('');
  const [bannerForm, setBannerForm] = useState(null);
  const [bannerId, setBannerId] = useState(null);
  const [bannerBusy, setBannerBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settingsData) {
      setAnnouncement(settings.announcement || '');
      setCards(Array.isArray(settings.service_cards) ? settings.service_cards : []);
      setMarketSource(typeof settings.market_source === 'string' ? settings.market_source : 'auto');
    }
  }, [settingsData]);

  const saveSetting = async (key, value) => {
    setBusyKey(key);
    try {
      await patch('/admin/settings', { key, value });
      toast(L('تنظیمات ذخیره شد.', 'Settings saved.'));
      reloadSettings();
    } catch (err) {
      toast(ERROR_LABELS[err.code] || err.code, 'error');
    } finally {
      setBusyKey('');
    }
  };

  const openBanner = (banner) => {
    setError('');
    if (!banner) {
      setBannerId('new');
      setBannerForm({ ...EMPTY_BANNER, sort: banners.length + 1 });
      return;
    }
    setBannerId(banner.id);
    setBannerForm({
      titleFa: banner.titleFa || '',
      titleEn: banner.titleEn || '',
      subtitleFa: banner.subtitleFa || '',
      subtitleEn: banner.subtitleEn || '',
      ctaLabel: banner.ctaLabel || '',
      ctaHref: banner.ctaHref || '',
      sort: banner.sort ?? 0,
      active: banner.active,
    });
  };

  const saveBanner = async () => {
    setBannerBusy(true);
    setError('');
    try {
      if (bannerId === 'new') {
        await post('/admin/banners', bannerForm);
        toast(L('بنر ایجاد شد.', 'Banner created.'));
      } else {
        await patch(`/admin/banners/${bannerId}`, bannerForm);
        toast(L('بنر به‌روزرسانی شد.', 'Banner updated.'));
      }
      setBannerId(null);
      reloadBanners();
    } catch (err) {
      setError(ERROR_LABELS[err.code] || err.code);
    } finally {
      setBannerBusy(false);
    }
  };

  const updateCard = (index, key, value) => {
    setCards((current) => current.map((card, i) => (i === index ? { ...card, [key]: value } : card)));
  };

  if (loading) {
    return (
      <Shell variant="admin">
        <LoadingBlock />
      </Shell>
    );
  }

  return (
    <Shell variant="admin">
      <PageHeader
        eyebrow={L('محتوا', 'Content')}
        title={L('محتوا و تنظیمات سایت', 'Content & site settings')}
        description={L(
          'بنر صفحه اصلی، اعلان سایت، کارت‌های خدمات و منبع داده نوار بازار را مدیریت کنید.',
          'Manage the hero banners, site announcement, service cards and the market ticker data source.',
        )}
      />

      <div className="grid gap-3 xl:grid-cols-[1.3fr_1fr]">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
              <Image size={14} className="text-gold" />
              {L('بنرهای صفحه اصلی', 'Hero banners')}
            </h2>
            <Button variant="ghost" size="sm" onClick={() => openBanner(null)}>
              <Plus size={13} />
              {L('افزودن', 'Add')}
            </Button>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {banners.length === 0 ? (
              <p className="px-4 py-6 text-[12px] text-mute/60">{L('بنری وجود ندارد.', 'No banners.')}</p>
            ) : (
              banners.map((banner) => (
                <div key={banner.id} className="flex items-start justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-medium text-white/90">{banner.titleFa}</p>
                    <p className="truncate text-[10.5px] text-mute/60" dir="ltr">
                      {banner.titleEn}
                    </p>
                    <p className="mt-0.5 text-[10px] text-mute/45">
                      {L('ترتیب', 'Order')}: {banner.sort} · {banner.ctaHref || '—'}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge tone={banner.active ? 'up' : 'mute'}>{banner.active ? L('فعال', 'Active') : L('غیرفعال', 'Off')}</Badge>
                    <Button variant="soft" size="sm" onClick={() => openBanner(banner)}>
                      <Pencil size={12} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <div className="space-y-3">
          <Card>
            <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
              <Megaphone size={14} className="text-gold" />
              {L('اعلان سایت', 'Site announcement')}
            </h2>
            <textarea
              className="input mt-2.5 min-h-[80px]"
              value={announcement}
              onChange={(event) => setAnnouncement(event.target.value)}
              placeholder={L('متن اعلان بالای صفحه اصلی', 'Announcement shown above the hero')}
            />
            <Button
              variant="gold"
              size="sm"
              className="mt-2.5"
              onClick={() => saveSetting('announcement', announcement)}
              disabled={busyKey === 'announcement'}
            >
              {busyKey === 'announcement' ? <Spinner className="h-3.5 w-3.5" /> : <Save size={13} />}
              {L('ذخیره اعلان', 'Save announcement')}
            </Button>
          </Card>

          <Card>
            <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
              <Radio size={14} className="text-gold" />
              {L('منبع داده نوار بازار', 'Market ticker data source')}
            </h2>
            <p className="mt-1.5 text-[11px] leading-relaxed text-mute/60">
              {L(
                'در حالت خودکار، قیمت‌ها از منابع عمومی دریافت می‌شوند و در صورت قطع اتصال، برچسب «داده نمایشی» نمایش داده می‌شود.',
                'In automatic mode prices come from public sources; if the connection fails, a “demo data” label is shown.',
              )}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <select className="input" value={marketSource} onChange={(event) => setMarketSource(event.target.value)}>
                <option value="auto">{L('خودکار (منبع عمومی)', 'Automatic (public source)')}</option>
                <option value="demo">{L('نمایشی (ثابت)', 'Demo (static)')}</option>
              </select>
              <Button
                variant="gold"
                size="sm"
                onClick={() => saveSetting('market_source', marketSource)}
                disabled={busyKey === 'market_source'}
              >
                {busyKey === 'market_source' ? <Spinner className="h-3.5 w-3.5" /> : <Save size={13} />}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-3">
        <h2 className="text-[13px] font-semibold">{L('کارت‌های خدمات', 'Service cards')}</h2>
        <p className="mt-1 text-[11px] text-mute/60">
          {L('پنج کارت زیر بنر صفحه اصلی؛ عنوان، توضیح و مقصد هر کارت.', 'The five cards below the hero: title, description and destination.')}
        </p>
        <div className="mt-3 space-y-2.5">
          {cards.map((card, index) => (
            <div key={index} className="rounded-xl border border-white/[0.07] p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label={L('عنوان (فارسی)', 'Title (Persian)')}>
                  <input className="input" value={card.titleFa || ''} onChange={(event) => updateCard(index, 'titleFa', event.target.value)} />
                </Field>
                <Field label={L('عنوان (انگلیسی)', 'Title (English)')}>
                  <input className="input" dir="ltr" value={card.titleEn || ''} onChange={(event) => updateCard(index, 'titleEn', event.target.value)} />
                </Field>
                <Field label={L('توضیح (فارسی)', 'Description (Persian)')}>
                  <input className="input" value={card.descFa || ''} onChange={(event) => updateCard(index, 'descFa', event.target.value)} />
                </Field>
                <Field label={L('توضیح (انگلیسی)', 'Description (English)')}>
                  <input className="input" dir="ltr" value={card.descEn || ''} onChange={(event) => updateCard(index, 'descEn', event.target.value)} />
                </Field>
                <Field label={L('مقصد لینک', 'Link destination')}>
                  <input className="input" dir="ltr" value={card.href || ''} onChange={(event) => updateCard(index, 'href', event.target.value)} />
                </Field>
                <Field label={L('آیکون', 'Icon')} hint={L('services, plans, copy, prop, loan', 'services, plans, copy, prop, loan')}>
                  <input className="input" dir="ltr" value={card.icon || ''} onChange={(event) => updateCard(index, 'icon', event.target.value)} />
                </Field>
              </div>
            </div>
          ))}
        </div>
        <Button
          variant="gold"
          size="sm"
          className="mt-3"
          onClick={() => saveSetting('service_cards', cards)}
          disabled={busyKey === 'service_cards'}
        >
          {busyKey === 'service_cards' ? <Spinner className="h-3.5 w-3.5" /> : <Save size={13} />}
          {L('ذخیره کارت‌ها', 'Save cards')}
        </Button>
      </Card>

      {bannerId ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6">
          <button type="button" aria-label="close" className="absolute inset-0" onClick={() => setBannerId(null)} />
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-gold/20 bg-panel p-5 shadow-panel">
            <h2 className="text-base font-semibold">
              {bannerId === 'new' ? L('بنر جدید', 'New banner') : L('ویرایش بنر', 'Edit banner')}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label={L('عنوان (فارسی)', 'Title (Persian)')}>
                <input className="input" value={bannerForm.titleFa} onChange={(event) => setBannerForm({ ...bannerForm, titleFa: event.target.value })} />
              </Field>
              <Field label={L('عنوان (انگلیسی)', 'Title (English)')}>
                <input className="input" dir="ltr" value={bannerForm.titleEn} onChange={(event) => setBannerForm({ ...bannerForm, titleEn: event.target.value })} />
              </Field>
              <Field label={L('زیرعنوان (فارسی)', 'Subtitle (Persian)')}>
                <input className="input" value={bannerForm.subtitleFa} onChange={(event) => setBannerForm({ ...bannerForm, subtitleFa: event.target.value })} />
              </Field>
              <Field label={L('زیرعنوان (انگلیسی)', 'Subtitle (English)')}>
                <input className="input" dir="ltr" value={bannerForm.subtitleEn} onChange={(event) => setBannerForm({ ...bannerForm, subtitleEn: event.target.value })} />
              </Field>
              <Field label={L('برچسب دکمه', 'CTA label')}>
                <input className="input" value={bannerForm.ctaLabel} onChange={(event) => setBannerForm({ ...bannerForm, ctaLabel: event.target.value })} />
              </Field>
              <Field label={L('لینک دکمه', 'CTA link')}>
                <input className="input" dir="ltr" value={bannerForm.ctaHref} onChange={(event) => setBannerForm({ ...bannerForm, ctaHref: event.target.value })} />
              </Field>
              <Field label={L('ترتیب', 'Order')}>
                <input className="input" type="number" dir="ltr" value={bannerForm.sort} onChange={(event) => setBannerForm({ ...bannerForm, sort: Number(event.target.value) })} />
              </Field>
              <Field label={L('وضعیت', 'Status')}>
                <select className="input" value={bannerForm.active ? '1' : '0'} onChange={(event) => setBannerForm({ ...bannerForm, active: event.target.value === '1' })}>
                  <option value="1">{L('فعال', 'Active')}</option>
                  <option value="0">{L('غیرفعال', 'Inactive')}</option>
                </select>
              </Field>
            </div>
            {error ? (
              <p className="mt-3 rounded-xl border border-down/30 bg-down/10 px-3 py-2.5 text-[12px] text-down">{error}</p>
            ) : null}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="soft" size="sm" onClick={() => setBannerId(null)}>
                {L('انصراف', 'Cancel')}
              </Button>
              <Button variant="gold" size="sm" onClick={saveBanner} disabled={bannerBusy}>
                {bannerBusy ? <Spinner className="h-3.5 w-3.5" /> : null}
                {L('ذخیره بنر', 'Save banner')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Shell>
  );
}
