import { View, StyleSheet, Alert, FlatList } from "react-native"
import React from "react"
import { Avatar, Button, Card, Chip, IconButton } from "react-native-paper"
import { SectionLabel } from "app/components"
import { colors, spacing } from "app/theme"
import * as DocumentPicker from "expo-document-picker"
import { useFieldArray, useFormContext } from "react-hook-form"
import { QuestionFormModel } from "./QuestionFormSchema"

const ExpertSupportLevel = () => {
  const { control } = useFormContext<QuestionFormModel>()
  const { fields, append, remove } = useFieldArray({ control, name: "files" })
  const handleDocumentSelection = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: false,
      multiple: true,
    })
    if (result.type === "success") {
      // todo: handle duplicated files
      // todo: handle deleting files
      // todo: style for document picker btn in case there are any files
      append({ name: result.name, uri: result.uri, size: result.size })
      console.log("load success", result)
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2))
      }, 100)
    }
  }

  return (
    <>
      <View>
        <SectionLabel title="Tôi đang cần câu câu trả lời" />
        <View style={styles.row}>
          <Chip mode="outlined">Khẩn cấp</Chip>
          <Chip mode="outlined" selected={true}>
            Trong ngày
          </Chip>
          <Chip mode="outlined">Trong tuần</Chip>
        </View>
      </View>
      <View>
        <SectionLabel
          title="Tệp tin đính kèm"
          description="Hỗ trợ hình ảnh, video, đoạn ghi âm, tệp tin,..."
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
    </>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingTop: spacing.xxs,
  },
})

export { ExpertSupportLevel }
