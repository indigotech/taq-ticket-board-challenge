import {
  border,
  fieldHeight,
  fontFamily,
  fontSize,
  iconSize,
  lineHeight,
  progressBarHeight,
  spacing,
} from './common-properties.theme';
import { lightColors } from './light-colors.theme';

export const contentColor = {
  primary: lightColors.textPrimary,
  secondary: lightColors.textSecondary,
  muted: lightColors.textMuted,
  onInverse: lightColors.textOnInverse,
  onAccent: lightColors.textOnAccent,
  accent: lightColors.accent,
  accentDeep: lightColors.accentDeep,
  danger: lightColors.feedback.danger.foreground,
  warning: lightColors.feedback.warning.foreground,
  success: lightColors.feedback.success.foreground,
  done: lightColors.feedback.done.foreground,
  neutral: lightColors.feedback.neutral.foreground,
};

export const theme = {
  color: lightColors,
  contentColor,
  spacing,
  fontFamily,
  fontSize,
  lineHeight,
  iconSize,
  border,
  fieldHeight,
  progressBarHeight,
};

export type Theme = typeof theme;
export type ContentColor = keyof typeof contentColor;
export type FeedbackColor = keyof typeof lightColors.feedback;
