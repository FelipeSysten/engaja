
export enum UserPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  ELITE = 'ELITE'
}

export enum UserLevel {
  BRONZE = 'BRONZE',
  PRATA = 'PRATA',
  OURO = 'OURO',
  DIAMANTE = 'DIAMANTE'
}

export enum TaskType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW'
}

export interface User {
  id: string;
  name: string;
  instagramUsername: string;
  points: number;
  dailyPointsEarned: number;
  plan: UserPlan;
  level: UserLevel;
  avatar: string;
  isCreator: boolean;
  referredBy?: string;
}

export interface Task {
  id: string;
  type: TaskType;
  instagramUrl: string;
  pointsValue: number;
  description: string;
  priority: number;
}

export interface Campaign {
  id: string;
  type: TaskType;
  targetUrl: string;
  targetQuantity: number;
  currentQuantity: number;
  pointsInvested: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  createdAt: string;
}
