import { zodResolver } from "@hookform/resolvers/zod"
import { Screen, SectionLabel } from "app/components"
import { TxKeyPath, currentLocale, translate } from "app/i18n"
import { SupportLevels, useStores } from "app/models"
import { AppStackScreenProps } from "app/navigators"
import { createQuestion } from "app/services/ask-api/askApi"
import { colors, spacing } from "app/theme"
import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { Alert, ScrollView, StyleSheet, View, ViewStyle } from "react-native"
import {
  Button,
  Chip,
  HelperText,
  Modal,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AgencySupportLevel } from "./AgencySupportLevel"
import { CommunitySupportLevel } from "./CommunitySupportLevel"
import { ExpertSupportLevel } from "./ExpertSupportLevel"
import { QuestionFormModel, QuestionFormSchema } from "./QuestionFormSchema"
import { SupportLevel } from "app/services/ask-api/models"
import { uploadFile } from "app/services/api/fileApi"

interface NewQuestionScreenProps extends AppStackScreenProps<"AskQuestion"> {}

const supportLevelOptions = SupportLevels.map<{
  value: SupportLevel
  showSelectedCheck: boolean
  label: string
}>(function (v) {
  return {
    value: v,
    showSelectedCheck: true,
    label: translate(`supportLevel.${v}` as TxKeyPath),
  }
})

const CategorySelectionContent = ({
  input,
  onClose,
}: {
  input: string[]
  onClose: (cancelled: boolean, output: string[]) => void
}) => {
  const [values, setValues] = useState<string[]>(input)
  const { metadataStore } = useStores()
  return (
    <>
      <Text variant="titleMedium">Chọn chủ đề cho câu hỏi</Text>
      <View style={{ ...styles.row, padding: spacing.md }}>
        {metadataStore.questionCategories.map((cat) => (
          <Chip
            mode={"outlined"}
            key={`cat-selection-${cat.key}`}
            style={styles.selectedChip}
            showSelectedCheck={true}
            selected={values.includes(cat.key)}
            onPress={() => {
              if (values.includes(cat.key)) {
                setValues(values.filter((v) => v !== cat.key))
              } else {
                setValues([...values, cat.key])
              }
            }}
          >
            {cat.title[locale]}
          </Chip>
        ))}
      </View>
      <Button mode="contained" onPress={() => onClose(false, values)}>
        Lưu thay đổi
      </Button>
      <Button
        mode="contained"
        buttonColor={colors.background}
        textColor={colors.text}
        onPress={() => onClose(true, values)}
      >
        Huỷ
      </Button>
    </>
  )
}

const CategorySelectionDialog = ({
  visible,
  input,
  onClose,
}: {
  visible: boolean
  input: string[]
  onClose: (cancelled: boolean, output: string[]) => void
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        contentContainerStyle={{
          backgroundColor: colors.background,
          marginHorizontal: spacing.md,
          padding: spacing.md,
          gap: spacing.xs,
          borderRadius: spacing.md,
        }}
      >
        <CategorySelectionContent input={input} onClose={onClose} />
      </Modal>
    </Portal>
  )
}

const locale = currentLocale()

