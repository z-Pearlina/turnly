import Svg, {
  Rect,
  Circle,
  Line,
  Path,
  G,
} from "react-native-svg";

// The Dawrak logo: a ticket with a clock face inside, and mint energy lines above
export default function Logo({ size = 80 }: { size?: number }) {
  const scale = size / 80;

  return (
    <Svg width={80 * scale} height={90 * scale} viewBox="0 0 80 90">
      {/* Energy lines radiating upward */}
      <Line x1="40" y1="14" x2="40" y2="4" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
      <Line x1="26" y1="18" x2="20" y2="9" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
      <Line x1="54" y1="18" x2="60" y2="9" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

      {/* Ticket outer shape */}
      <Rect x="2" y="18" width="76" height="66" rx="11" fill="none" stroke="#0F766E" strokeWidth="2.5" />

      {/* Left notch (semicircle cut-in) */}
      <Path
        d="M 2 42 A 9 9 0 0 1 2 60"
        fill="#FAFBFC"
        stroke="#0F766E"
        strokeWidth="2.5"
      />

      {/* Right notch */}
      <Path
        d="M 78 60 A 9 9 0 0 1 78 42"
        fill="#FAFBFC"
        stroke="#0F766E"
        strokeWidth="2.5"
      />

      {/* Dashed divider line across ticket */}
      <Line x1="11" y1="51" x2="69" y2="51" stroke="#0F766E" strokeWidth="1.5" strokeDasharray="4 3" opacity={0.3} />

      {/* Clock face */}
      <Circle cx="40" cy="40" r="14" fill="none" stroke="#0F766E" strokeWidth="2" />
      {/* Hour hand ~10 o'clock */}
      <Line x1="40" y1="40" x2="33" y2="33" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
      {/* Minute hand ~2 o'clock */}
      <Line x1="40" y1="40" x2="47" y2="32" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      {/* Center dot */}
      <Circle cx="40" cy="40" r="2.5" fill="#0F766E" />
    </Svg>
  );
}
