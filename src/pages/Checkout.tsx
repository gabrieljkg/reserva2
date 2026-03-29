
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Carrega a chave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

// ATENÇÃO: O nome tem que ser EXATAMENTE 'Checkout' com 'export const'
export const Checkout = () => {
  const handlePayment = async () => {
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
      }
    } catch (err) {
      alert('Erro ao processar pagamento.');
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <button 
        onClick={handlePayment}
        style={{ padding: '15px 30px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        Pagar com Stripe
      </button>
    </div>
  );
};
