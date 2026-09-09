import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Colors } from "../constants/colors";
import { useQueue, OFFICES, Office } from "../context/QueueContext";

const { width, height } = Dimensions.get("window");
const ILLUS_W = Math.min(width * 0.8, 340);
const ILLUS_H = ILLUS_W * 0.72;

export default function WelcomeScreen() {
  const router = useRouter();
  const { setSelectedOffice } = useQueue();
  const [modalVisible, setModalVisible] = useState(false);

  function pickOffice(office: Office) {
    setSelectedOffice(office);
    setModalVisible(false);
    router.push("/ticket");
  }

  function scanAndProceed() {
    // Demo: auto-select the first office, as if the QR scan resolved it
    setSelectedOffice(OFFICES[0]);
    router.push("/ticket");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* ── Top: logo + title + tagline ── */}
        <View style={styles.top}>
          <Image
            source={require("../assets/logo_WS.png")}
            style={styles.logoImg}
            resizeMode="contain"
          />
          <Text style={styles.appName}>دورك</Text>
          <Text style={styles.tagline}>انتظر دورك أينما كنت</Text>

          {/* Discreet employee entry — small gear, invisible to casual users */}
          <TouchableOpacity
            style={styles.employeeEntry}
            onPress={() => router.push("/dashboard")}
            activeOpacity={0.5}
          >
            <Ionicons name="settings-outline" size={16} color={Colors.border} />
          </TouchableOpacity>
        </View>

        {/* ── Middle: illustration ── */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require("../assets/illustration.png")}
            style={{ width: ILLUS_W, height: ILLUS_H }}
            resizeMode="contain"
          />
        </View>

        {/* ── Bottom: buttons ── */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            activeOpacity={0.82}
            onPress={scanAndProceed}
          >
            <Text style={styles.btnLabelWhite}>امسح رمز المكتب</Text>
            <Ionicons name="camera-outline" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>أو</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.btn, styles.btnOutline]}
            activeOpacity={0.82}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.btnLabelTeal}>اختر من القائمة</Text>
            <Ionicons name="list-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

      </View>

      {/* ── Office picker modal ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)} />

        <View style={styles.sheet}>
          {/* Sheet header */}
          <View style={styles.sheetHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={Colors.secondary} />
            </TouchableOpacity>
            <Text style={styles.sheetTitle}>اختر المكتب</Text>
            {/* Spacer keeps title centered */}
            <View style={{ width: 24 }} />
          </View>

          <FlatList
            data={OFFICES}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.officeRow}
                activeOpacity={0.7}
                onPress={() => pickOffice(item)}
              >
                {/* RTL: [chevron(→RIGHT), name+icon(→LEFT)] */}
                <Ionicons name="chevron-back" size={20} color={Colors.primary} />
                <View style={styles.officeInfo}>
                  <Ionicons name="business-outline" size={18} color={Colors.secondary} />
                  <Text style={styles.officeName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: Platform.OS === "android" ? 16 : 8,
  },

  // ── Top ──
  top: {
    alignItems: "center",
    paddingTop: height < 700 ? 16 : 24,
  },
  employeeEntry: {
    marginTop: 12,
    padding: 6,
    opacity: 0.4,
  },
  logoImg: {
    width: height < 700 ? 92 : 110,
    height: height < 700 ? 92 : 110,
  },
  appName: {
    fontFamily: "Tajawal_700Bold",
    fontSize: height < 700 ? 40 : 46,
    color: Colors.charcoal,
    marginTop: -6,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 15,
    color: Colors.secondary,
    marginTop: 1,
  },

  // ── Illustration ──
  illustrationWrap: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 4,
  },

  // ── Buttons ──
  actions: {
    width: "100%",
    paddingHorizontal: 24,
    gap: 10,
  },
  btn: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: "transparent",
  },
  btnLabelWhite: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 17,
    color: "#fff",
    letterSpacing: 0.2,
  },
  btnLabelTeal: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 17,
    color: Colors.primary,
    letterSpacing: 0.2,
  },

  // ── Divider ──
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: "Tajawal_400Regular",
    fontSize: 14,
    color: Colors.secondary,
  },

  // ── Modal overlay ──
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  // ── Bottom sheet ──
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "android" ? 24 : 36,
    maxHeight: height * 0.6,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sheetTitle: {
    fontFamily: "Tajawal_700Bold",
    fontSize: 18,
    color: Colors.charcoal,
  },

  // ── Office rows ──
  officeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  officeInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  officeName: {
    fontFamily: "Tajawal_500Medium",
    fontSize: 16,
    color: Colors.charcoal,
    flex: 1,
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
  },
});
