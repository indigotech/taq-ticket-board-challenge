import type { ReactNode } from 'react';
import { type StyleProp, Text, type TextStyle } from 'react-native';
import { type ContentColor, contentColor } from '../obj.theme/theme';
import { typographyStyles } from './typography.style';

export type TextColor = ContentColor;

interface TypographyProps {
  children: ReactNode;
  color?: TextColor;
  italic?: boolean;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

interface BaseTypographyProps extends TypographyProps {
  variant: keyof typeof typographyStyles;
  isHeading?: boolean;
}

function BaseTypography({
  children,
  variant,
  color = 'primary',
  italic,
  isHeading,
  numberOfLines,
  style,
  accessibilityLabel,
}: BaseTypographyProps) {
  return (
    <Text
      style={[typographyStyles[variant], italic && typographyStyles.italic, { color: contentColor[color] }, style]}
      numberOfLines={numberOfLines}
      accessibilityRole={isHeading ? 'header' : undefined}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Text>
  );
}

export function Display(props: TypographyProps) {
  return <BaseTypography variant="display" isHeading {...props} />;
}

export function H1(props: TypographyProps) {
  return <BaseTypography variant="h1" isHeading {...props} />;
}

export function H2(props: TypographyProps) {
  return <BaseTypography variant="h2" isHeading {...props} />;
}

export function Body(props: TypographyProps) {
  return <BaseTypography variant="body" {...props} />;
}

export function Caption(props: TypographyProps) {
  return <BaseTypography variant="caption" {...props} />;
}

export function Label(props: TypographyProps) {
  return <BaseTypography variant="label" {...props} />;
}
