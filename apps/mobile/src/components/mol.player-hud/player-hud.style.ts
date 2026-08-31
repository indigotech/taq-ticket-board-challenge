import { StyleSheet } from 'react-native';
import { theme } from '../obj.theme/theme';

export const playerHudStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.surfaceInverse,
    borderWidth: theme.border.widthThick,
    borderColor: theme.color.accentBorder,
    borderRadius: theme.border.radius.large,
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  levelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xsmall,
  },
  track: {
    marginTop: theme.spacing.small,
    height: theme.progressBarHeight,
    borderRadius: theme.border.radius.small,
    backgroundColor: theme.color.trackBackground,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: theme.border.radius.small,
  },
  goldGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xsmall,
    marginTop: theme.spacing.medium,
  },
});
