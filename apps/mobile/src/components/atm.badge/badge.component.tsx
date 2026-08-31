import type { ReactNode } from 'react';
import { View } from 'react-native';
import type { FeedbackColor } from '../obj.theme/theme';
import { Label } from '../atm.typography/typography.component';
import { badgeStyles } from './badge.style';

interface BadgeProps {
  label: string;
  variant?: FeedbackColor;
  icon?: ReactNode;
}

export function Badge({ label, variant = 'neutral', icon }: BadgeProps) {
  return (
    <View style={[badgeStyles.badge, badgeStyles[variant]]}>
      {icon}
      <Label color={variant}>{label}</Label>
    </View>
  );
}
