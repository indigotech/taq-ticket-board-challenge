const pluralize = (count: number, singular: string, plural: string) => (count === 1 ? singular : plural);

export const strings = {
  questBoard: {
    screenTitle: 'Quadro da Guilda',
    createQuestButtonLabel: 'Nova Missão',
    createQuestButtonHint: 'Abre o formulário para publicar uma nova missão no quadro',
    searchPlaceholder: 'Buscar missão...',
    searchAccessibilityLabel: 'Buscar missão pelo título',
    emptyListText: 'Nenhuma missão encontrada no quadro.',
    retryButtonLabel: 'Tentar de novo',
    loadingAccessibilityLabel: 'Carregando missões',
  },
  questStatus: {
    filterLabel: 'Situação da missão',
    allLabel: 'Todas',
    openLabel: 'Disponível',
    inProgressLabel: 'Em andamento',
    doneLabel: 'Concluída',
  },
  questDifficulty: {
    highLabel: 'Difícil',
    normalLabel: 'Fácil',
  },
  playerHud: {
    accessibilityLabel: 'Progresso do aventureiro',
    levelLabel: (level: number) => `Nível ${level}`,
    xpProgressLabel: (currentXp: number, xpToNextLevel: number) => `${currentXp} / ${xpToNextLevel} XP`,
    goldUnitLabel: 'Ouro',
    goldAccessibilityLabel: (gold: string) => `${gold} moedas de ouro`,
    xpAccessibilityLabel: (currentXp: number, xpToNextLevel: number) =>
      `${currentXp} de ${xpToNextLevel} pontos de experiência`,
  },
  createQuest: {
    heading: 'Nova Missão',
    titlePlaceholder: 'Título da missão',
    descriptionPlaceholder: 'Descrição da missão',
    submitButtonLabel: 'Publicar no quadro',
    submittingButtonLabel: 'Publicando...',
    closeButtonLabel: 'Fechar',
  },
  relativeTime: {
    justNow: 'Aberta agora',
    minutesAgo: (minutes: number) => `Aberta há ${minutes} ${pluralize(minutes, 'minuto', 'minutos')}`,
    hoursAgo: (hours: number) => `Aberta há ${hours} ${pluralize(hours, 'hora', 'horas')}`,
    yesterday: 'Aberta ontem',
    daysAgo: (days: number) => `Aberta há ${days} dias`,
  },
};
