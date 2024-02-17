import React, { FC, useCallback, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, StyleSheet, Image, Alert } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { BottomSheet, BottomSheetBase, Screen, SectionLabel } from "app/components"
import {
  Button,
  Checkbox,
  HelperText,
  Text,
  TextInput,
  IconButton,
  MD3Colors,
} from "react-native-paper"
import { GiftedChat, IMessage } from "react-native-gifted-chat"
import { createQuestionEvent, resolveConsultation } from "app/services/ask-api/askApi"
import { useConversationHub } from "app/services/signalr/useConversationHub"
import { useFocusEffect } from "@react-navigation/native"
import { useStores } from "app/models"
import { colors, finishConsultationImage, spacing } from "app/theme"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { translate } from "app/i18n"
import { ConclusionFormModel, ConclusionFormSchema } from "./ConclusionFormSchema"
import {
  CreateQuestionEventMessageSentRequest,
  CreateQuestionEventMessageSentRequestType,
  Question,
} from "app/services/ask-api/models"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface QuestionConversationScreenProps extends AppStackScreenProps<"QuestionConversation"> {}

export const QuestionConversationScreen: FC<QuestionConversationScreenProps> = observer(
  function QuestionConversationScreen({ navigation, route }) {
    const insets = useSafeAreaInsets()
    const { id } = route.params
    const { questionStore, metadataStore } = useStores()
    const [messages, setMessages] = useState<any[]>([])
    const [openCategorySelection, setOpenCategorySelection] = useState(false)
    const bottomSheetRef = useRef<BottomSheet>(null)

    const openBottomSheet = () => {
      setOpenCategorySelection(true)
      bottomSheetRef.current?.expand()
    }

    const closeBottomSheet = (success: boolean) => {
      setOpenCategorySelection(false)
      bottomSheetRef.current?.close()
      if (success) {
        Alert.alert(
          "Chúc mừng bạn đã hoàn thành tư vấn",
          "Hệ thống sẽ chuyển câu trả lời đến... Trong vòng 24 giờ...",
          [
            {
              text: "Danh sách câu hỏi",
              onPress: () => navigation.navigate("MainTab", { screen: "WalkAround" }),
            },
          ],
        )
      }
    }

    useConversationHub({
      receiveEventHandler: (data) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [data], false))
      },
    })

    useFocusEffect(
      useCallback(() => {
        async function loadEvents() {
          await questionStore.getQuestion(id)
          await questionStore.loadEvents(id)
          setMessages(questionStore.currentQuestionEvents)
        }

        loadEvents()
      }, []),
    )

    React.useLayoutEffect(() => {
      const question = questionStore.currentQuestion
      if (question?.consultant?.userId === getUserId()) {
        navigation.setOptions({
          headerRight: () => (
            <IconButton
              icon={({ size }) => (
                <Image style={{ width: size, height: size }} source={finishConsultationImage} />
              )}
              iconColor={MD3Colors.error50}
              size={32}
              style={{ width: 32, height: 32 }}
              onPress={() => openBottomSheet()}
            />
          ),
        })
      }
    }, [navigation])

    const onSend = useCallback((messages: IMessage[]) => {
      const question = questionStore.currentQuestion
      const event: CreateQuestionEventMessageSentRequest = {
        $type: CreateQuestionEventMessageSentRequestType.MessageSent,
        content: messages[0].text,
        metadata: {
          notifiedUserId: question?.permissions?.directChatTargetUserId,
        },
      }

      // todo: handle case that could not delivery message. such as exception 500.
      createQuestionEvent(id, event)

      // todo: set default status is sending. Then update status after receive
      setMessages((previousMessages) => GiftedChat.append(previousMessages, messages, false))
    }, [])

    const getUserId = () => metadataStore.userId ?? ""

    return (
      <>
        <Screen style={$root} safeAreaEdges={["bottom"]}>
          <View style={styles.questionListArea}>
            <QuestionDetailSection question={questionStore.currentQuestion}></QuestionDetailSection>
            <GiftedChat
              isCustomViewBottom={true}
              inverted={false}
              messages={messages}
              onSend={(messages) => onSend(messages)}
              user={{
                _id: getUserId(),
              }}
            />
          </View>
        </Screen>
        <BottomSheetBase
          bottomInset={insets.bottom}
          ref={bottomSheetRef}
          index={-1}
          snapPoints={["100%"]}
          keyboardBehavior="fillParent"
          style={{ borderColor: colors.borderLight, border }}
        >
          <View style={styles.bottomSheetContainer}>
            {openCategorySelection && (
              <ConclusionEditorSection questionId={id} onClose={closeBottomSheet} />
            )}
          </View>
        </BottomSheetBase>
      </>
    )
  },
)

const QuestionDetailSection = ({ question }: { question: Question | null }) => {
  const { metadataStore } = useStores()

  return (
    question && (
      <View style={styles.questionDetails}>
        <Text variant="titleMedium">Câu hỏi: {question.title}</Text>
        <Text>
          Người dùng: {metadataStore.email} (
          {question.consultant?.userId === metadataStore.userId ? "Consultant" : "Requester"})
        </Text>
      </View>
    )
  )
}

const ConclusionEditorSection = ({
  questionId,
  onClose,
}: {
  questionId: string
  onClose: (cancelled: boolean) => void
}) => {
  const form = useForm<ConclusionFormModel>({
    resolver: zodResolver(ConclusionFormSchema),
    defaultValues: {
      conclusion: "",
    },
  })

  const submitConclusion = async (form: ConclusionFormModel) => {
    const response = await resolveConsultation(questionId, { conclusion: form.conclusion })
    if (response.ok) {
      setTimeout(() => onClose(true), 100)
    } else {
      Alert.alert("Có lỗi không thể submit")
    }
  }

  const onError = (error: any) => {
    console.log(error)
  }

  return (
    <>
      <View style={bottomSheetStyles.title}>
        <Text variant="titleMedium">Gửi câu trả lời cuối cùng</Text>
        <IconButton icon="close" size={20} onPress={() => onClose(false)} />
      </View>
      <FormProvider {...form}>
        <View style={bottomSheetStyles.contentContainer}>
          <Controller
            control={form.control}
            name="conclusion"
            render={({ field: { value, onBlur, onChange } }) => (
              <>
                <TextInput
                  style={bottomSheetStyles.textInput}
                  mode={"outlined"}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={form.formState.errors.conclusion && true}
                  label={"Nội dung câu trả lời"}
                  placeholder={translate("newQuestionScreen.answerGuideline")}
                  multiline={true}
                />
                <HelperText type="error">{form.formState.errors.conclusion?.message}</HelperText>
              </>
            )}
          />
          <View>
            <SectionLabel title="Đối với quyền riêng tư" />
            <Controller
              control={form.control}
              name="communityShareAgreement"
              render={({ field: { value, onChange } }) => (
                <Checkbox.Item
                  position="leading"
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  mode="android"
                  labelVariant="labelSmall"
                  label="Cho phép đăng tải câu hỏi lên cộng đồng"
                />
              )}
            ></Controller>
          </View>
        </View>
        <View>
          <Button mode="contained" onPress={form.handleSubmit(submitConclusion, onError)}>
            Xác nhận câu trả lời
          </Button>
        </View>
      </FormProvider>
    </>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    alignItems: "center",
    flex: 1,
    padding: spacing.md,
    paddingTop: 0,
  },
  questionDetails: {
    padding: spacing.md,
  },
  questionListArea: {
    flex: 1,
    height: "100%",
    minHeight: "100%",
  },
})

const bottomSheetStyles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  textInput: {
    flex: 1,
    width: "100%",
  },
  title: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
})
