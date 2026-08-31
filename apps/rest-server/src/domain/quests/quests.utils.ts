import type { QuestDifficulty } from '#domain/model/quests.model.js';

const XP_REWARD_BY_DIFFICULTY: Record<QuestDifficulty, number> = {
  easy: 10,
  normal: 25,
  high: 50,
};

export function calculateXpReward(difficulty: QuestDifficulty): number {
  return XP_REWARD_BY_DIFFICULTY[difficulty];
}
