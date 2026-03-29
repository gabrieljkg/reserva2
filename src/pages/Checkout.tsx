import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Certifique-se de que esta chave está nas Environment Variables da Vercel
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
          // Multiplica o valor das noites por 1.15 (15% de taxa)
          amount: amount * 1.15,
          bookingId: bookingId
        }),
      });

      const data = await res.json();
      const stripe = await stripePromise;

      // Aceita 'sessionId' ou 'id' vindo do servidor
      const sessionToUse = data.sessionId || data.id;

      if (stripe && sessionToUse) {
        await stripe.redirectToCheckout({ sessionId: sessionToUse });
      } else {
        throw new Error("Sessão do Stripe não encontrada.");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro ao processar pagamento. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-all disabled:bg-gray-400"
    >
      {loading ? 'Carregando...' : 'Pagar Agora'}
    </button>
  );
};

