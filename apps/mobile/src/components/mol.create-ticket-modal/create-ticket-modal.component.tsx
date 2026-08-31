import { Button } from '../atm.button/button.component';
import { Caption, Display } from '../atm.typography/typography.component';
import { theme } from '../obj.theme/theme';
import { useState } from 'react';
import { Modal, Pressable, TextInput } from 'react-native';
import type { ApiError } from '../../data/http-client';
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from '../../data/tickets/tickets.datasource';
import type { CreateTicketInput } from '../../model/ticket';
import { strings } from '../../utils/strings';
import { createTicketModalStyles } from './create-ticket-modal.style';

interface CreateTicketModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTicketInput) => void | Promise<void>;
  isSubmitting: boolean;
  error: ApiError | null;
}

export function CreateTicketModal({ visible, onClose, onSubmit, isSubmitting, error }: CreateTicketModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const isValid =
    title.trim().length > 0 &&
    title.length <= TITLE_MAX_LENGTH &&
    description.trim().length > 0 &&
    description.length <= DESCRIPTION_MAX_LENGTH;

  const handleSubmit = async () => {
    if (!isValid) {return;}
    await onSubmit({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={createTicketModalStyles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={strings.createQuest.closeButtonLabel}
      >
        <Pressable style={createTicketModalStyles.card} onPress={(event) => event.stopPropagation()}>
          <Display>{strings.createQuest.heading}</Display>

          <TextInput
            style={createTicketModalStyles.input}
            placeholder={strings.createQuest.titlePlaceholder}
            placeholderTextColor={theme.color.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={TITLE_MAX_LENGTH}
            accessibilityLabel={strings.createQuest.titlePlaceholder}
          />
          <TextInput
            style={[createTicketModalStyles.input, createTicketModalStyles.descriptionInput]}
            placeholder={strings.createQuest.descriptionPlaceholder}
            placeholderTextColor={theme.color.textMuted}
            value={description}
            onChangeText={setDescription}
            maxLength={DESCRIPTION_MAX_LENGTH}
            accessibilityLabel={strings.createQuest.descriptionPlaceholder}
            multiline
          />

          {error && <Caption color="danger">{error.message}</Caption>}

          <Button
            label={isSubmitting ? strings.createQuest.submittingButtonLabel : strings.createQuest.submitButtonLabel}
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
