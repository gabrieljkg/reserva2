
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Carrega a chave pública com segurança para Vite ou Next
const stripePromise = loadStripe(String(import.meta.env?.VITE_STRIPE_PUBLIC_KEY || ""));

// A EXPORTAÇÃO PRECISA SER ASSIM (Named Export):
export const Checkout = () => {
  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const res = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100 }), // Valor fixo de teste
      });

      const session = await res.json();
      if (session.id && stripe) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        alert('Erro: ' + (session.message || 'ID da sessão não encontrado'));
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o Stripe.');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Finalizar Reserva</h1>
      <button 
        onClick={handlePayment}
        style={{ 
          padding: '12px 24px', 
          backgroundColor: '#6366f1', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Pagar Agora com Stripe
      </button>
    </div>
  );
};

