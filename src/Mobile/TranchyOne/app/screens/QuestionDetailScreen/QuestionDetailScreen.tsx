import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, ScrollView, TextStyle } from "react-native"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { Button, Text } from "react-native-paper"
import { spacing } from "app/theme"
import { $rightTextGrow, $row } from "app/theme/styles"

import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
// import { useStores } from "app/models"

interface QuestionDetailScreenProps extends AppStackScreenProps<"QuestionDetail"> {}

export const QuestionDetailScreen: FC<QuestionDetailScreenProps> = observer(
  function QuestionDetailScreen({ route }) {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    const { id } = route.params
    const { navigate } =
      useNavigation<NativeStackNavigationProp<AppStackParamList, "QuestionDetail">>()

    useFocusEffect(
      useCallback(() => {
        setQuestion(questionStore.getQuestion(id))
      }, []),
    )
    return (
      <Screen contentContainerStyle={$root} preset="fixed">
        <ScrollView style={$questionContainer}>
          <View style={$contentBlock}>
            <Text variant="titleMedium">Nội dung câu hỏi</Text>
            <View style={$priorityBlock}>
              <Text>Cần gấp trong</Text>
              <Text>2 giờ</Text>
              <Text style={$rightTextGrow}>Còn lại 19 phút</Text>
            </View>
            <View style={$categoryBlock}>
              <Text>#Tag1</Text>
              <Text>#Tag2</Text>
              <Text>#Tag3</Text>
            </View>
            <Text>
              Quy trình áp dụng Design Thinking vào phát triển sản phẩm? Tôi đang tìm kiếm một vài
              ví dụ điển hình trên thị trường để có thể áp dụng vào đội ngũ mà tôi đang vận hành Quy
              trình áp dụng Design Thinking vào phát triển sản phẩm? Tôi đang tìm kiếm một vài ví dụ
              điển hình trên thị trường để có thể áp dụng vào đội ngũ mà tôi đang vận hành Quy trình
              áp dụng Design Thinking vào phát triển sản phẩm? Tôi đang tìm kiếm một vài ví dụ điển
              hình trên thị trường để có thể áp dụng vào đội ngũ mà tôi đang vận hành Quy trình áp
              dụng Design Thinking vào phát triển sản phẩm? Tôi đang tìm kiếm một vài ví dụ điển
              hình trên thị trường để có thể áp dụng vào đội ngũ mà tôi đang vận hành Quy trình áp
              dụng Design Thinking vào phát triển sản phẩm? Tôi đang tìm kiếm một vài ví dụ điển
              hình trên thị trường để có thể áp dụng vào đội ngũ mà tôi đang vận hành
            </Text>
          </View>
          <Text variant="titleMedium">Tập đính kèm</Text>
          <View>
            <Text>file 1</Text>
            <Text>file 2</Text>
          </View>
          <View style={$metadataBlock}>
            <Text variant="titleMedium">Chi tiết</Text>
            <View style={$row}>
              <Text style={$metadataLeft}>Đăng lúc</Text>
              <Text>17/11/2023 19:24</Text>
            </View>
            <View style={$row}>
              <Text style={$metadataLeft}>Giới hạn vào</Text>
              <Text>Còn 3 ngày</Text>
            </View>
            <View style={$row}>
              <Text style={$metadataLeft}>Phần thưởng</Text>
              <Text>Bí mật</Text>
            </View>
          </View>
          <View>
            <Text variant="titleMedium">Thông tin quyền riêng tư</Text>
            <Text>
              Người gửi câu hỏi này không cho phép chia sẻ thông tin trao đổi lên Cộng đồng
            </Text>
          </View>
        </ScrollView>
        <View style={$submitSection}>
          <Button mode="contained">Tôi muốn trao đổi với người hỏi</Button>
        </View>
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
}

const $categoryBlock: ViewStyle = {
  flexDirection: "row",
  flex: 1,
}

const $metadataLeft: TextStyle = {
  width: 130,
}

const $metadataBlock: ViewStyle = {
  paddingHorizontal: spacing.md,
}

const $submitSection: ViewStyle = {
  padding: spacing.xs,
}
