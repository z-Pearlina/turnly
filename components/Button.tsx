import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  icon?: keyof typeof Ionicons.glyphMap;
};

export default function Button({ label, onPress, variant = "primary", icon }: Props) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[styles.base, isPrimary ? styles.primary : styles.outline]}
    >
      {/* Text first → icon second; in RTL flex-row this puts icon on the LEFT */}
      <Text style={[styles.label, isPrimary ? styles.labelWhite : styles.labelTeal]}>
        {label}
      </Text>
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={isPrimary ? "#fff" : Colors.primary}
          style={styles.icon}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    gap: 10,
  },
  primary: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: "transparent",
  },
  label: {
    fontSize: 17,
    fontFamily: "Tajawal_700Bold",
    letterSpacing: 0.3,
  },
  labelWhite: { color: "#fff" },
  labelTeal: { color: Colors.primary },
  icon: { marginTop: 1 },
});
