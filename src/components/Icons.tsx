import React from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

type P = { size?: number; color: string };

export const FootIcon = ({ size = 90, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <G transform="translate(-4 0)">
      <Path
        d="M40 40C62 30 74 48 68 66C63 82 52 94 38 91C24 88 19 74 26 60C29 50 33 43 40 40Z"
        fill={color}
      />
      <Circle cx="47" cy="22" r="9" fill={color} />
      <Circle cx="63" cy="26" r="7" fill={color} />
      <Circle cx="75" cy="36" r="6" fill={color} />
      <Circle cx="82" cy="49" r="5" fill={color} />
      <Circle cx="85" cy="62" r="4" fill={color} />
    </G>
  </Svg>
);

export const HomeIcon = ({ size = 26, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill={color} />
  </Svg>
);

export const ListIcon = ({ size = 26, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="4" width="3" height="3" rx="1" fill={color} />
    <Rect x="8" y="4.5" width="13" height="2" rx="1" fill={color} />
    <Rect x="3" y="10.5" width="3" height="3" rx="1" fill={color} />
    <Rect x="8" y="11" width="13" height="2" rx="1" fill={color} />
    <Rect x="3" y="17" width="3" height="3" rx="1" fill={color} />
    <Rect x="8" y="17.5" width="13" height="2" rx="1" fill={color} />
  </Svg>
);

export const BarsIcon = ({ size = 26, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="12" width="4.5" height="9" rx="2.2" fill={color} />
    <Rect x="9.8" y="3" width="4.5" height="18" rx="2.2" fill={color} />
    <Rect x="16.5" y="8" width="4.5" height="13" rx="2.2" fill={color} />
  </Svg>
);

export const GearIcon = ({ size = 26, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.4h-4L10.6 6a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
      fill={color}
      transform="translate(-1 0)"
    />
  </Svg>
);

export const ArrowRight = ({ size = 24, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 12h15M13 6l6 6-6 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ArrowLeft = ({ size = 24, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M20 12H5M11 6l-6 6 6 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const InfoIcon = ({ size = 26, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8" fill="none" />
    <Circle cx="12" cy="7.8" r="1.2" fill={color} />
    <Rect x="11" y="10.5" width="2" height="6.5" rx="1" fill={color} />
  </Svg>
);

export const CloseCircle = ({ size = 56, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path d="M24 4A20 20 0 1 1 8 12" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    <Path d="M17 17l14 14M31 17L17 31" stroke={color} strokeWidth="3.2" strokeLinecap="round" />
  </Svg>
);

export const ChevronRight = ({ size = 20, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M9 5l7 7-7 7" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const Heart = ({ size = 64, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.800-8 11-8 11z" fill={color} />
    <Ellipse cx="8.2" cy="8.2" rx="1.2" ry="0.8" fill="#fff" opacity="0.6" />
  </Svg>
);

export const ClockIcon = ({ size = 20, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M12 7v5l3.5 2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const TimerIcon = ({ size = 20, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="13.5" r="7.5" stroke={color} strokeWidth="2" fill="none" />
    <Path d="M9.5 2.5h5M12 13.5V9.5M18.5 6l1.5-1.5" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
  </Svg>
);

export const ResetIcon = ({ size = 24, color }: P) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M4 12a8 8 0 1 0 2.6-5.9" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    <Path d="M4 3.5v4.8h4.8" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
