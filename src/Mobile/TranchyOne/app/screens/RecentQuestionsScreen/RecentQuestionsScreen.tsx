import { FC } from "react"
import { observer } from "mobx-react-lite"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { QuestionsScreen } from "../UIBlocks/QuestionsScreen"
import { buildBlocks } from "./Blocks"
import { QuestionBrief } from "app/services/ask-api/models"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface RecentQuestionsScreenProps extends AppStackScreenProps<"RecentQuestions"> {}

export const RecentQuestionsScreen: FC<RecentQuestionsScreenProps> = observer(() => {
  const { navigate } = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  return QuestionsScreen({
    loadForSection: "highlights",
    buildBlocks: (data: QuestionBrief[]) => buildBlocks(data),
    onPressQuestion: (id: string) => navigate("QuestionDetail", { id }),
    enableOnEndReached: true,
  })
})
