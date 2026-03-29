import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Versão simplificada para evitar erros de tipagem no Build
const stripePromise = loadStripe(String(import.meta.env.VITE_STRIPE_PUBLIC_KEY || ""));

export default function Checkout() {
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      const response = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100 }),
      });

      const session = await response.json();
      if (session.id && stripe) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao processar. Verifique o console.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button 
        onClick={handleCheckout}
        style={{ padding: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Pagar Agora
      </button>
    </div>
  );
}


