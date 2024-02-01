import React, { FC, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ScrollView, TextStyle, Image } from "react-native"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { Button, Modal, Portal, ProgressBar, Text } from "react-native-paper"
import { spacing, privacyImage, colors } from "app/theme"
import { $rightTextGrow, $row } from "app/theme/styles"

import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useStores } from "app/models"
import { Question, QuestionAction, QuestionCategoryResponse } from "app/services/ask-api/models"
import { getTitle } from "app/utils/localeTitle"
import { currentLocale } from "app/i18n"
import { formatDate } from "app/utils/formatDate"
// import { useStores } from "app/models"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { sendQuestionImage } from "app/theme/images"

interface QuestionDetailScreenProps extends AppStackScreenProps<"QuestionDetail"> {}

const locale = currentLocale()

const QuestionDetailView = ({
  question,
  categories,
}: {
  question: Question | null
  categories: QuestionCategoryResponse[]
}) => {
  return (
    question && (
      <ScrollView style={$questionContainer}>
        <View style={$contentBlock}>
          <Text variant="titleSmall">Nội dung câu hỏi</Text>
          <ProgressBar progress={0.8} style={{ height: spacing.xxxs }} color="#C43442" />
          <View style={$questionTitleBlock}>
            <View style={$priorityBlock}>
              <Text>Cần gấp trong </Text>
              <Text>... giờ</Text>
              <Text style={$rightTextGrow}>Còn lại ... phút</Text>
            </View>
            <View style={$categoryBlock}>
              {question.questionCategoryIds?.map((categoryId, index) => (
                <Text style={$categoryItem} key={index}>
                  #{getTitle(categories, categoryId, locale)}
                </Text>
              ))}
            </View>
            <Text>{question.title}</Text>
          </View>
        </View>
        <View style={$contentBlock}>
          <Text variant="titleSmall">Tập đính kèm</Text>
          <View>
            <Text>file 1.pdf</Text>
            <Text>file 2.docx</Text>
          </View>
        </View>
        <View style={$metadataBlock}>
          <Text variant="titleSmall" style={{ paddingBottom: spacing.xs }}>
            Chi tiết
          </Text>
          <View style={[$row, { paddingBottom: spacing.xs }]}>
            <MaterialCommunityIcons
              name="comment-plus-outline"
              size={spacing.md}
              color={"#76819B"}
            />
            <Text style={$metadataLeft}>Đăng lúc</Text>
            <Text>{formatDate(question.createdOn, "dd MMM yyyy, hh:MM")}</Text>
          </View>
          <View style={[$row, { paddingBottom: spacing.xs }]}>
            <MaterialCommunityIcons name="timer-outline" size={spacing.md} color={"#76819B"} />
            <Text style={$metadataLeft}>Giới hạn vào</Text>
            <Text>...</Text>
          </View>
          <View style={[$row, { paddingBottom: spacing.xs }]}>
            <MaterialCommunityIcons name="gift-open-outline" size={spacing.md} color={"#76819B"} />
            <Text style={$metadataLeft}>Phần thưởng</Text>
            <Text>Bí mật</Text>
          </View>
        </View>
        <View style={[$contentBlock, $privacyBlock]}>
          <View style={[$row, { paddingBottom: spacing.xs }]}>
            <Image style={{ width: spacing.md, height: spacing.md }} source={privacyImage} />
            <Text variant="labelLarge" style={{ paddingLeft: spacing.xs }}>
              Thông tin quyền riêng tư
            </Text>
          </View>
          <Text>
            {question.communityShareAgreement
              ? "Người gửi câu hỏi này khuyến khích bạn đóng góp câu trả lời đến với Cộng đồng"
              : "Người gửi câu hỏi này không cho phép chia sẻ thông tin trao đổi lên Cộng đồng"}
          </Text>
        </View>
      </ScrollView>
    )
  )
}

