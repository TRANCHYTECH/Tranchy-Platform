import React, { FC, useCallback, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { MainTabScreenProps } from "app/navigators"
import { ListView, Screen } from "app/components"
import { BlockItem, BlockItemType, ExtraData } from "../UIBlocks/BlockItem"
import { useStores } from "app/models"
import { useFocusEffect } from "@react-navigation/native"
import { buildBlocks } from "./Blocks"
import { currentLocale } from "app/i18n"
import FlashMessage from "react-native-flash-message"
import { colors, spacing } from "app/theme"
import { Button, Icon, MD3Colors } from "react-native-paper"

const locale = currentLocale()

interface WalkAroundScreenProps extends MainTabScreenProps<"WalkAround"> {}

export const WalkAroundScreen: FC<WalkAroundScreenProps> = observer(function WalkAroundScreen() {
  const { highlightStore, metadataStore, questionStore } = useStores()
  const [extraData, setExtraData] = useState<ExtraData>()
  const [refreshing, setRefreshing] = useState(false)
  const notification = useRef<FlashMessage>(null)

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await highlightStore.getUserHighlights()
    setRefreshing(false)
  }, [])

  const handleSaving = async (questionId: string) => {
    const result = await questionStore.toggleSavingQuestion(questionId)
    if (result === 0) {
      return
    }

    notification.current?.showMessage({
      message: result === 1 ? "Đã lưu câu hỏi" : "Đã huỷ lưu câu hỏi",
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
        await highlightStore.getUserHighlights()
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
    <Screen preset="fixed" safeAreaEdges={[]} contentContainerStyle={$root}>
      <ListView<BlockItemType>
        estimatedItemSize={120}
        getItemType={(item) => item.type}
        renderItem={({ item, extraData }) => (
          <BlockItem data={item} extraData={extraData} onPressSaving={handleSaving} />
        )}
        data={buildBlocks(highlightStore.userHighlights)}
        extraData={extraData}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <FlashMessage ref={notification} />
    </Screen>
  )
})

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
