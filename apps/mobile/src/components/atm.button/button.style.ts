import { StyleSheet } from 'react-native';
import { theme } from '../obj.theme/theme';

export const buttonStyles = StyleSheet.create({
  shell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xsmall,
    height: theme.fieldHeight.default,
    paddingHorizontal: theme.spacing.large,
    borderRadius: theme.border.radius.medium,
    borderWidth: theme.border.width,
    borderColor: theme.color.accentDeep,
  },
  secondary: {
    backgroundColor: theme.color.surface,
  },
  disabled: {
    opacity: 0.5,
  },
});