const PickingQuestionConfirmation = ({
  visible,
  onResult,
}: {
  visible: boolean
  onResult: (confirm: boolean) => void
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        contentContainerStyle={{
          backgroundColor: colors.confirmBackgroundColor,
          marginHorizontal: spacing.md,
          padding: spacing.md,
          gap: spacing.xs,
          borderRadius: spacing.xs,
        }}
      >
        <View style={{ alignItems: "center", gap: spacing.sm }}>
          <Text variant="titleMedium">Trước đó, hãy lưu ý rằng...</Text>
          <Text>
            Câu hỏi sẽ được ẩn và những người khác không thể trao đổi với người hỏi. Hãy cân nhắc
            trước để tránh làm lãng phí thời gian của 2 bên.
          </Text>
          <Image source={sendQuestionImage} style={{ width: 155, height: 195 }} />
        </View>
        <Button icon="check" mode="contained" buttonColor="#C76632" onPress={() => onResult(true)}>
          Tôi đã hiểu, OK
        </Button>
        <Button
          mode="contained"
          buttonColor={colors.background}
          textColor={colors.text}
          onPress={() => onResult(false)}
        >
          Quay lại
        </Button>
      </Modal>
    </Portal>
  )
}
const QuestionActionsView = ({
  question,
  onConfirm,
}: {
  onConfirm: () => void
  question: Question | null
}) => {
  const [visible, setVisible] = React.useState(false)

  const confirmationCallback = (value: boolean) => {
    setVisible(false)
    if (value) {
      onConfirm()
    }
  }
  return (
    question && (
      <>
        <View style={$submitSection}>
          {question.permissions?.actions?.includes(QuestionAction.TakeConsultation) && (
            <Button
              icon="comment-text-multiple"
              mode="contained"
              onPress={() => setVisible(true)}
              buttonColor="#C76632"
            >
              Tôi muốn trao đổi với người hỏi
            </Button>
          )}
        </View>
        <PickingQuestionConfirmation visible={visible} onResult={confirmationCallback} />
      </>
    )
  )
}

export const QuestionDetailScreen: FC<QuestionDetailScreenProps> = observer(
  function QuestionDetailScreen({ route }) {
    // Pull in one of our MST stores
    const { questionStore, metadataStore } = useStores()
    // Pull in navigation via hook
    const { id } = route.params
    const { navigate } =
      useNavigation<NativeStackNavigationProp<AppStackParamList, "QuestionDetail">>()

    const confirmPickQuestion = useCallback(async () => {
      await questionStore.pickQuestion(id)
      navigate("QuestionConversation", { id })
    }, [id])

    useFocusEffect(
      useCallback(() => {
        questionStore.getQuestion(id)
      }, []),
    )

    return (
      <Screen contentContainerStyle={$root} preset="fixed">
        <QuestionDetailView
          question={questionStore.currentQuestion}
          categories={metadataStore.questionCategories}
        />
        <QuestionActionsView
          question={questionStore.currentQuestion}
          onConfirm={confirmPickQuestion}
        />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $questionContainer: ViewStyle = {
  flexGrow: 1,
}

const $priorityBlock: ViewStyle = {
  flexDirection: "row",
  flex: 1,
}

const $contentBlock: ViewStyle = {
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
}

const $questionTitleBlock: ViewStyle = {
  borderRadius: spacing.xxs,
  backgroundColor: "#FBEEE6",
  padding: spacing.md,
}

const $privacyBlock: ViewStyle = {
  backgroundColor: "#FBEEE6",
  marginHorizontal: spacing.md,
  marginVertical: spacing.xs,
  borderRadius: spacing.xxs,
}

const $categoryBlock: ViewStyle = {
  flexDirection: "row",
  flex: 1,
}

const $categoryItem: TextStyle = {
  color: "#C76632",
}
const $metadataLeft: TextStyle = {
  width: 130,
  paddingLeft: spacing.xs,
}

const $metadataBlock: ViewStyle = {
  paddingHorizontal: spacing.md,
}

const $submitSection: ViewStyle = {
  padding: spacing.xs,
}
