import { View, StyleSheet } from "react-native"
import React from "react"
import { Text } from "react-native-paper"
import { colors, spacing } from "app/theme"

const AgencySupportLevel = () => {
  return (
    <View style={styles.row}>
      <Text variant="labelSmall" style={{ color: colors.surfaceOutline }}>
        Công ty tư vấn sẽ liên hệ với bạn.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    padding: spacing.xs,
  },
})

export { AgencySupportLevel }
