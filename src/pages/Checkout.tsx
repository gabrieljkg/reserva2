
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';

// Esta é a chave que configuramos na Vercel
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout: React.FC = () => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    if (!stripe) {
      alert("Erro ao carregar o Stripe. Verifique as chaves na Vercel.");
      return;
    }

    // Aqui você chama seu backend para criar a sessão
    // Se ainda não tiver o backend pronto, o Stripe dará erro aqui
    console.log("Iniciando checkout...");
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Finalizar Reserva</h1>
      <button 
        onClick={handleCheckout}
        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Pagar com Stripe
      </button>
    </div>
  );
};

export default Checkout;

