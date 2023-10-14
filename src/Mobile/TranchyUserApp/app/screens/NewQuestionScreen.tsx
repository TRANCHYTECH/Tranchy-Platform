import { Screen, SectionLabel } from "app/components"
import { translate } from "app/i18n"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import React, { FC, useCallback, useMemo, useRef, useState } from "react"
import { StyleSheet, View, ViewStyle } from "react-native"
import { Button, Chip, HelperText, SegmentedButtons, Text, TextInput } from "react-native-paper"
import BottomSheet from "@gorhom/bottom-sheet"
import { zodResolver } from "@hookform/resolvers/zod"
import { QuestionModel, SupportLevels } from "app/models"
import { colors, spacing } from "app/theme"
import { Controller, useForm } from "react-hook-form"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import z from "zod"

interface NewQuestionScreenProps extends AppStackScreenProps<"NewQuestion"> {}

const Categories = ["technology", "education", "marketing", "commerce", "law", "other"]

const NewQuestionSchema = z.object({
  content: z
    .string()
    .min(50, { message: translate("newQuestionScreen.error.questionTooShort", { min: 50 }) }),
  categories: z.array(z.string(), { required_error: "error.required" }).nonempty({
    message: translate("newQuestionScreen.error.noQuestionCategorySelected", { max: 3 }),
  }),
  supportLevel: z.enum(SupportLevels),
})

type QuestionModel = z.infer<typeof NewQuestionSchema>

const supportLevelOptions = [
  {
    value: SupportLevels[0],
    showSelectedCheck: true,
    label: translate("supportLevel.community"),
  },
  {
    value: SupportLevels[1],
    showSelectedCheck: true,
    label: translate("supportLevel.expert"),
  },
  {
    value: SupportLevels[2],
    showSelectedCheck: true,
    label: translate("supportLevel.agency"),
  },
]

const CategorySelections = ({
  input,
  onClose,
}: {
  input: string[]
  onClose: (output: string[]) => void
}) => {
  const [values, setValues] = useState<string[]>(input)

  console.log("Re render CategorySelections")
  return (
    <>
      <View style={{ ...styles.row, padding: spacing.md }}>
        {Categories.map((cat) => (
          <Chip
            mode={"outlined"}
            key={`cat-selection-${cat}`}
            style={styles.selectedChip}
            showSelectedCheck={true}
            selected={values.includes(cat)}
            onPress={() => {
              if (values.includes(cat)) {
                setValues(values.filter((v) => v !== cat))
              } else {
                setValues([...values, cat])
              }
            }}
          >
            {cat}
          </Chip>
        ))}
      </View>
      <Button mode="contained" onPress={() => onClose(values)}>
        Chọn xong
      </Button>
    </>
  )
}

export const NewQuestionScreen: FC<NewQuestionScreenProps> = observer(function NewQuestionScreen() {
  const insets = useSafeAreaInsets()

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionModel>({
    resolver: zodResolver(NewQuestionSchema),
    mode: "onBlur",
    defaultValues: {
      categories: [],
    },
  })

  // Subscribe form values.
  const supportLevel = watch("supportLevel")
  const categories = watch("categories")

  // Question category selection.
  const [openCategorySelection, setOpenCategorySelection] = useState(false)
  const bottomSheetRef = useRef<BottomSheet>(null)
  const openBottomSheet = () => {
    setOpenCategorySelection(true)
    bottomSheetRef.current.expand()
  }
  const closeBottomSheet = (values: string[]) => {
    setValue("categories", values as [string, ...string[]])
    setOpenCategorySelection(false)
    bottomSheetRef.current.close()
  }

  // Form submit
  const onSubmit = (data) => {
    console.log(data)
  }
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
        <View style={{ paddingTop: spacing.md }}>
          <Controller
            control={control}
            name="content"
            render={({ field: { value, onBlur, onChange } }) => (
              <>
                <TextInput
                  mode={"outlined"}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  error={errors.content && true}
                  label={translate("newQuestionScreen.questionContent")}
                  placeholder={translate("newQuestionScreen.askQuestionGuideline")}
                  multiline={true}
                />
                <HelperText type="error">{errors.content?.message}</HelperText>
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
              control={control}
              name="categories"
              render={({ field: { value, onChange } }) => (
                <>
                  {value.map((cat) => (
                    <Chip
                      mode={"outlined"}
                      icon="book-education"
                      key={cat}
                      onClose={() => {
                        onChange(value.filter((v) => v !== cat))
                      }}
                    >
                      {cat}
                    </Chip>
                  ))}
                  <Chip
                    mode="flat"
                    icon="plus-circle-outline"
                    key="new-cat"
                    onPress={openBottomSheet}
                  >
                    {value.length === 0 ? "Chọn chủ đề" : "Chủ đề khác"}
                  </Chip>
                  <HelperText type="error">{errors.categories?.message}</HelperText>
                </>
              )}
            />
          </View>
        </View>
        <View style={styles.column}>
          <SectionLabel title="Tôi muốn gửi câu hỏi đến" />
          <Controller
            control={control}
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
          {supportLevel === SupportLevels[0] && (
            <View>
              {Array.from({ length: 7 }, (value, index) => index).map((i) => (
                <Text key={"info-" + i}>
                  {i}. Câu hỏi sẽ được đăng tải lên cộng đồng và bạn sẽ không mất phí
                </Text>
              ))}
            </View>
          )}
          {supportLevel === SupportLevels[1] && (
            <View>
              <Text>Expert level</Text>
            </View>
          )}
          {supportLevel === SupportLevels[2] && (
            <View>
              <Text>Agency level</Text>
            </View>
          )}
        </View>
      </Screen>
      <View style={{ ...styles.bottomRow, marginBottom: insets.bottom }}>
        <Button mode={"contained"} loading={true} onPress={handleSubmit(onSubmit, onError)}>
          Gửi câu hỏi
        </Button>
      </View>
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={["25%", "50%"]}>
        <View style={styles.bottomSheetContainer}>
          {openCategorySelection && (
            <CategorySelections input={categories} onClose={closeBottomSheet} />
          )}
        </View>
      </BottomSheet>
    </>
  )
})

const styles = StyleSheet.create({
  row: {
    paddingTop: spacing.xxs,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  column: {
    paddingTop: spacing.xs,
    flexDirection: "column",
  },
  selectedChip: {
    borderColor: colors.palette.accent100,
    backgroundColor: colors.palette.accent100,
    color: colors.palette.accent100,
  },
  bottomSheetContainer: {
    flex: 1,
    alignItems: "center",
  },
  bottomRow: {
    padding: spacing.md,
  },
})

const $root: ViewStyle = {
  flex: 1,
}
