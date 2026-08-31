import { StyleSheet } from 'react-native';
import { theme } from '../obj.theme/theme';

export const statusDropdownStyles = StyleSheet.create({
  container: {
    flexShrink: 0,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.xsmall,
    height: theme.fieldHeight.default,
    borderWidth: theme.border.width,
    borderColor: theme.color.border,
    borderRadius: theme.border.radius.medium,
    paddingHorizontal: theme.spacing.medium,
    backgroundColor: theme.color.surface,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xlarge,
    backgroundColor: theme.color.backdrop,
  },
  panel: {
    backgroundColor: theme.color.surface,
    borderWidth: theme.border.widthThick,
    borderColor: theme.color.border,
    borderRadius: theme.border.radius.large,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.small,
    minHeight: theme.fieldHeight.default,
    paddingHorizontal: theme.spacing.large,
  },
});
