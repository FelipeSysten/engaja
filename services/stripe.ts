import { loadStripe } from '@stripe/stripe-js';

// Chave publicável fornecida pelo usuário
export const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SjLThECuhLW00E57nGuHNy7hxqybLf2sFIEAR4yWAbIZwgkQLFsvfDWrHUDVfemZqGXzGvisGELo14MuFL4WqMY00mXAVsgY0';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const STRIPE_PRODUCTS = {
  PLANO_PRO: 'prod_TgplHZajPlG8Ej',
  PLANO_ELITE: 'prod_Tgpmss8lVUgoh1',
  RECARGA_1000: 'prod_TgpoK5u6ErNUbn',
  RECARGA_5000: 'prod_TgppTod1zGqYNA',
  RECARGA_10000: 'prod_Tgpz8ThxbHkRwH',
  BOOST_24H: 'prod_Tgq1Cm6frDMaVa',
  BOOST_72H: 'prod_Tgq1mnegGpmlS3',
};

/**
 * Nota: Em uma aplicação real com backend, você chamaria sua API para criar uma Checkout Session.
 * Como este projeto parece ser focado no frontend (AI Studio/Supabase),
 * a integração direta via Stripe.js ou links de pagamento é a abordagem atual.
 * 
 * Para usar o Stripe Checkout via API (conforme o exemplo do Stripe), 
 * seria necessário um endpoint de backend (Node.js/Express) para processar a criação da sessão.
 */