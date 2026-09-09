import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Colors } from "../constants/colors";
import { useQueue } from "../context/QueueContext";

// Static bar chart data — peak hours today
const PEAK_HOURS = [
  { label: "9ص",  value: 12, peak: false },
  { label: "10ص", value: 28, peak: false },
  { label: "11ص", value: 56, peak: true  },
  { label: "12م", value: 48, peak: false },
  { label: "1م",  value: 34, peak: false },
  { label: "2م",  value: 18, peak: false },
];
const MAX_VALUE = Math.max(...PEAK_HOURS.map((h) => h.value));
const CHART_HEIGHT = 120;

export default function DashboardScreen() {
  const {
    selectedOffice,
    nowServing,
    incrementNowServing,
    setManualMode,
  } = useQueue();

  // Take manual control when this screen is open; release on exit
  useEffect(() => {
    setManualMode(true);
    return () => setManualMode(false);
  }, []);

  // "في الانتظار" — simulated total queue size minus what's been served
  const waiting = Math.max(0, 169 - nowServing);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ──
            RTL flex-row: first child = visual RIGHT, last = visual LEFT
            [headerText (RIGHT)] ← → [settingsBtn (LEFT)]
        */}
        <View style={styles.header}>
          {/* Title + office — FIRST = visual RIGHT */}
          <View style={styles.headerText}>
            {/* titleRow RTL: icon FIRST = visual RIGHT (before the title in Arabic) */}
            <View style={styles.titleRow}>
              <Ionicons name="bar-chart-outline" size={22} color={Colors.primary} />
              <Text style={styles.headerTitle}>لوحة التحكّم</Text>
            </View>
            {/* officeRow RTL: [name (RIGHT)] [pin (LEFT)] */}
            <View style={styles.officeRow}>
              <Text style={styles.officeName} numberOfLines={1}>
                {selectedOffice?.name ?? "مكتب غير محدد"}
              </Text>
              <Ionicons name="location-outline" size={14} color={Colors.secondary} />
            </View>
          </View>

          {/* Settings — LAST = visual LEFT */}
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={22} color={Colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* ── 2×2 Stat cards ── */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="hourglass-outline"
            label="في الانتظار"
            value={String(waiting)}
          />
          <StatCard
            icon="people-outline"
            label="خُدموا اليوم"
            value="128"
          />
          <StatCard
            icon="time-outline"
            label="متوسط الخدمة"
            value="4 دقائق"
            valueSm
          />
          <StatCard
            icon="apps-outline"
            label="الشبابيك النشطة"
            value="3 من 5"
            valueSm
          />
        </View>

        {/* ── Current number control card ── */}
        <View style={styles.controlCard}>
          {/* Label row (RIGHT in RTL) */}
          <View style={styles.controlHeader}>
            <Text style={styles.controlLabel}>الرقم الحالي</Text>
            <Ionicons name="ticket-outline" size={22} color={Colors.accent} />
          </View>

          {/* Big number */}
          <Text style={styles.nowServingNum}>{nowServing}</Text>

          {/* Buttons: التالي (RIGHT), تخطّي (LEFT) in RTL */}
          <View style={styles.controlBtns}>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={incrementNowServing}
              activeOpacity={0.82}
            >
              <Text style={styles.nextBtnLabel}>التالي</Text>
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipBtn}
              onPress={incrementNowServing}
              activeOpacity={0.82}
            >
              <Text style={styles.skipBtnLabel}>تخطّي</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Peak hours bar chart ── */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>أوقات الذروة اليوم</Text>
            <Ionicons name="bar-chart-outline" size={18} color={Colors.primary} />
          </View>

          <View style={styles.chartArea}>
            {PEAK_HOURS.map((hour) => {
              const barH = Math.round((hour.value / MAX_VALUE) * CHART_HEIGHT);
              return (
                <View key={hour.label} style={styles.barGroup}>
                  <Text style={styles.barValue}>{hour.value}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        { height: barH },
                        hour.peak ? styles.barPeak : styles.barNormal,
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{hour.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>

      {/* ── Bottom tab bar (visual only) ── */}
      <View style={styles.tabBar}>
        <TabItem icon="home" label="الرئيسية" active />
        <TabItem icon="people-outline" label="الطابور" />
        <TabItem icon="document-text-outline" label="التقارير" />
        <TabItem icon="person-outline" label="الملف الشخصي" />
      </View>
    </SafeAreaView>
  );
}

// ── Reusable stat card ──
function StatCard({
  icon,
  label,
  value,
  valueSm,
}: {
  icon: any;
  label: string;
  value: string;
  valueSm?: boolean;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconWrap}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <Text style={[styles.statValue, valueSm && styles.statValueSm]}>
        {value}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Reusable tab item ──
function TabItem({
  icon,
  label,
  active,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  const color = active ? Colors.primary : Colors.secondary;
  return (
    <View style={styles.tabItem}>
      <Ionicons name={active ? icon : icon} size={24} color={color} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 16,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
  },
  headerText: {
    alignItems: "flex-start", // flex-start = visual RIGHT in RTL
    flex: 1,
    marginLeft: 12,           // gap between this block and the settings btn on its left
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 24,
    color: Colors.charcoal,
  },
  officeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  officeName: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 14,
    color: Colors.secondary,
  },

  // ── 2×2 Stats grid ──
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "47%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.mintLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 36,
    color: Colors.primary,
    lineHeight: 42,
  },
  statValueSm: {
    fontSize: 24,
    lineHeight: 30,
  },
  statLabel: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 13,
    color: Colors.secondary,
    marginTop: 2,
    alignSelf: "stretch",
    textAlign: "center",
  },

  // ── Control card ──
  controlCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  controlHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  controlLabel: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 14,
    color: Colors.secondary,
  },
  nowServingNum: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 72,
    color: Colors.charcoal,
    textAlign: "center",
    lineHeight: 84,
    marginBottom: 16,
  },
  controlBtns: {
    flexDirection: "row",
    gap: 12,
  },
  nextBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  nextBtnLabel: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 17,
    color: "#fff",
  },
  skipBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  skipBtnLabel: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 16,
    color: Colors.charcoal,
  },

  // ── Bar chart ──
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  chartTitle: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 16,
    color: Colors.charcoal,
  },
  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: CHART_HEIGHT + 44,
  },
  barGroup: {
    alignItems: "center",
    flex: 1,
    gap: 4,
  },
  barValue: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 11,
    color: Colors.secondary,
  },
  barTrack: {
    height: CHART_HEIGHT,
    justifyContent: "flex-end",
    width: "70%",
  },
  bar: {
    borderRadius: 6,
    width: "100%",
  },
  barPeak: {
    backgroundColor: Colors.accent,
  },
  barNormal: {
    backgroundColor: Colors.mintMid,
  },
  barLabel: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 11,
    color: Colors.secondary,
  },

  // ── Tab bar ──
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  tabLabel: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 11,
    color: Colors.secondary,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontFamily: "Tajawal_700Bold",
  },
});
