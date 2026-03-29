import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Tenta carregar a chave de dois jeitos para não dar erro
const stripeKey = (import.meta.env?.VITE_STRIPE_PUBLIC_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) as string;
const stripePromise = loadStripe(stripeKey);

export default function Checkout() {
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      const response = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100 }), // Valor fixo para teste
      });

      const session = await response.json();
      if (session.id) {
        await stripe?.redirectToCheckout({ sessionId: session.id });
      } else {
        alert('Erro: Servidor não retornou ID da sessão.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro na conexão com o servidor de pagamento.');
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Finalizar Reserva</h1>
      <button 
        onClick={handleCheckout}
        style={{ padding: '10px 20px', backgroundColor: '#6366f1', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
      >
        Pagar Agora com Stripe
      </button>
    </div>
  );
}

