import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';
import { Icon, type IconName } from '../atm.icon/icon.component';
import { Label } from '../atm.typography/typography.component';
import { theme } from '../obj.theme/theme';
import { buttonStyles } from './button.style';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: IconName;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const tone = variant === 'primary' ? 'onAccent' : 'accentDeep';
  const shellStyle = [buttonStyles.shell, disabled && buttonStyles.disabled];

  const content = (
    <>
      {icon && <Icon name={icon} size="small" color={tone} strokeWidth={2.4} />}
      <Label color={tone}>{label}</Label>
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: Boolean(disabled) }}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[theme.color.accentLight, theme.color.accentDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={shellStyle}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[shellStyle, buttonStyles.secondary]}>{content}</View>
      )}
    </Pressable>
  );
}
