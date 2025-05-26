'use client';

import { useState } from 'react';
import { submitToBrevo, generateSnapToken } from '../payment/actions';
import Script from 'next/script';

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validate passwords
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm_password');
    
    if (password !== confirmPassword) {
      setMessage({ text: "❌ Password dan konfirmasi password tidak cocok", type: 'error' });
      setLoading(false);
      return;
    }

    // Format WhatsApp number
    let sms = formData.get('SMS');
    if (sms.startsWith("0")) {
      sms = "+62" + sms.slice(1);
    }

    try {
      // 1. Submit to Brevo
      const brevoData = {
        email: formData.get('email'),
        attributes: {
          FIRSTNAME: formData.get('FIRSTNAME'),
          WHATSAPP: sms,
          PASSWORD: password,
          SOURCE: "xplorer_plan_form"
        }
      };

      await submitToBrevo(brevoData);

      // 2. Prepare Midtrans transaction
      const transactionDetails = {
        transaction_details: {
          order_id: 'XPLORER-' + Math.floor(Math.random() * 1000000),
          gross_amount: 1250000
        },
        customer_details: {
          first_name: formData.get('FIRSTNAME'),
          email: formData.get('email'),
          phone: sms
        },
        item_details: [{
          id: 'xplorer-plan',
          price: 1250000,
          quantity: 1,
          name: 'Xplorer Plan Membership (1 Tahun)'
        }]
      };

      // 3. Generate Snap token
      const { token } = await generateSnapToken(transactionDetails);

      // 4. Show Midtrans payment popup
      if (typeof window !== 'undefined' && window.snap) {
        window.snap.pay(token, {
          onSuccess: (result) => {
            window.location.href = "/payment-success";
          },
          onPending: (result) => {
            window.location.href = "/payment-pending";
          },
          onError: (result) => {
            window.location.href = "/payment-error";
          },
          onClose: () => {
            setMessage({ text: "Pembayaran dibatalkan, silakan coba lagi", type: 'error' });
          }
        });
      } else {
        throw new Error('Midtrans payment gateway tidak dapat dimuat');
      }

      setMessage({ text: "✅ Pendaftaran berhasil! Memproses pembayaran...", type: 'success' });

    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: `❌ ${error.message || "Gagal terhubung ke server. Cek koneksi internet Anda."}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="beforeInteractive"
      />

      <div className="max-w-md mx-auto p-6 sm:p-10 bg-gradient-to-br from-gray-800 to-black rounded-3xl shadow-xl border border-white/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
            Dapatkan<br />Paket Xplorer Plan
          </h1>
          <h2 className="text-lg text-gray-400 font-normal mb-5">
            Join program ini dengan hanya
          </h2>
          
          <div className="flex items-end justify-center gap-3 mb-7">
            <span className="text-lg text-gray-500 line-through relative bottom-1">
              Rp 5.500.000
            </span>
            <span className="text-4xl font-bold text-white">
              Rp 1.250.000
            </span>
            <span className="text-base text-gray-400 mb-1">
              /tahun
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <label htmlFor="FIRSTNAME" className="block font-semibold text-sm text-white mb-2">
              Nama Lengkap*
            </label>
            <input
              type="text"
              id="FIRSTNAME"
              name="FIRSTNAME"
              required
              placeholder="Masukkan nama lengkap"
              className="w-full px-5 py-4 rounded-xl bg-white/10 text-white placeholder:text-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block font-semibold text-sm text-white mb-2">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="contoh@email.com"
              className="w-full px-5 py-4 rounded-xl bg-white/10 text-white placeholder:text-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label htmlFor="SMS" className="block font-semibold text-sm text-white mb-2">
              Nomor WhatsApp*
            </label>
            <input
              type="tel"
              id="SMS"
              name="SMS"
              required
              placeholder="08xxxxxxxxxx"
              className="w-full px-5 py-4 rounded-xl bg-white/10 text-white placeholder:text-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block font-semibold text-sm text-white mb-2">
              Password*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Buat password"
              className="w-full px-5 py-4 rounded-xl bg-white/10 text-white placeholder:text-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div>
            <label htmlFor="confirm_password" className="block font-semibold text-sm text-white mb-2">
              Konfirmasi Password*
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              required
              placeholder="Ulangi password"
              className="w-full px-5 py-4 rounded-xl bg-white/10 text-white placeholder:text-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-900 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-900 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-70 disabled:transform-none transition-all"
          >
            {loading ? "Mengirim data..." : "Lanjut Pembayaran"}
          </button>
        </form>
        
        {message && (
          <div className={`mt-5 p-3 rounded-lg text-center text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {message.text}
          </div>
        )}
      </div>
    </>
  );
}