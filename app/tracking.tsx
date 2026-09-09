import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { Colors } from "../constants/colors";
import { useQueue } from "../context/QueueContext";
import { NOTIFY_THRESHOLD } from "../utils/notifications";

const MINS_PER_PERSON = 3;
const TICK_MS = 3000;

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
  const insets = useSafeAreaInsets();
  const { selectedOffice, myTicketNumber, nowServing, setNowServing } = useQueue();

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifConfirmed, setNotifConfirmed] = useState(false);
  const [bannerText, setBannerText] = useState("");
  const [bannerVisible, setBannerVisible] = useState(false);
  const hasNotified = useRef(false);

  const bannerY = useRef(new Animated.Value(-160)).current;

  function showBanner(text: string) {
    setBannerText(text);
    setBannerVisible(true);
    bannerY.setValue(-160); // reset before animating in
    Animated.sequence([
      Animated.spring(bannerY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }),
      Animated.delay(4000),
      Animated.timing(bannerY, {
        toValue: -160,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Remove the element entirely after it slides back up
      setBannerVisible(false);
    });
  }

  // Live queue simulation
  useEffect(() => {
    const limit = myTicketNumber ?? Infinity;
    const timer = setInterval(() => {
      setNowServing((prev) => (prev >= limit ? prev : prev + 1));
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [myTicketNumber]);

  // Fire in-app banner once when ahead drops to threshold
  useEffect(() => {
    const myNum = myTicketNumber ?? 0;
    const ahead = Math.max(0, myNum - nowServing);

    if (
      notifEnabled &&
      !hasNotified.current &&
      myNum > 0 &&
      ahead <= NOTIFY_THRESHOLD &&
      ahead > 0
    ) {
      hasNotified.current = true;
      showBanner(`دورك اقترب! بقيت ${ahead} أرقام فقط — يُنصح بالعودة الآن`);
    }
  }, [nowServing, myTicketNumber, notifEnabled]);

  function handleNotifButton() {
    if (notifConfirmed) return;
    setNotifEnabled(true);
    setNotifConfirmed(true);
    showBanner("✓ سيتم تنبيهك عند اقتراب دورك");
  }

  const myNum = myTicketNumber ?? 0;
  const ahead = Math.max(0, myNum - nowServing);
  const isMyTurn = myNum > 0 && nowServing >= myNum;
  const waitMinutes = ahead * MINS_PER_PERSON;
  const { display: timeDisplay, label: timeLabel } = formatWait(waitMinutes);
  const progress = myNum > 0 ? Math.min(1, nowServing / myNum) : 0;

  return (
    <SafeAreaView style={styles.safe}>

      {/* In-app notification banner — only mounted while visible */}
      {bannerVisible && (
        <Animated.View
          style={[
            styles.banner,
            { paddingTop: insets.top + 12, transform: [{ translateY: bannerY }] },
          ]}
          pointerEvents="none"
        >
          <Ionicons name="notifications" size={20} color="#fff" />
          <Text style={styles.bannerText}>{bannerText}</Text>
        </Animated.View>
      )}

      <View style={styles.header}>
        <View style={styles.officeSection}>
          <Ionicons name="location-outline" size={16} color={Colors.secondary} />
          <Text style={styles.officeName} numberOfLines={1}>
            {selectedOffice?.name ?? "مكتب غير محدد"}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

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

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round(progress * 100)}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>رقمك</Text>
              <Ionicons name="ticket-outline" size={20} color={Colors.accent} />
            </View>
            <Text style={[styles.statNum, { color: Colors.primary }]}>
              {myNum > 0 ? myNum : "--"}
            </Text>
          </View>

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

        <View style={styles.aheadRow}>
          <Text style={styles.aheadText}>
            {isMyTurn ? "حان دورك!" : `أمامك ${ahead} شخصاً`}
          </Text>
          <Ionicons name="people-outline" size={22} color={Colors.secondary} />
        </View>

        <TouchableOpacity
          style={[styles.notifBtn, notifConfirmed && styles.notifBtnConfirmed]}
          activeOpacity={notifConfirmed ? 1 : 0.82}
          onPress={handleNotifButton}
        >
          {notifConfirmed ? (
            <>
              <Text style={styles.notifLabel}>سيتم تنبيهك قبل دورك ✓</Text>
              <Ionicons name="notifications" size={22} color="#fff" />
            </>
          ) : (
            <>
              <Text style={styles.notifLabel}>نبّهني قبل دوري</Text>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </>
          )}
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

  // In-app banner — floats below the status bar with side margins
  banner: {
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    zIndex: 99,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.primary,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  bannerText: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 14,
    color: "#fff",
    flexShrink: 1,
    textAlign: "center",
  },

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

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },

  heroCard: {
    flex: 1,
    minHeight: 240,
    backgroundColor: Colors.mintLight,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
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
  },
  notifBtnConfirmed: {
    backgroundColor: Colors.accent,
  },
  notifLabel: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 17,
    color: "#fff",
  },
});
