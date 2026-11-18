'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function LoginPage({ params }: { params: { locale: string } }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone.match(/^\d{10}$/)) {
      setError(t('auth.invalidPhone'));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        // response not JSON (empty), ignore
      }
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push(`/${params.locale}/login/verify?phone=${encodeURIComponent(`+91${phone}`)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value;
    router.push(`/${locale}/login`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <div className="mb-6 text-center">
          <img src="/logo.svg" alt="Gramseva" className="mx-auto mb-2 h-12" />
          <h1 className="text-2xl font-bold">{t('app.title')}</h1>
        </div>
        <select
          className="mb-4 w-full rounded border p-2"
          defaultValue={params.locale}
          onChange={switchLocale}
        >
          <option value="gu">{t('lang.gu')}</option>
          <option value="hi">{t('lang.hi')}</option>
          <option value="en">{t('lang.en')}</option>
        </select>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">{t('auth.phoneLabel')}</span>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">+91</span>
              <input
                type="tel"
                className="block w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="9876543210"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                required
                disabled={loading}
              />
            </div>
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? t('auth.sending') : t('auth.sendOtp')}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          <a href="/gu/politicians" className="text-indigo-600 hover:underline">
            {t('auth.browsePublic')}
          </a>
        </p>
      </div>
    </div>
  );
}
