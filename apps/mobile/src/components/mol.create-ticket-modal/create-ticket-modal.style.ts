import { theme } from '../obj.theme/theme';
import { StyleSheet } from 'react-native';

export const createTicketModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.xlarge,
    backgroundColor: theme.color.backdrop,
  },
  card: {
    backgroundColor: theme.color.surface,
    borderWidth: theme.border.widthThick,
    borderColor: theme.color.border,
    borderRadius: theme.border.radius.large,
    padding: theme.spacing.xlarge,
    gap: theme.spacing.medium,
  },
  input: {
    borderWidth: theme.border.width,
    borderColor: theme.color.border,
    borderRadius: theme.border.radius.medium,
    minHeight: theme.fieldHeight.default,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    fontFamily: theme.fontFamily.body,
    fontSize: theme.fontSize.body,
    color: theme.color.textPrimary,
    backgroundColor: theme.color.backgroundColor,
  },
  descriptionInput: {
    minHeight: theme.fieldHeight.multiline,
    textAlignVertical: 'top',
  },
});
