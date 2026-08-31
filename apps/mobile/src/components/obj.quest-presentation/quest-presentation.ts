import type { FeedbackColor } from '../obj.theme/theme';
import type { Priority, Status, StatusFilter } from '../../model/ticket';
import { strings } from '../../utils/strings';

export const QUEST_STATUS_LABEL: Record<Status, string> = {
  open: strings.questStatus.openLabel,
  in_progress: strings.questStatus.inProgressLabel,
  done: strings.questStatus.doneLabel,
};

export const QUEST_STATUS_VARIANT: Record<Status, FeedbackColor> = {
  open: 'neutral',
  in_progress: 'warning',
  done: 'done',
};

export const QUEST_DIFFICULTY_LABEL: Record<Priority, string> = {
  high: strings.questDifficulty.highLabel,
  normal: strings.questDifficulty.normalLabel,
};

export const QUEST_DIFFICULTY_VARIANT: Record<Priority, FeedbackColor> = {
  high: 'danger',
  normal: 'success',
};

export const QUEST_STATUS_OPTIONS: Array<{ value: Status; label: string }> = [
  { value: 'open', label: QUEST_STATUS_LABEL.open },
  { value: 'in_progress', label: QUEST_STATUS_LABEL.in_progress },
  { value: 'done', label: QUEST_STATUS_LABEL.done },
];

export const QUEST_STATUS_FILTER_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: strings.questStatus.allLabel },
  ...QUEST_STATUS_OPTIONS,
];
