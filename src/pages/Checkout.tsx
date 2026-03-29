
import { loadStripe } from '@stripe/stripe-js';

// Verifique se o nome na Vercel é exatamente VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe não carregado. Verifique sua VITE_STRIPE_PUBLISHABLE_KEY na Vercel.");

      // Aqui vai sua chamada para o backend (ajuste a URL se necessário)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const session = await response.json();

      if (session.error) {
        console.error("Erro do servidor:", session.error);
        alert("Erro no servidor: " + session.error);
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Erro completo:", error);
      alert("Erro ao processar pagamento. Verifique o console (F12) para detalhes técnicos.");
    }
  };

  return (
    <div>
      <button onClick={handlePayment}>Pagar Agora</button>
    </div>
  );
};

export default Checkout;
