import { FC } from "react"
import { observer } from "mobx-react-lite"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { QuestionBrief } from "app/services/ask-api/models"
import { QuestionsScreen } from "../UIBlocks/QuestionsScreen"
import { buildBlocks } from "./Blocks"

interface MyQuestionsScreenProps extends AppStackScreenProps<"MyQuestions"> {}

export const MyQuestionsScreen: FC<MyQuestionsScreenProps> = observer(() => {
  const { navigate } = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  return QuestionsScreen({
    loadQuestionsMethod: "getMyQuestions",
    loadQuestionsProperty: "myQuestions",
    buildBlocks: (data: QuestionBrief[]) => buildBlocks(data),
    onPressQuestion: (id: string) => navigate("QuestionDetail", { id }),
    enableOnEndReached: true,
  })
})
