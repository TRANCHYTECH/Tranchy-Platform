import { View, StyleSheet } from "react-native"
import React from "react"
import { Text } from "react-native-paper"
import { colors, spacing } from "app/theme"

const CommunitySupportLevel = () => {
  return (
    <View style={styles.row}>
      <Text variant="labelSmall" style={{ color: colors.surfaceOutline }}>
        Câu hỏi sẽ được đăng tải lên cộng đồng và bạn sẽ không mất phí.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    padding: spacing.xs,
  },
})

export { CommunitySupportLevel }
