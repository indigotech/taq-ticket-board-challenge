import { theme } from '@components';
import { StyleSheet } from 'react-native';

export const ticketBoardStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.color.backgroundColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.small,
    paddingHorizontal: theme.spacing.xlarge,
    paddingTop: theme.spacing.xlarge,
  },
  title: {
    flex: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
    marginHorizontal: theme.spacing.xlarge,
    marginVertical: theme.spacing.large,
  },
  dividerLine: {
    flex: 1,
    height: theme.border.width,
    backgroundColor: theme.color.border,
  },
  dividerDiamond: {
    width: theme.spacing.xsmall,
    height: theme.spacing.xsmall,
    backgroundColor: theme.color.accentDark,
    transform: [{ rotate: '45deg' }],
  },
  hud: {
    paddingHorizontal: theme.spacing.xlarge,
    marginBottom: theme.spacing.large,
  },
  filterRow: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
    paddingHorizontal: theme.spacing.xlarge,
    marginBottom: theme.spacing.large,
    zIndex: 10,
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
    height: theme.fieldHeight.default,
    borderWidth: theme.border.width,
    borderColor: theme.color.border,
    borderRadius: theme.border.radius.medium,
    paddingHorizontal: theme.spacing.medium,
    backgroundColor: theme.color.surface,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.fontFamily.body,
    fontSize: theme.fontSize.body,
    color: theme.color.textPrimary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.xlarge,
    paddingBottom: theme.spacing.xlarge,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.large,
    paddingHorizontal: theme.spacing.xlarge,
  },
  footer: {
    alignItems: 'center',
    gap: theme.spacing.medium,
    paddingVertical: theme.spacing.large,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing.xxlarge,
  },
});
