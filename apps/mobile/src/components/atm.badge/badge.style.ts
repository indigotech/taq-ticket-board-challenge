import { StyleSheet } from 'react-native';
import { theme } from '../obj.theme/theme';

const variantStyle = (variant: keyof typeof theme.color.feedback) => ({
  backgroundColor: theme.color.feedback[variant].background,
  borderColor: theme.color.feedback[variant].foreground,
});

export const badgeStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.spacing.xxsmall,
    borderRadius: theme.border.radius.small,
    borderWidth: theme.border.width,
    paddingHorizontal: theme.spacing.small,
    paddingVertical: theme.spacing.xxsmall,
  },
  danger: variantStyle('danger'),
  warning: variantStyle('warning'),
  success: variantStyle('success'),
  done: variantStyle('done'),
  neutral: variantStyle('neutral'),
});
