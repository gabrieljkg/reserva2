import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(String(import.meta.env?.VITE_STRIPE_PUBLIC_KEY || ""));

export const Checkout = () => { // Exportação nomeada para combinar com o seu App.tsx
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      const res = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100 }), 
      });

      const session = await res.json();
      if (session.id && stripe) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        alert('Erro: ' + (session.message || 'Sessão não gerada'));
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <button 
        onClick={handlePayment}
        disabled={loading}
        style={{ padding: '15px 30px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        {loading ? 'Carregando...' : 'Pagar com Stripe'}
      </button>
    </div>
  );
};



