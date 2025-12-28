
import { UserPlan, TaskType } from './types';

export const POINTS_EARNED = {
  [TaskType.LIKE]: 1,
  [TaskType.COMMENT]: 3,
  [TaskType.FOLLOW]: 5,
};

export const POINTS_COST = {
  [TaskType.LIKE]: 2,
  [TaskType.COMMENT]: 5,
  [TaskType.FOLLOW]: 10,
};

export const PLAN_LIMITS = {
  [UserPlan.FREE]: 150,
  [UserPlan.PRO]: 500,
  [UserPlan.ELITE]: Infinity,
};

// URLs reais de checkout (Links de Pagamento do Stripe)
// Em produção, você substituiria pelos links gerados no seu painel Stripe
const BASE_STRIPE_URL = "https://buy.stripe.com/test_"; 

export const PRICING = {
  PLANS: [
    { 
      id: UserPlan.FREE, 
      name: 'Free', 
      price: 0, 
      features: ['Ações ilimitadas', 'Limite 150 pts/dia', 'Baixa prioridade'],
      checkoutUrl: null 
    },
    { 
      id: UserPlan.PRO, 
      name: 'Pro', 
      price: 39, 
      features: ['Limite 500 pts/dia', 'Prioridade média', 'Selo Pro'],
      checkoutUrl: `${BASE_STRIPE_URL}6oE9C68uYg5f?prefilled_email={EMAIL}&client_reference_id={USER_ID}&success_url=${window.location.origin}/dashboard?payment=success&type=PLAN&val=PRO`
    },
    { 
      id: UserPlan.ELITE, 
      name: 'Elite', 
      price: 89, 
      features: ['Pontos ilimitados', 'Prioridade máxima', 'Boost mensal incluso'],
      checkoutUrl: `${BASE_STRIPE_URL}8wM7uYg5f6oE?prefilled_email={EMAIL}&client_reference_id={USER_ID}&success_url=${window.location.origin}/dashboard?payment=success&type=PLAN&val=ELITE`
    },
  ],
  PACKS: [
    { 
      amount: 1000, 
      price: 10, 
      checkoutUrl: `${BASE_STRIPE_URL}5kAbJCdEfGhI?prefilled_email={EMAIL}&client_reference_id={USER_ID}&success_url=${window.location.origin}/dashboard?payment=success&type=POINTS&val=1000`
    },
    { 
      amount: 5000, 
      price: 45, 
      checkoutUrl: `${BASE_STRIPE_URL}1mN2oP3qR4sT?prefilled_email={EMAIL}&client_reference_id={USER_ID}&success_url=${window.location.origin}/dashboard?payment=success&type=POINTS&val=5000`
    },
    { 
      amount: 10000, 
      price: 80, 
      checkoutUrl: `${BASE_STRIPE_URL}9uV0wX1yZ2aB?prefilled_email={EMAIL}&client_reference_id={USER_ID}&success_url=${window.location.origin}/dashboard?payment=success&type=POINTS&val=10000`
    },
  ],
  BOOSTS: [
    { 
      duration: '24h', 
      price: 15, 
      checkoutUrl: `${BASE_STRIPE_URL}3cD4eF5gH6hI?prefilled_email={EMAIL}&client_reference_id={USER_ID}&success_url=${window.location.origin}/dashboard?payment=success&type=BOOST&val=24h`
    },
    { 
      duration: '72h', 
      price: 35, 
      checkoutUrl: `${BASE_STRIPE_URL}7jK8lM9nO0pQ?prefilled_email={EMAIL}&client_reference_id={USER_ID}&success_url=${window.location.origin}/dashboard?payment=success&type=BOOST&val=72h`
    },
  ]
};
