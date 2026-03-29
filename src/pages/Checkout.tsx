import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(String(import.meta.env?.VITE_STRIPE_PUBLIC_KEY || ""));

// Adicionamos { amount, bookingId } para o componente receber o valor real
export const Checkout = ({ amount, bookingId }: { amount: number, bookingId: string }) => { 
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      const res = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: amount, // Envia o valor calculado pelo site (ex: 450)
          bookingId: bookingId 
        }), 
      });

      const session = await res.json();
      if (session.id && stripe) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      }
    } catch (err) {
      alert('Erro na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Finalizar Reserva</h1>
      <p>Total a pagar: R$ {amount?.toFixed(2)}</p>
      <button 
        onClick={handlePayment}
        disabled={loading}
        style={{ padding: '15px 30px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
      >
        {loading ? 'Carregando...' : 'Ir para Pagamento'}
      </button>
    </div>
  );
};

