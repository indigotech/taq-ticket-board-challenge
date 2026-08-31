import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Icon } from '../atm.icon/icon.component';
import { Body } from '../atm.typography/typography.component';
import { statusDropdownStyles } from './status-dropdown.style';

interface StatusDropdownProps<T extends string> {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
}

export function StatusDropdown<T extends string>({
  value,
  options,
  onChange,
  accessibilityLabel,
}: StatusDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const currentLabel = options.find((option) => option.value === value)?.label ?? '';

  return (
    <View style={statusDropdownStyles.container}>
      <Pressable
        style={statusDropdownStyles.button}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open }}
      >
        <Body numberOfLines={1}>{currentLabel}</Body>
        <Icon name="chevronDown" size="small" color="secondary" strokeWidth={2.2} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={statusDropdownStyles.backdrop} onPress={() => setOpen(false)}>
          <View style={statusDropdownStyles.panel}>
            {options.map((option) => (
              <Pressable
                key={option.value}
                style={statusDropdownStyles.option}
                accessibilityRole="button"
                accessibilityState={{ selected: option.value === value }}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <Body color={option.value === value ? 'accentDeep' : 'primary'}>{option.label}</Body>
                {option.value === value && <Icon name="check" size="small" color="accentDeep" strokeWidth={2.6} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
