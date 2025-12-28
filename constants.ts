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

// IDs dos produtos fornecidos pelo usuário
export const STRIPE_PRODUCT_IDS = {
  PLANO_PRO: 'price_1SjS6DECuhLW00E55DtzQJpg',
  PLANO_ELITE: 'price_1SjS7PECuhLW00E5DdfruZpa',
  RECARGA_1000: 'price_1SjS8gECuhLW00E5WveBv9Od',
  RECARGA_5000: 'price_1SjS9xECuhLW00E5b2iIzWyN',
  RECARGA_10000: 'price_1SjSJyECuhLW00E5WS3wwz33',
  BOOST_24H: 'price_1SjSL3ECuhLW00E5nKhC9uIe',
  BOOST_72H: 'price_1SjSLQECuhLW00E5KArGbeQ9',
};

export const PRICING = {
  PLANS: [
    {
      id: UserPlan.FREE,
      name: 'Free',
      price: 0,
      features: ['Ações ilimitadas', 'Limite 150 pts/dia', 'Baixa prioridade'],
      stripeProductId: null
    },
    {
      id: UserPlan.PRO,
      name: 'Pro',
      price: 39,
      features: ['Limite 500 pts/dia', 'Prioridade média', 'Selo Pro'],
      stripeProductId: STRIPE_PRODUCT_IDS.PLANO_PRO
    },
    {
      id: UserPlan.ELITE,
      name: 'Elite',
      price: 89,
      features: ['Pontos ilimitados', 'Prioridade máxima', 'Boost mensal incluso'],
      stripeProductId: STRIPE_PRODUCT_IDS.PLANO_ELITE
    },
  ],
  PACKS: [
    {
      amount: 1000,
      price: 10,
      stripeProductId: STRIPE_PRODUCT_IDS.RECARGA_1000
    },
    {
      amount: 5000,
      price: 45,
      stripeProductId: STRIPE_PRODUCT_IDS.RECARGA_5000
    },
    {
      amount: 10000,
      price: 80,
      stripeProductId: STRIPE_PRODUCT_IDS.RECARGA_10000
    },
  ],
  BOOSTS: [
    {
      duration: '24h',
      price: 15,
      stripeProductId: STRIPE_PRODUCT_IDS.BOOST_24H
    },
    {
      duration: '72h',
      price: 35,
      stripeProductId: STRIPE_PRODUCT_IDS.BOOST_72H
    },
  ]
};
