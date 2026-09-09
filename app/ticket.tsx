import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef } from "react";
import { Colors } from "../constants/colors";
import { useQueue } from "../context/QueueContext";

export default function TicketScreen() {
  const router = useRouter();
  const { selectedOffice, setMyTicketNumber, setNowServing } = useQueue();
  const [ticketNumber, setTicketNumber] = useState("");
  const inputRef = useRef<TextInput>(null);

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Header ──
          RTL flex-row: first child → RIGHT, last child → LEFT
          [backBtn(RIGHT), title(center), spacer(LEFT)]
      */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-forward" size={26} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>أدخل رقم دورك</Text>
        <View style={styles.headerBtn} />
      </View>

      {/*
        KAV + ScrollView pattern — works on all Android/iOS sizes:
        - KAV behavior="padding" shrinks the available area when keyboard opens
        - ScrollView with flexGrow:1 + justifyContent:"space-between" keeps
          the button pinned to the bottom, and lets the user scroll to it
          on very small screens
      */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── Top content group ── */}
          <View>

            {/* Confirmation banner
                RTL: [checkCircle(→RIGHT), textBlock(→LEFT)]
            */}
            <View style={styles.banner}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={18} color="#fff" />
              </View>
              <View style={styles.bannerText}>
                <Text style={styles.bannerSmall}>تم التعرّف على المكتب</Text>
                <Text style={styles.bannerTitle}>
                  {selectedOffice?.name ?? "مكتب غير محدد"}
                </Text>
              </View>
            </View>

            {/* Label */}
            <Text style={styles.label}>رقم التذكرة</Text>

            {/* Number card */}
            <TouchableOpacity
              style={styles.numberCard}
              activeOpacity={0.9}
              onPress={() => inputRef.current?.focus()}
            >
              <Ionicons name="ticket-outline" size={22} color={Colors.border} />
              <TextInput
                ref={inputRef}
                style={styles.numberInput}
                value={ticketNumber}
                onChangeText={(t) => setTicketNumber(t.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                maxLength={3}
                placeholder="--"
                placeholderTextColor={Colors.border}
                textAlign="center"
                autoFocus
              />
            </TouchableOpacity>

            {/* Helper */}
            <Text style={styles.helper}>
              أدخل الرقم المطبوع على تذكرتك الورقية
            </Text>

          </View>

          {/* ── Continue button — sits at bottom via space-between ──
              RTL: [Text(→RIGHT), Arrow(→LEFT)]
          */}
          <TouchableOpacity
            style={[styles.continueBtn, !ticketNumber && styles.disabled]}
            activeOpacity={0.82}
            disabled={!ticketNumber}
            onPress={() => {
              const num = parseInt(ticketNumber, 10);
              setMyTicketNumber(num);
              // Random gap: 17–40 people ahead → ~51 min to ~2 hours wait
              const ahead = Math.floor(Math.random() * 24) + 17;
              setNowServing(Math.max(1, num - ahead));
              router.push("/tracking");
            }}
          >
            <Text style={styles.continueBtnLabel}>متابعة</Text>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

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
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Tajawal_700Bold",
    fontSize: 20,
    color: Colors.charcoal,
    textAlign: "center",
  },

  // ── ScrollView content ──
  scroll: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === "android" ? 16 : 8,
  },

  // ── Confirmation banner ──
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.mintLight,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 14,
    marginBottom: 28,
  },
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  bannerText: {
    flex: 1,
    alignItems: "flex-end",
  },
  bannerSmall: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 13,
    color: Colors.secondary,
  },
  bannerTitle: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 16,
    color: Colors.charcoal,
    marginTop: 3,
    textAlign: "right",
  },

  // ── Label ──
  label: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 16,
    color: Colors.charcoal,
    textAlign: "center",
    marginBottom: 12,
  },

  // ── Number card ──
  numberCard: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 12,
    gap: 2,
  },
  numberInput: {
    width: "100%",
    fontFamily: "Tajawal_700Bold",
    fontSize: 80,
    color: Colors.primary,
    padding: 0,
    height: 100,
    textAlign: "center",
  },

  // ── Helper ──
  helper: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 13,
    color: Colors.secondary,
    textAlign: "center",
    marginBottom: 24,
  },

  // ── Continue button ──
  continueBtn: {
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
  disabled: {
    opacity: 0.45,
  },
  continueBtnLabel: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 17,
    color: "#fff",
  },
});
