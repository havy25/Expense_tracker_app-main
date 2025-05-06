import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Typo from "./Typo";
import { HeaderProps } from "@/types";

const Header = ({ title = "", leftIcon, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcons}>{leftIcon}</View>}
      {title && (
        <Typo
          size={22}
          fontWeight={"600"}
          style={{ textAlign: "center", width: leftIcon ? "82%" : "100%" }}
        >
          {title}
        </Typo>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  leftIcons: {
    alignSelf: "flex-start",
  },
});
