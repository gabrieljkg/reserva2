import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
// No topo do Checkout.tsx
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');


interface CheckoutProps {
  amount: number;
  bookingId: string;
}

export const Checkout = ({ amount, bookingId }: CheckoutProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Multiplica o valor das noites por 1.15 para incluir a taxa de 15%
          amount: amount * 1.15,
          bookingId: bookingId
        }),
      });

     const data = await res.json();
    const stripe = await stripePromise; // Usa a promessa da linha 4

     // Pega o ID da sessão (aceita 'sessionId' ou 'id')
     const sid = data.sessionId || data.id;

     if (stripe && sid) {
       await stripe.redirectToCheckout({ sessionId: sid });
     } else {
       console.error("Erro: Sessão não encontrada", data);
      setLoading(false);
   }

}


if (stripe && sessionToUse) {
  await stripe.redirectToCheckout({ sessionId: sessionToUse });
} else {
  // Se chegar aqui, a API falhou em criar a sessão
  console.error("Erro: Sessão não encontrada na resposta da API", data);
  setLoading(false);
}

    } catch (error) {
      console.error("Erro no checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
    >
      {loading ? 'Carregando...' : 'Pagar Agora'}
    </button>
  );
};



