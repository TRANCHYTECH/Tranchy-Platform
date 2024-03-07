import React, { useCallback, useRef, useState } from "react"
import { View, ViewStyle } from "react-native"
import { ListView, Screen } from "app/components"
import { QuestionSection, useStores } from "app/models"
import { useFocusEffect } from "@react-navigation/native"
import { BlockItem, BlockItemType, ExtraData } from "./BlockItem"
import { currentLocale } from "app/i18n"
import FlashMessage from "react-native-flash-message"
import { Button, Icon, MD3Colors } from "react-native-paper"
import { colors, spacing } from "app/theme"

const locale = currentLocale()

export type QuestionsScreenProps = {
  loadForSection: QuestionSection
  buildBlocks: (data: any) => BlockItemType[]
  onPressQuestion: (id: string) => void
  enableOnEndReached: boolean
}

export function QuestionsScreen({
  loadForSection,
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

  const loadQuestions = (resetQueryIndex: boolean) => {
    if (loadForSection === "highlights") {
      return questionStore.getHighlights()
    } else {
      return questionStore.query(loadForSection, resetQueryIndex)
    }
  }

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadQuestions(true)
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
      setExtraData({
        categories: metadataStore.questionCategories,
        savedQuestions: questionStore.savedQuestions,
        locale,
      })
      loadQuestions(true)
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
        data={buildBlocks(questionStore[loadForSection])}
        extraData={extraData}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={() => enableOnEndReached && loadQuestions(false)}
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
