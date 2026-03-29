import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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

      const { sessionId } = await res.json();
      const stripe = await stripePromise;

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
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



