import { FC } from "react"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import { QuestionsScreen } from "../UIBlocks/QuestionsScreen"
import { buildBlocks } from "./Blocks"

interface RecentQuestionsScreenProps extends AppStackScreenProps<"RecentQuestions"> {}

export const RecentQuestionsScreen: FC<RecentQuestionsScreenProps> = observer(() =>
  QuestionsScreen({
    loadQuestionsMethod: "getRecentQuestions",
    loadQuestionsProperty: "recentQuestions",
    buildBlocks: (data: any) => buildBlocks(data),
    enableOnEndReached: true,
  }),
)
