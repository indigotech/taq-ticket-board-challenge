import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import { strings } from '../../utils/strings';
import { Icon } from '../atm.icon/icon.component';
import { Caption, H2, Label } from '../atm.typography/typography.component';
import { theme } from '../obj.theme/theme';
import { playerHudStyles } from './player-hud.style';

interface PlayerHudProps {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  gold: number;
}

export function PlayerHud({ level, currentXp, xpToNextLevel, gold }: PlayerHudProps) {
  const progress = xpToNextLevel > 0 ? Math.min(currentXp / xpToNextLevel, 1) : 0;
  const goldLabel = new Intl.NumberFormat('pt-BR').format(gold);

  return (
    <View style={playerHudStyles.container} accessible accessibilityLabel={strings.playerHud.accessibilityLabel}>
      <View style={playerHudStyles.row}>
        <View style={playerHudStyles.levelGroup}>
          <Icon name="shield" size="medium" color="accent" />
          <H2 color="onInverse">{strings.playerHud.levelLabel(level)}</H2>
        </View>
        <Caption
          color="onInverse"
          accessibilityLabel={strings.playerHud.xpAccessibilityLabel(currentXp, xpToNextLevel)}
        >
          {strings.playerHud.xpProgressLabel(currentXp, xpToNextLevel)}
        </Caption>
      </View>

      <View style={playerHudStyles.track}>
        <LinearGradient
          colors={[theme.color.accentLight, theme.color.accentDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[playerHudStyles.fill, { width: `${progress * 100}%` }]}
        />
      </View>

      <View style={playerHudStyles.goldGroup}>
        <Icon name="coinPouch" size="large" color="accent" strokeWidth={1.6} />
        <H2 color="onInverse" accessibilityLabel={strings.playerHud.goldAccessibilityLabel(goldLabel)}>
          {goldLabel}
        </H2>
        <Label color="onInverse">{strings.playerHud.goldUnitLabel}</Label>
      </View>
    </View>
  );
}
