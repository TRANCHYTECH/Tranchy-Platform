import { FC } from "react"
import { observer } from "mobx-react-lite"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { QuestionsScreen } from "../UIBlocks/QuestionsScreen"
import { QuestionBriefPaginationResponse } from "app/services/ask-api/models"
import { buildBlocks } from "./Blocks"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface MyConsultationsScreenProps extends AppStackScreenProps<"MyConsultations"> {}

export const MyConsultationsScreen: FC<MyConsultationsScreenProps> = observer(() => {
  const { navigate } = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  return QuestionsScreen({
    loadForSection: "consultations",
    buildBlocks: (data: QuestionBriefPaginationResponse) => buildBlocks(data.data),
    onPressQuestion: (id: string) => navigate("QuestionConversation", { id }),
    enableOnEndReached: true,
  })
})
