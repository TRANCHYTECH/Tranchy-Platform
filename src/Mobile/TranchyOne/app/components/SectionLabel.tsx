import { View, ViewStyle } from "react-native"
import { Text } from "react-native-paper"
import React from "react"
import { spacing } from "app/theme"
export function SectionLabel({ title, description }: { title: string; description?: string }) {
  return (
    <View style={$containerStyle}>
      <Text variant="titleSmall">{title}</Text>
      {description && <Text variant="labelSmall">{description}</Text>}
    </View>
  )
}

const $containerStyle: ViewStyle = {
  paddingBottom: spacing.xs,
  paddingTop: spacing.xs,
}
