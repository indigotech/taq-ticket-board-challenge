import { Body, Button, Caption, CreateTicketModal, Display, Icon, PlayerHud, QUEST_STATUS_FILTER_OPTIONS, StatusDropdown, TicketCard, theme } from '@components';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, type ListRenderItemInfo, RefreshControl, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCreateTicket } from '../../domain/tickets/use-create-ticket.use-case';
import { useListTickets } from '../../domain/tickets/use-list-tickets.use-case';
import type { Status, StatusFilter, Ticket } from '../../model/ticket';
import { strings } from '../../utils/strings';
import { ticketBoardStyles } from './TicketBoardScreen.style';

export function TicketBoardScreen() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const {
    tickets,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    refetch,
    refresh,
    loadMore,
    retry,
    applyLocalStatusOverride,
  } = useListTickets(statusFilter);
  const { createTicket, isLoading: isCreating, error: createError } = useCreateTicket();

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tickets.filter((ticket) => ticket.title.toLowerCase().includes(query));
  }, [tickets, search]);

  const handleStatusChange = useCallback(
    (id: string, status: Status) => applyLocalStatusOverride(id, status),
    [applyLocalStatusOverride],
  );

  const handleCreateTicket = useCallback(
    async (input: Parameters<typeof createTicket>[0]) => {
      const created = await createTicket(input);
      if (created) {
        setIsCreateModalVisible(false);
        refetch();
      }
    },
    [createTicket, refetch],
  );

  const renderTicket = useCallback(
    ({ item }: ListRenderItemInfo<Ticket>) => <TicketCard ticket={item} onStatusChange={handleStatusChange} />,
    [handleStatusChange],
  );

  const keyExtractor = useCallback((ticket: Ticket) => ticket.id, []);

  const renderEmptyList = useCallback(
    () => (
      <Caption color="muted" style={ticketBoardStyles.emptyText}>
        {strings.questBoard.emptyListText}
      </Caption>
    ),
    [],
  );

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return (
        <ActivityIndicator
          style={ticketBoardStyles.footer}
          color={theme.color.accentDeep}
          accessibilityLabel={strings.questBoard.loadingAccessibilityLabel}
        />
      );
    }
    if (error) {
      return (
        <View style={ticketBoardStyles.footer}>
          <Body color="secondary" style={ticketBoardStyles.emptyText}>
            {error.message}
          </Body>
          <Button variant="secondary" label={strings.questBoard.retryButtonLabel} onPress={retry} />
        </View>
      );
    }
    return null;
  }, [isLoadingMore, error, retry]);

  return (
    <SafeAreaView style={ticketBoardStyles.safeArea}>
      <View style={ticketBoardStyles.header}>
        <Display style={ticketBoardStyles.title}>{strings.questBoard.screenTitle}</Display>
        <Button
          label={strings.questBoard.createQuestButtonLabel}
          icon="plus"
          onPress={() => setIsCreateModalVisible(true)}
          accessibilityHint={strings.questBoard.createQuestButtonHint}
        />
      </View>

      <View style={ticketBoardStyles.divider}>
        <View style={ticketBoardStyles.dividerLine} />
        <View style={ticketBoardStyles.dividerDiamond} />
        <View style={ticketBoardStyles.dividerLine} />
      </View>

      <View style={ticketBoardStyles.hud}>
        <PlayerHud level={1} currentXp={0} xpToNextLevel={100} gold={0} />
      </View>

      <View style={ticketBoardStyles.filterRow}>
        <View style={ticketBoardStyles.searchField}>
          <Icon name="search" size="medium" color="secondary" />
          <TextInput
            style={ticketBoardStyles.searchInput}
            placeholder={strings.questBoard.searchPlaceholder}
            placeholderTextColor={theme.color.textMuted}
            value={search}
            onChangeText={setSearch}
            accessibilityLabel={strings.questBoard.searchAccessibilityLabel}
          />
        </View>
        <StatusDropdown
          value={statusFilter}
          options={QUEST_STATUS_FILTER_OPTIONS}
          onChange={setStatusFilter}
          accessibilityLabel={strings.questStatus.filterLabel}
        />
      </View>

      {isLoading && tickets.length === 0 ? (
        <View style={ticketBoardStyles.centerContainer}>
          <ActivityIndicator
            color={theme.color.accentDeep}
            accessibilityLabel={strings.questBoard.loadingAccessibilityLabel}
          />
        </View>
      ) : error && tickets.length === 0 ? (
        <View style={ticketBoardStyles.centerContainer}>
          <Body color="secondary" style={ticketBoardStyles.emptyText}>
            {error.message}
          </Body>
          <Button variant="secondary" label={strings.questBoard.retryButtonLabel} onPress={retry} />
        </View>
      ) : (
        <FlatList
          data={filteredTickets}
          keyExtractor={keyExtractor}
          contentContainerStyle={ticketBoardStyles.listContent}
          renderItem={renderTicket}
          ListEmptyComponent={renderEmptyList}
          ListFooterComponent={renderFooter}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              tintColor={theme.color.accentDeep}
              colors={[theme.color.accentDeep]}
            />
          }
        />
      )}

      <CreateTicketModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateTicket}
        isSubmitting={isCreating}
        error={createError}
      />
    </SafeAreaView>
  );
}
