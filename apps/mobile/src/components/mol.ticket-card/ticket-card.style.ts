import { theme } from '../obj.theme/theme';
import { StyleSheet } from 'react-native';

export const ticketCardStyles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.border.radius.large,
    borderWidth: theme.border.widthThick,
    borderColor: theme.color.border,
    padding: theme.spacing.large,
    marginBottom: theme.spacing.medium,
    gap: theme.spacing.small,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.small,
  },
  title: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.small,
  },
  statusControl: {
    alignSelf: 'flex-end',
  },
});
