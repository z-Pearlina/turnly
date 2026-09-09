import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import LottieView from "lottie-react-native";
import { Colors } from "../constants/colors";
import { useQueue } from "../context/QueueContext";

const MINS_PER_PERSON = 3;
const TICK_MS = 3000; // advance queue every 3 s (demo speed)
const NOTIFY_THRESHOLD = 5; // fire notification when ≤5 ahead

function formatWait(minutes: number): { display: string; label: string } {
  if (minutes <= 0) return { display: "0:00", label: "لحظات" };
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const display = h > 0
    ? `${h}:${String(m).padStart(2, "0")}`
    : `0:${String(m).padStart(2, "0")}`;
  const label = h > 1
    ? `${h} ساعات و ${m} دقيقة`
    : h === 1
    ? `ساعة و ${m} دقيقة`
    : `${m} دقيقة`;
  return { display, label };
}

export default function TrackingScreen() {
  const { selectedOffice, myTicketNumber, nowServing, setNowServing } = useQueue();

  // ── Live queue simulation ──
  useEffect(() => {
    const limit = myTicketNumber ?? Infinity;
    const timer = setInterval(() => {
      setNowServing((prev) => (prev >= limit ? prev : prev + 1));
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [myTicketNumber]);

  // ── Computed values ──
  const myNum = myTicketNumber ?? 0;
  const ahead = Math.max(0, myNum - nowServing);
  const isMyTurn = myNum > 0 && nowServing >= myNum;
  const waitMinutes = ahead * MINS_PER_PERSON;
  const { display: timeDisplay, label: timeLabel } = formatWait(waitMinutes);
  // Progress: how far the queue has advanced toward my number
  const progress = myNum > 0 ? Math.min(1, nowServing / myNum) : 0;

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header ──
          RTL flex-row: first → RIGHT, last → LEFT
          [officeSection(RIGHT), menuIcon(LEFT)]
      */}
      <View style={styles.header}>
        <View style={styles.officeSection}>
          <Text style={styles.officeName} numberOfLines={1}>
            {selectedOffice?.name ?? "مكتب غير محدد"}
          </Text>
          <Ionicons name="location-outline" size={16} color={Colors.secondary} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero card ──
            justifyContent:"space-between" puts top group at top,
            progress bar at bottom — no spacer needed
        */}
        <View style={styles.heroCard}>

          <Text style={styles.heroSubtitle}>
            {isMyTurn ? "🎉 حان دورك الآن!" : "دورك القادم بعد"}
          </Text>
          <LottieView
            source={require("../assets/hourglass.json")}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.timeDisplay}>{isMyTurn ? "0:00" : timeDisplay}</Text>
          <Text style={styles.timeLabel}>{isMyTurn ? "دورك الآن!" : timeLabel}</Text>

          {/* Progress bar sits directly below the label — no gap */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round(progress * 100)}%` },
              ]}
            />
          </View>

        </View>

        {/* ── Stats row ──
            RTL flex-row: first → RIGHT ("رقمك"), last → LEFT ("الرقم الحالي")
        */}
        <View style={styles.statsRow}>
          {/* رقمك (RIGHT) */}
          <View style={styles.statCard}>
            {/* Card header RTL: [label(RIGHT), icon(LEFT)] */}
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>رقمك</Text>
              <Ionicons name="ticket-outline" size={20} color={Colors.accent} />
            </View>
            <Text style={[styles.statNum, { color: Colors.primary }]}>
              {myNum > 0 ? myNum : "--"}
            </Text>
          </View>

          {/* الرقم الحالي (LEFT) */}
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>الرقم الحالي</Text>
              <Ionicons name="people-outline" size={20} color={Colors.accent} />
            </View>
            <Text style={[styles.statNum, { color: Colors.charcoal }]}>
              {nowServing}
            </Text>
          </View>
        </View>

        {/* ── People ahead ──
            RTL flex-row: first → RIGHT (text), last → LEFT (icon)
        */}
        <View style={styles.aheadRow}>
          <Text style={styles.aheadText}>
            {isMyTurn ? "حان دورك!" : `أمامك ${ahead} شخصاً`}
          </Text>
          <Ionicons name="people-outline" size={22} color={Colors.secondary} />
        </View>

        {/* ── Notification button ──
            RTL flex-row: first → RIGHT (text), last → LEFT (bell)
        */}
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.82}>
          <Text style={styles.notifLabel}>تتنبّه قبل دوري</Text>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  officeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    flexShrink: 1,
  },
  officeName: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 15,
    color: Colors.charcoal,
    flexShrink: 1,
  },
  // ── Scroll ──
  scroll: {
    flexGrow: 1,          // stretches container to full screen height
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },

  // ── Hero card ──
  heroCard: {
    flex: 1,
    minHeight: 240,
    backgroundColor: Colors.mintLight,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center", // whole content block centered vertically
  },
  lottie: {
    width: 170,
    height: 170,
    marginTop: 4,
    marginBottom: 2,
  },
  heroSubtitle: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 15,
    color: Colors.secondary,
  },
  timeDisplay: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 56,
    color: Colors.primary,
    lineHeight: 64,
  },
  timeLabel: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 2,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 14,
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },

  // ── Stats row ──
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 13,
    color: Colors.secondary,
  },
  statNum: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 44,
    lineHeight: 52,
  },

  // ── People ahead ──
  aheadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  aheadText: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 15,
    color: Colors.secondary,
  },

  // ── Notification button ──
  notifBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    gap: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 0,
  },
  notifLabel: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 17,
    color: "#fff",
  },
});
