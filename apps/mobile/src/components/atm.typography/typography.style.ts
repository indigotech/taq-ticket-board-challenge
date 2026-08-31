import { StyleSheet } from 'react-native';
import { theme } from '../obj.theme/theme';

export const typographyStyles = StyleSheet.create({
  display: {
    fontFamily: theme.fontFamily.displayBold,
    fontSize: theme.fontSize.xlarge,
    lineHeight: theme.lineHeight.xlarge,
  },
  h1: {
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize.large,
    lineHeight: theme.lineHeight.large,
  },
  h2: {
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize.medium,
    lineHeight: theme.lineHeight.medium,
  },
  body: {
    fontFamily: theme.fontFamily.body,
    fontSize: theme.fontSize.body,
    lineHeight: theme.lineHeight.body,
  },
  caption: {
    fontFamily: theme.fontFamily.body,
    fontSize: theme.fontSize.caption,
    lineHeight: theme.lineHeight.caption,
  },
  label: {
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize.micro,
    lineHeight: theme.lineHeight.micro,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  italic: {
    fontFamily: theme.fontFamily.bodyItalic,
  },
});
