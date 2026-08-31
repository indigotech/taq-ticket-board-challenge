export type QuestStatus = 'open' | 'in_progress' | 'resolved';
export type QuestDifficulty = 'easy' | 'normal' | 'high';

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  difficulty: QuestDifficulty;
  xpReward: number;
  createdAt: Date;
}

export interface QuestInput {
  title: string;
  description: string;
}
