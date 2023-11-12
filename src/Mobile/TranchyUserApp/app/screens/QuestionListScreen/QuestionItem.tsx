import React from "react"
import { View, Image, StyleSheet, Pressable } from "react-native"
import { Text } from "react-native-paper"
import { Question } from "app/models"
import { colors, getSupportLevelImage, spacing } from "app/theme"
import { timeAgo } from "app/utils/formatDate"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppStackParamList } from "app/navigators"

const QuestionItem = ({ item }: { item: Question }) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<AppStackParamList, "QuestionList">>()
  return (
    <Pressable
      style={styles.questionItem}
      onPress={() => {
        console.log("Press item")
        navigate("QuestionDetails", { id: item.id })
      }}
    >
      <Image style={styles.tinyLogo} source={getSupportLevelImage(item.supportLevel)} />
      <View style={styles.row}>
        <View style={styles.questionHeader}>
          <Text variant="titleMedium">{item.supportLevel}</Text>
          <Text variant="titleSmall">Chờ trả lời</Text>
        </View>
        <View style={styles.questionBrief}>
          <Text>{item.title}</Text>
          <Text variant="labelMedium">#{item.questionCategoryIds.join(" #").toUpperCase()}</Text>
          <Text variant="labelSmall">{timeAgo(item.createdOn)}</Text>
        </View>
      </View>
    </Pressable>
  )
}

export default QuestionItem

export const styles = StyleSheet.create({
  questionBrief: {
    flex: 1,
    gap: spacing.xs,
  },
  questionHeader: {
    alignItems: "baseline",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  questionItem: {
    backgroundColor: colors.palette.neutral100,
    flexDirection: "row",
    marginBottom: spacing.xxs,
    paddingBottom: spacing.xs,
    padding: spacing.md,
  },
  row: {
    flex: 1,
  },
  tinyLogo: {
    height: 32,
    margin: spacing.xs,
    width: 32,
  },
})
