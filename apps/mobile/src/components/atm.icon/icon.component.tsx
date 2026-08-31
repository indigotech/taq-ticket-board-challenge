import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';
import { type ContentColor, contentColor, theme } from '../obj.theme/theme';

const ICON_PATHS = {
  shield: <Path d="M12 2 L20 5 V11 C20 16 16.5 20 12 22 C7.5 20 4 16 4 11 V5 Z" />,
  coinPouch: (
    <>
      <Path d="M9 3 C9 4.5 8 5 7.5 6.5 C5 9 4 13 5.5 17 C6.8 20.3 9.5 22 12 22 C14.5 22 17.2 20.3 18.5 17 C20 13 19 9 16.5 6.5 C16 5 15 4.5 15 3" />
      <Path d="M9 3 H15" />
      <Circle cx={12} cy={13} r={1.4} />
    </>
  ),
  search: (
    <>
      <Circle cx={10.5} cy={10.5} r={6.5} />
      <Line x1={15.5} y1={15.5} x2={21} y2={21} />
    </>
  ),
  chevronDown: <Polyline points="6 9 12 15 18 9" />,
  check: <Polyline points="4 12 9 17 20 6" />,
  plus: (
    <>
      <Line x1={12} y1={5} x2={12} y2={19} />
      <Line x1={5} y1={12} x2={19} y2={12} />
    </>
  ),
};

export type IconName = keyof typeof ICON_PATHS;

interface IconProps {
  name: IconName;
  size?: keyof typeof theme.iconSize;
  color?: ContentColor;
  strokeWidth?: number;
}

export function Icon({ name, size = 'medium', color = 'primary', strokeWidth = 1.8 }: IconProps) {
  const dimension = theme.iconSize[size];

  return (
    <Svg
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="none"
      stroke={contentColor[color]}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICON_PATHS[name]}
    </Svg>
  );
}
