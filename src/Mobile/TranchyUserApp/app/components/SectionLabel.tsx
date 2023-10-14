import { View } from "react-native"
import { Text } from "react-native-paper"

export function SectionLabel({ title, description }: { title: string; description?: string }) {
  return (
    <View>
      <Text variant="titleMedium">{title}</Text>
      {description && <Text variant="labelLarge">{description}</Text>}
    </View>
  )
}
