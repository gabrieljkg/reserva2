import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Carrega a chave pública da Vercel
const stripePromise = loadStripe(String(import.meta.env?.VITE_STRIPE_PUBLIC_KEY || ""));

// Adicionamos valores padrão (450) para evitar que o botão trave em "Carregando"
export const Checkout = ({ amount = 450, bookingId = "reserva-teste" }: { amount?: number, bookingId?: string }) => { 
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe não carregado');

      const res = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: amount, // Envia o valor (Ex: 450)
          bookingId: bookingId 
        }), 
      });

      const session = await res.json();
      
      if (session.id) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        alert('Erro do Servidor: ' + (session.message || 'Falha ao gerar sessão'));
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
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Finalizar Reserva</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
        Total a pagar: <strong>R$ {amount.toFixed(2)}</strong>
      </p>
      <button 
        onClick={handlePayment}
        disabled={loading}
        style={{ 
          padding: '15px 40px', 
          background: loading ? '#ccc' : '#6366f1', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '18px',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Processando...' : 'Pagar Agora'}
      </button>
    </div>
  );
};


