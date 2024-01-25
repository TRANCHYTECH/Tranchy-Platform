import { FC } from "react"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import { QuestionsScreen } from "../UIBlocks/QuestionsScreen"
import { buildBlocks } from "./Blocks"
import { QuestionBrief } from "app/services/ask-api/models"

interface RecentQuestionsScreenProps extends AppStackScreenProps<"RecentQuestions"> {}

export const RecentQuestionsScreen: FC<RecentQuestionsScreenProps> = observer(() =>
  QuestionsScreen({
    loadQuestionsMethod: "getRecentQuestions",
    loadQuestionsProperty: "recentQuestions",
    buildBlocks: (data: QuestionBrief[]) => buildBlocks(data),
    enableOnEndReached: true,
  }),
)
