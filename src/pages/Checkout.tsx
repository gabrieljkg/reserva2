import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Tenta pegar a chave pública da Vercel
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

export const Checkout = () => { 
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe não carregado');

      const response = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100 }), // Valor de teste
      });

      const session = await response.json();

      if (session.id) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        alert('Erro ao criar sessão de pagamento.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o Stripe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>Finalizar sua Reserva</h2>
      <button 
        onClick={handleCheckout}
        disabled={loading}
        style={{ 
          padding: '12px 24px', 
          backgroundColor: '#6366f1', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? 'Processando...' : 'Pagar Agora com Stripe'}
      </button>
    </div>
  );
};

