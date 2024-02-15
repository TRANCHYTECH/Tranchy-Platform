import { View, StyleSheet, FlatList } from "react-native"
import React from "react"
import { Avatar, Button, Card, Checkbox, Chip, IconButton, Text } from "react-native-paper"
import { SectionLabel } from "app/components"
import { colors, spacing } from "app/theme"
import * as DocumentPicker from "expo-document-picker"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { QuestionFormModel } from "./QuestionFormSchema"
import { useStores } from "app/models"
import { currentLocale } from "app/i18n"

const locale = currentLocale()

const ExpertSupportLevel = () => {
  const { metadataStore } = useStores()
  const { control } = useFormContext<QuestionFormModel>()
  const { fields, append, remove } = useFieldArray({ control, name: "files" })
  const handleDocumentSelection = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: false,
    })
    if (!result.canceled) {
      // todo: handle duplicated files
      // todo: handle deleting files
      // todo: style for document picker btn in case there are any files
      result.assets.forEach((result) => {
        if (__DEV__) {
          console.tron.debug("selected uri: " + result.uri)
        }
        append({ name: result.name, uri: result.uri, size: result.size ?? 0 })
      })
    }
  }

  return (
    <>
      <View style={{ padding: spacing.xs }}>
        <Text variant="labelSmall" style={{ color: colors.surfaceOutline }}>
          Câu hỏi sẽ trả lời bởi chuyên gia.
        </Text>
      </View>
      <View>
        <SectionLabel title="Tôi đang cần câu câu trả lời" />
        <View style={styles.row}>
          <Controller
            control={control}
            name="priority"
            render={({ field: { value, onChange } }) => (
              <>
                <View style={styles.row}>
                  {metadataStore.questionPriorities?.map((p) => (
                    <Chip
                      key={p.key}
                      mode="outlined"
                      style={styles.chip}
                      selected={p.key === value}
                      onPress={(_) => onChange(p.key)}
                      showSelectedCheck={true}
                    >
                      {p.title && p.title[locale]}
                    </Chip>
                  ))}
                </View>
                <Text
                  variant="labelSmall"
                  style={{ color: colors.surfaceOutline, paddingBottom: spacing.xxs }}
                >
                  {value && metadataStore.questionPriority(value)?.description[locale]}
                </Text>
              </>
            )}
          />
        </View>
      </View>
      <View>
        <SectionLabel
          title="Tệp tin đính kèm"
          description="Hỗ trợ hình ảnh, video, đoạn ghi âm, tệp tin"
        />
        <Button mode="text" icon="plus" onPress={handleDocumentSelection}>
          Nhấn để thêm tệp đính kèm
        </Button>
        <FlatList
          horizontal={true}
          data={fields}
          renderItem={({ item, index }) => (
            <Card.Title
              style={{
                backgroundColor: colors.palette.neutral100,
                margin: spacing.xxs,
                borderRadius: spacing.xxs,
              }}
              subtitle={`${Math.round(item.size / 1024)} KB`}
              title={item.name}
              key={"file-item-" + index}
              left={(props) => <Avatar.Icon {...props} icon="paperclip" />}
              right={(props) => (
                <IconButton {...props} icon="delete-outline" onPress={() => remove(index)} />
              )}
            />
          )}
        />
      </View>
      <View>
        <SectionLabel title="Đối với quyền riêng tư" />
        <Controller
          control={control}
          name="communityShareAgreement"
          render={({ field: { value, onChange } }) => (
            <Checkbox.Item
              position="leading"
              status={value ? "checked" : "unchecked"}
              onPress={() => onChange(!value)}
              mode="android"
              labelVariant="labelSmall"
              labelStyle={{ textAlign: "left" }}
              label="Cho phép đăng tải câu hỏi lên cộng đồng khi nhận được sự đồng ý từ chuyên gia trả lời."
            />
          )}
        ></Controller>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: spacing.md,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingTop: spacing.xxs,
  },
})

export { ExpertSupportLevel }
