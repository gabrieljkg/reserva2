import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any,
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'boleto'],
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: { name: 'Reserva Unplugged Bliss' },
          unit_amount: Math.round(req.body.amount * 100), // Pega o valor enviado pelo site

        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/checkout`,
    });

    return res.status(200).json({ id: session.id });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}
