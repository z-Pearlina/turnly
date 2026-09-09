import Svg, {
  Circle,
  Ellipse,
  Rect,
  Line,
  Path,
  G,
} from "react-native-svg";

const T = "#0F766E"; // teal
const M = "#10B981"; // mint
const ML = "#A7F3D0"; // mint light
const MLL = "#D1FAE5"; // mint very light

// Simplified walking person scene matching the mockup's mint/teal line-art style
export default function WalkerIllustration({ width = 300 }: { width?: number }) {
  const h = width * 1.05;
  const s = width / 300;

  return (
    <Svg width={width} height={h} viewBox="0 0 300 315">
      {/* === BACKGROUND ELEMENTS === */}

      {/* Ground */}
      <Ellipse cx="150" cy="305" rx="130" ry="10" fill={MLL} opacity={0.6} />

      {/* Left large tree */}
      <Rect x="45" y="215" width="12" height="70" rx="4" fill={ML} />
      <Circle cx="51" cy="200" r="32" fill={MLL} />
      <Circle cx="51" cy="200" r="22" fill={ML} />
      <Circle cx="51" cy="200" r="12" fill={M} opacity={0.6} />

      {/* Small bush left */}
      <Circle cx="28" cy="265" r="16" fill={MLL} />
      <Circle cx="42" cy="260" r="14" fill={ML} />

      {/* Right background building */}
      <Rect x="210" y="175" width="50" height="110" rx="4" fill={MLL} />
      <Rect x="218" y="185" width="10" height="14" rx="2" fill={ML} />
      <Rect x="234" y="185" width="10" height="14" rx="2" fill={ML} />
      <Rect x="218" y="208" width="10" height="14" rx="2" fill={ML} />
      <Rect x="234" y="208" width="10" height="14" rx="2" fill={ML} />

      {/* Right small tree */}
      <Rect x="255" y="240" width="9" height="50" rx="3" fill={ML} />
      <Circle cx="259" cy="228" r="20" fill={MLL} />
      <Circle cx="259" cy="228" r="13" fill={ML} />

      {/* Park bench */}
      <Rect x="180" y="255" width="50" height="6" rx="3" fill={ML} />
      <Rect x="185" y="261" width="4" height="20" rx="2" fill={ML} />
      <Rect x="221" y="261" width="4" height="20" rx="2" fill={ML} />
      <Rect x="182" y="249" width="46" height="6" rx="3" fill={ML} />

      {/* Street lamp */}
      <Rect x="197" y="195" width="5" height="75" rx="2.5" fill={ML} />
      <Circle cx="199" cy="191" r="7" fill={ML} />
      <Circle cx="199" cy="191" r="4" fill={M} opacity={0.7} />

      {/* Cloud left */}
      <Ellipse cx="60" cy="65" rx="35" ry="18" fill={MLL} />
      <Ellipse cx="82" cy="58" rx="22" ry="14" fill={MLL} />
      <Ellipse cx="44" cy="60" rx="18" ry="12" fill={MLL} />

      {/* Cloud right */}
      <Ellipse cx="245" cy="80" rx="28" ry="14" fill={MLL} />
      <Ellipse cx="263" cy="74" rx="18" ry="11" fill={MLL} />
      <Ellipse cx="232" cy="77" rx="15" ry="10" fill={MLL} />

      {/* === WALKING PERSON === */}

      {/* Body (torso) */}
      <Rect x="138" y="148" width="32" height="45" rx="10" fill={MLL} stroke={T} strokeWidth="2.5" />

      {/* Head */}
      <Circle cx="155" cy="128" r="22" fill={MLL} stroke={T} strokeWidth="2.5" />
      {/* Hair */}
      <Path d="M 133 122 Q 135 100 155 102 Q 175 100 177 122" fill={T} />
      {/* Face features */}
      <Circle cx="148" cy="127" r="2.5" fill={T} />
      <Circle cx="162" cy="127" r="2.5" fill={T} />
      <Path d="M 148 135 Q 155 141 162 135" stroke={T} strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Left arm (back, relaxed down) */}
      <Path d="M 138 158 Q 118 175 122 200" stroke={T} strokeWidth="5" fill="none" strokeLinecap="round" />
      <Circle cx="122" cy="202" r="5" fill={T} />

      {/* Right arm (raised, holding phone) */}
      <Path d="M 170 160 Q 196 148 205 130" stroke={T} strokeWidth="5" fill="none" strokeLinecap="round" />
      <Circle cx="206" cy="129" r="5" fill={T} />

      {/* Phone */}
      <Rect x="198" y="108" width="22" height="36" rx="5" fill={T} />
      <Rect x="202" y="113" width="14" height="24" rx="3" fill={MLL} />
      {/* Screen content (simple lines) */}
      <Line x1="205" y1="118" x2="213" y2="118" stroke={M} strokeWidth="1.5" strokeLinecap="round" />
      <Line x1="205" y1="123" x2="213" y2="123" stroke={M} strokeWidth="1.5" strokeLinecap="round" />

      {/* Green checkmark bubble */}
      <Circle cx="222" cy="107" r="13" fill={M} />
      <Path d="M 215 107 L 220 113 L 230 101" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* Left leg (back leg, extended back) */}
      <Path d="M 145 193 Q 128 220 120 255" stroke={T} strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Left shoe */}
      <Ellipse cx="117" cy="259" rx="14" ry="7" fill={T} />

      {/* Right leg (front leg, stepping forward) */}
      <Path d="M 160 193 Q 175 220 185 252" stroke={T} strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Right shoe */}
      <Ellipse cx="188" cy="256" rx="14" ry="7" fill={T} />

      {/* Pants (dark teal trousers) */}
      <Path d="M 138 185 L 145 193 L 160 193 L 167 185 Z" fill={T} />
    </Svg>
  );
}
