import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Use a sua chave pública que você configurou na Vercel
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function Checkout() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const stripe = await stripePromise;
      
      // AQUI ESTÁ A LINHA QUE ESTAVA ERRADA:
      const response = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 100, // Valor de teste
          bookingId: 'reserva-123'
        }),
      });

      const session = await response.json();

      if (session.id) {
        await stripe?.redirectToCheckout({ sessionId: session.id });
      } else {
        throw new Error('Falha ao criar sessão do Stripe');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao processar pagamento. Verifique os logs.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Finalizar Reserva</h1>
      <button 
        onClick={handleCheckout}
        disabled={isProcessing}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
      >
        {isProcessing ? 'Processando...' : 'Pagar com Stripe (Pix/Cartão)'}
      </button>
    </div>
  );
}