export const NewQuestionScreen: FC<NewQuestionScreenProps> = observer(function NewQuestionScreen(
  _props,
) {
  const insets = useSafeAreaInsets()
  const { navigation } = _props
  // const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { metadataStore, uiStore } = useStores()

  const form = useForm<QuestionFormModel>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      communityShareAgreement: false,
      questionCategoryIds: [],
      supportLevel: SupportLevel.Expert,
      priority: null,
      files: [],
    },
  })

  // Subscribe form values.
  const supportLevel = form.watch("supportLevel")
  const categories = form.watch("questionCategoryIds")
  // Question category selection.
  const [categorySelectionVisible, setCategorySelectionVisible] = React.useState(false)

  const categorySelectionCallback = (cancelled: boolean, values: string[]) => {
    if (!cancelled) {
      form.setValue("questionCategoryIds", values as [string, ...string[]], {
        shouldValidate: true,
      })
    }
    setCategorySelectionVisible(false)
  }

  const openCategorySelectionDialog = () => {
    setCategorySelectionVisible(true)
  }

  // Form submit
  const onSubmit = async (formModel: QuestionFormModel) => {
    try {
      uiStore.showBusyIndicator()

      // todo: rework on response process
      const createQuestionResponse = await createQuestion({
        title: formModel.title,
        questionCategoryIds: formModel.questionCategoryIds,
        supportLevel: formModel.supportLevel,
        priorityId: formModel.priority,
        priorityRank: formModel.priority
          ? metadataStore.questionPriority(formModel.priority)?.rank ?? 0
          : 0,
      })

      if (!createQuestionResponse.ok || createQuestionResponse.data === undefined) {
        Alert.alert("Lỗi", "Không thể tạo câu hỏi")
        return
      }

      for (const file of formModel.files) {
        const uploadResponse = await uploadFile({
          questionId: createQuestionResponse.data.id,
          fileName: file.name,
          fileUri: file.uri,
        })

        if (uploadResponse.kind !== "ok") {
          Alert.alert(`Không thể upload file ${file.name}`)
        }
      }

      Alert.alert("Câu hỏi đã được tạo thành công", "Hệ thống đang kiểm duyệt", [
        { text: "Hoàn tất", onPress: goToList },
      ])
    } finally {
      uiStore.hideBusyIndicator()
    }
  }

  const goToList = () => navigation.navigate("MainTab", { screen: "WalkAround" })
  const onError = (error: any) => {
    if (__DEV__) {
      console.tron.log(error)
    }
  }

  return (
    <Screen contentContainerStyle={$root} preset="fixed">
      <ScrollView style={{ flexGrow: 1, paddingLeft: spacing.md, paddingRight: spacing.md }}>
        <FormProvider {...form}>
          <View style={{ paddingTop: spacing.xs }}>
            <Controller
              control={form.control}
              name="title"
              render={({ field: { value, onBlur, onChange } }) => (
                <>
                  <TextInput
                    mode={"outlined"}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    error={form.formState.errors.title && true}
                    label={translate("newQuestionScreen.questionContent")}
                    placeholder={translate("newQuestionScreen.askQuestionGuideline")}
                    multiline={true}
                  />
                  <HelperText type="error">{form.formState.errors.title?.message}</HelperText>
                </>
              )}
            />
          </View>
          <View>
            <SectionLabel
              title="Chủ đề câu hỏi"
              description="Lựa chọn chủ đề phù hợp giúp câu hỏi được tiếp cận tốt hơn"
            />
            <View style={styles.row}>
              <Controller
                control={form.control}
                name="questionCategoryIds"
                render={({ field: { value, onChange } }) => (
                  <>
                    {value.map((cat) => (
                      <Chip
                        mode={"outlined"}
                        icon="book-education"
                        style={styles.chip}
                        textStyle={styles.chipText}
                        key={cat}
                        onClose={() => {
                          onChange(value.filter((v) => v !== cat))
                        }}
                      >
                        {metadataStore.questionCategory(cat)?.title[locale]}
                      </Chip>
                    ))}
                    <Chip
                      mode="flat"
                      icon="plus-circle-outline"
                      style={styles.chip}
                      textStyle={styles.chipText}
                      key="new-cat"
                      onPress={openCategorySelectionDialog}
                    >
                      {value.length === 0 ? "Chọn chủ đề" : "Chủ đề khác"}
                    </Chip>
                    <HelperText type="error">
                      {form.formState.errors.questionCategoryIds?.message}
                    </HelperText>
                  </>
                )}
              />
            </View>
          </View>
          <View style={styles.column}>
            <SectionLabel title="Tôi muốn gửi câu hỏi đến" />
            <Controller
              control={form.control}
              name="supportLevel"
              render={({ field: { value, onChange } }) => (
                <>
                  <SegmentedButtons
                    value={value}
                    onValueChange={onChange}
                    buttons={supportLevelOptions}
                  />
                </>
              )}
            />
            {supportLevel === "Community" && <CommunitySupportLevel />}
            {/* {supportLevel === "Coffee" && <CoffeeSupportLevel />} */}
            {supportLevel === "Expert" && <ExpertSupportLevel />}
            {supportLevel === "Agency" && <AgencySupportLevel />}
          </View>
        </FormProvider>
      </ScrollView>
      <View style={{ padding: spacing.xs, paddingLeft: spacing.md, paddingRight: spacing.md }}>
        <Button mode={"contained"} onPress={form.handleSubmit(onSubmit, onError)}>
          Gửi câu hỏi
        </Button>
      </View>
      <CategorySelectionDialog
        visible={categorySelectionVisible}
        input={categories}
        onClose={categorySelectionCallback}
      />
    </Screen>
  )
})

const styles = StyleSheet.create({
  chip: {
    borderColor: colors.surfaceOutline,
    borderRadius: spacing.md,
  },
  chipText: {
    fontSize: 14,
  },
  column: {
    flexDirection: "column",
    paddingTop: spacing.sm,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingTop: spacing.xxs,
  },
  selectedChip: {
    borderRadius: spacing.lg,
    color: "#CFDDFB",
  },
})

const $root: ViewStyle = {
  flex: 1,
}
