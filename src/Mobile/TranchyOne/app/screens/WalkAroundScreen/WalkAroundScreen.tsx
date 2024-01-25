import { FC } from "react"
import { observer } from "mobx-react-lite"
import { MainTabScreenProps } from "app/navigators"
import { QuestionsScreen } from "../UIBlocks/QuestionsScreen"
import { buildBlocks } from "./Blocks"
import { GetUserHighlightsResponse } from "app/services/ask-api/models"

interface WalkAroundScreenProps extends MainTabScreenProps<"WalkAround"> {}

export const WalkAroundScreen: FC<WalkAroundScreenProps> = observer(() =>
  QuestionsScreen({
    loadQuestionsMethod: "getUserHighlights",
    loadQuestionsProperty: "userHighlights",
    buildBlocks: (data: GetUserHighlightsResponse) => buildBlocks(data),
    enableOnEndReached: false,
  }),
)
