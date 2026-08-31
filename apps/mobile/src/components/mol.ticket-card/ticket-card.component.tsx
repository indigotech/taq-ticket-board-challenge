import { Badge } from '../atm.badge/badge.component';
import { Icon } from '../atm.icon/icon.component';
import { Caption, H1 } from '../atm.typography/typography.component';
import { StatusDropdown } from '../mol.status-dropdown/status-dropdown.component';
import { View } from 'react-native';
import type { Status, Ticket } from '../../model/ticket';
import { formatRelativeTime } from '../../utils/relativeTime';
import {
  QUEST_DIFFICULTY_LABEL,
  QUEST_DIFFICULTY_VARIANT,
  QUEST_STATUS_LABEL,
  QUEST_STATUS_OPTIONS,
  QUEST_STATUS_VARIANT,
} from '../obj.quest-presentation/quest-presentation';
import { ticketCardStyles } from './ticket-card.style';

interface TicketCardProps {
  ticket: Ticket;
  onStatusChange: (id: string, status: Status) => void;
}

export function TicketCard({ ticket, onStatusChange }: TicketCardProps) {
  const statusVariant = QUEST_STATUS_VARIANT[ticket.status];

  return (
    <View style={ticketCardStyles.card}>
      <View style={ticketCardStyles.titleRow}>
        <H1 numberOfLines={2} style={ticketCardStyles.title}>
          {ticket.title}
        </H1>
        <Badge
          label={QUEST_STATUS_LABEL[ticket.status]}
          variant={statusVariant}
          icon={ticket.status === 'done' ? <Icon name="check" size="small" color={statusVariant} strokeWidth={3} /> : undefined}
        />
      </View>

      <Caption color="secondary" numberOfLines={2}>
        {ticket.description}
      </Caption>

      <View style={ticketCardStyles.footer}>
        <Badge label={QUEST_DIFFICULTY_LABEL[ticket.priority]} variant={QUEST_DIFFICULTY_VARIANT[ticket.priority]} />
        <Caption color="muted" italic>
          {formatRelativeTime(ticket.createdAt)}
        </Caption>
      </View>

      <View style={ticketCardStyles.statusControl}>
        <StatusDropdown
          value={ticket.status}
          options={QUEST_STATUS_OPTIONS}
          onChange={(status) => onStatusChange(ticket.id, status)}
          accessibilityLabel={ticket.title}
        />
      </View>
    </View>
  );
}
