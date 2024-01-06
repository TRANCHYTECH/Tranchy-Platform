import { View, StyleSheet } from "react-native"
import React from "react"
import { Text } from "react-native-paper"
import { spacing } from "app/theme"

const AgencySupportLevel = () => {
  return (
    <View style={styles.row}>
      <Text>Công ty tư vấn sẽ liên hệ với bạn.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    padding: spacing.xs,
  },
})

export { AgencySupportLevel }
