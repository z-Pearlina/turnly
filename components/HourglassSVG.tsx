import Svg, { Path, Rect, Circle } from "react-native-svg";

export default function HourglassSVG({ size = 110 }: { size?: number }) {
  return (
    <Svg width={size} height={size * 1.45} viewBox="0 0 100 145">
      {/* Top cap */}
      <Rect x="5" y="4" width="90" height="16" rx="8" fill="#0F766E" />
      {/* Bottom cap */}
      <Rect x="5" y="125" width="90" height="16" rx="8" fill="#0F766E" />

      {/* Top half body — nearly empty */}
      <Path d="M 10,20 L 90,20 L 54,70 L 46,70 Z" fill="#D1FAE5" />
      {/* Small sand remaining at top */}
      <Path d="M 10,20 L 90,20 L 76,34 L 24,34 Z" fill="#10B981" opacity="0.5" />

      {/* Bottom half body — full of sand */}
      <Path d="M 46,75 L 54,75 L 90,125 L 10,125 Z" fill="#10B981" />

      {/* Side strokes */}
      <Path d="M 10,20 L 46,70" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
      <Path d="M 90,20 L 54,70" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
      <Path d="M 46,75 L 10,125" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
      <Path d="M 54,75 L 90,125" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />

      {/* Neck */}
      <Path d="M 46,70 L 46,75" stroke="#0F766E" strokeWidth="3" />
      <Path d="M 54,70 L 54,75" stroke="#0F766E" strokeWidth="3" />

      {/* Falling sand dots */}
      <Circle cx="50" cy="74" r="3" fill="#0F766E" />
      <Circle cx="50" cy="84" r="2.5" fill="#10B981" />
      <Circle cx="50" cy="93" r="2" fill="#10B981" opacity="0.65" />
      <Circle cx="50" cy="101" r="1.5" fill="#10B981" opacity="0.3" />
    </Svg>
  );
}
