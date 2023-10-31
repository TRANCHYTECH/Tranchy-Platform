import { zodResolver } from "@hookform/resolvers/zod"
import { BottomSheet, BottomSheetBase, Screen, SectionLabel } from "app/components"
import { TxKeyPath, currentLocale, translate } from "app/i18n"
import { SupportLevel, SupportLevels, useStores } from "app/models"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing } from "app/theme"
import { observer } from "mobx-react-lite"
import React, { FC, useRef, useState } from "react"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { Alert, StyleSheet, View, ViewStyle } from "react-native"
import { Button, Chip, HelperText, SegmentedButtons, TextInput } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { AgencySupportLevel } from "./AgencySupportLevel"
import { CommunitySupportLevel } from "./CommunitySupportLevel"
import { ExpertSupportLevel } from "./ExpertSupportLevel"
import { QuestionFormModel, QuestionFormSchema } from "./QuestionFormSchema"
import { api } from "app/services/api"
import Toast from "react-native-root-toast"
import { CoffeeSupportLevel } from "./CoffeeSupportLevel"

interface NewQuestionScreenProps extends AppStackScreenProps<"NewQuestion"> {}

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

// todo: apply observer
const CategorySelections = ({
  input,
  onClose,
}: {
  input: string[]
  onClose: (cancelled: boolean, output: string[]) => void
}) => {
  const [values, setValues] = useState<string[]>(input)
  const { metadataStore } = useStores()

  console.log("Re render CategorySelections")
  return (
    <>
      <View style={{ ...styles.row, padding: spacing.md }}>
        {metadataStore.questionCategories.map((cat) => (
          <Chip
            mode={"outlined"}
            key={`cat-selection-${cat}`}
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
            {cat.name[locale]}
          </Chip>
        ))}
      </View>
      <View style={styles.row}>
        <Button mode="outlined" onPress={() => onClose(true, values)}>
          Huỷ
        </Button>
        <Button mode="contained" onPress={() => onClose(false, values)}>
          Lưu thay đổi
        </Button>
      </View>
    </>
  )
}

// todo: use memo if move inside
const locale = currentLocale()

export const NewQuestionScreen: FC<NewQuestionScreenProps> = observer(function NewQuestionScreen(
  _props,
) {
  const insets = useSafeAreaInsets()
  const { navigation } = _props
  // const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const { metadataStore } = useStores()
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<QuestionFormModel>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      title: "",
      communityShareAgreement: false,
      questionCategoryIds: [],
      files: [],
    },
  })

  // Subscribe form values.
  const supportLevel = form.watch("supportLevel")
  const categories = form.watch("questionCategoryIds")

  console.log("form error", form.formState.errors)

  // Question category selection.
  const [openCategorySelection, setOpenCategorySelection] = useState(false)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const openBottomSheet = () => {
    setOpenCategorySelection(true)
    bottomSheetRef.current.expand()
  }
  const closeBottomSheet = (cancelled: boolean, values: string[]) => {
    if (!cancelled) {
      form.setValue("questionCategoryIds", values as [string, ...string[]], {
        shouldValidate: true,
      })
    }
    setOpenCategorySelection(false)
    bottomSheetRef.current.close()
  }

  // Form submit
  const onSubmit = async (data: QuestionFormModel) => {
    if (isProcessing) {
      return
    }

    setIsProcessing(true)
    const createQuestionResponse = await api.addQuestion({
      title: data.title,
      description: data.title,
      questionCategoryIds: data.questionCategoryIds,
      supportLevel: data.supportLevel,
      priorityId: data.priority,
      communityShareAgreement: data.communityShareAgreement,
      id: "",
    })

    let createdQuestionId: string
    if (createQuestionResponse.kind === "ok") {
      createdQuestionId = createQuestionResponse.data.id
    } else {
      Toast.show("Không thể gửi câu hỏi " + JSON.stringify(createQuestionResponse))
      setIsProcessing(false)
      return
    }

    for (const file of data.files) {
      console.log("upload file", file)
      const uploadResponse = await api.uploadFile(createdQuestionId, file.name, file.uri)
      if (uploadResponse.kind === "ok") {
        //Toast.show(`Upload file ${file.name} thành công`)
      } else {
        Toast.show(`Không thể upload file ${file.name}`)
      }
    }

    setIsProcessing(false)

    Alert.alert("Câu hỏi đã được tạo thành công", "Hệ thống đang kiểm duyệt", [
      { text: "Hoàn tất", onPress: goToList },
    ])
  }

  const goToList = () => navigation.navigate("MyTabs", { screen: "CommunityQuestionList" })
  const onError = (error) => {
    console.log(error)
  }

  return (
    <>
      <Screen
        style={$root}
        contentContainerStyle={{
          paddingLeft: spacing.md,
          paddingRight: spacing.md,
        }}
        preset="scroll"
      >
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
                        key={cat}
                        onClose={() => {
                          onChange(value.filter((v) => v !== cat))
                        }}
                      >
                        {metadataStore.questionCategories.find((c) => c.key === cat).name[locale]}
                      </Chip>
                    ))}
                    <Chip
                      mode="flat"
                      icon="plus-circle-outline"
                      style={styles.chip}
                      key="new-cat"
                      onPress={openBottomSheet}
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
            {supportLevel === "community" && <CommunitySupportLevel />}
            {supportLevel === "coffee" && <CoffeeSupportLevel />}
            {supportLevel === "expert" && <ExpertSupportLevel />}
            {supportLevel === "agency" && <AgencySupportLevel />}
          </View>
        </FormProvider>
      </Screen>
      <View style={{ ...styles.bottomRow, marginBottom: insets.bottom }}>
        <Button
          mode={"contained"}
          loading={isProcessing}
          // disabled={!form.formState.isValid}
          onPress={form.handleSubmit(onSubmit, onError)}
        >
          Gửi câu hỏi
        </Button>
      </View>
      <BottomSheetBase ref={bottomSheetRef} index={-1} snapPoints={["25%", "50%"]}>
        <View style={styles.bottomSheetContainer}>
          {openCategorySelection && (
            <CategorySelections input={categories} onClose={closeBottomSheet} />
          )}
        </View>
      </BottomSheetBase>
    </>
  )
})

const styles = StyleSheet.create({
  bottomRow: {
    padding: spacing.md,
  },
  bottomSheetContainer: {
    alignItems: "center",
    flex: 1,
  },
  chip: {
    borderRadius: spacing.md,
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
    backgroundColor: colors.palette.accent100,
    borderColor: colors.palette.accent100,
    borderRadius: spacing.lg,
    color: colors.palette.accent100,
  },
})

const $root: ViewStyle = {
  flex: 1,
}
