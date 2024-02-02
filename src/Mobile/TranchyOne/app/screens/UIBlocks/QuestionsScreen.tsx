import React, { useCallback, useRef, useState } from "react"
import { View, ViewStyle } from "react-native"
import { ListView, Screen } from "app/components"
import { useStores } from "app/models"
import { useFocusEffect } from "@react-navigation/native"
import { BlockItem, BlockItemType, ExtraData } from "./BlockItem"
import { currentLocale } from "app/i18n"
import FlashMessage from "react-native-flash-message"
import { Button, Icon, MD3Colors } from "react-native-paper"
import { colors, spacing } from "app/theme"
import { invoke } from "lodash-es"

const locale = currentLocale()

export type QuestionsScreenProps = {
  loadQuestionsMethod:
    | "getRecentQuestions"
    | "getUserHighlights"
    | "getMyConsultations"
    | "getMyQuestions"
  loadQuestionsProperty: "recentQuestions" | "userHighlights" | "myConsultations" | "myQuestions"
  buildBlocks: (data: any) => BlockItemType[]
  onPressQuestion: (id: string) => void
  enableOnEndReached: boolean
}

export function QuestionsScreen({
  loadQuestionsMethod,
  loadQuestionsProperty,
  buildBlocks,
  onPressQuestion,
  enableOnEndReached,
}: QuestionsScreenProps) {
  const { questionStore, metadataStore } = useStores()
  const [extraData, setExtraData] = useState<ExtraData>({
    categories: [],
    savedQuestions: [],
    locale,
  })
  const [refreshing, setRefreshing] = useState(false)
  const notification = useRef<FlashMessage>(null)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await invoke(questionStore, loadQuestionsMethod, true)
    setRefreshing(false)
  }, [])

  const handleSaving = async (questionId: string) => {
    const result = await questionStore.toggleSavingQuestion(questionId)
    if (result === "NotMatch") {
      return
    }

    notification.current?.showMessage({
      message: result === "Saved" ? "Đã lưu câu hỏi" : "Đã huỷ lưu câu hỏi",
      type: "success",
      position: "top",
      style: $flashMessage,
      color: colors.text,
      statusBarHeight: 1,
      icon: () => <Icon source="information-outline" color={MD3Colors.neutral0} size={18} />,
      titleStyle: { marginLeft: spacing.xs },
      renderAfterContent: () => (
        <View style={$afterFlashMessage}>
          <Button mode="text">Xem tất cả</Button>
        </View>
      ),
    })
  }

  useFocusEffect(
    useCallback(() => {
      async function load() {
        await invoke(questionStore, loadQuestionsMethod, true)
      }
      setExtraData({
        categories: metadataStore.questionCategories,
        savedQuestions: questionStore.savedQuestions,
        locale,
      })
      load()
    }, []),
  )

  return (
    <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={$root}>
      <ListView<BlockItemType>
        estimatedItemSize={120}
        getItemType={(item) => item.type}
        renderItem={({ item, extraData }) => (
          <BlockItem
            data={item}
            onPressSaving={handleSaving}
            extraData={extraData}
            onPressQuestion={onPressQuestion}
          />
        )}
        data={buildBlocks(questionStore[loadQuestionsProperty])}
        extraData={extraData}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={() => enableOnEndReached && invoke(questionStore, loadQuestionsMethod, false)}
      />
      <FlashMessage ref={notification} />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const $flashMessage: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderBottomWidth: 1,
  borderTopWidth: 1,
  borderBottomColor: "#AFB7C8",
  borderTopColor: "#AFB7C8",
}

const $afterFlashMessage: ViewStyle = {
  position: "absolute",
  right: 0,
  top: -10,
}
