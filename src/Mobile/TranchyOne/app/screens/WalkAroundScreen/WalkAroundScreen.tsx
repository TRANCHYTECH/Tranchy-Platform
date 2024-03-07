import { FC } from "react"
import { observer } from "mobx-react-lite"
import { AppStackParamList, MainTabScreenProps } from "app/navigators"
import { QuestionsScreen } from "../UIBlocks/QuestionsScreen"
import { buildBlocks } from "./Blocks"
import { GetUserHighlightsResponse } from "app/services/ask-api/models"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

interface WalkAroundScreenProps extends MainTabScreenProps<"WalkAround"> {}

export const WalkAroundScreen: FC<WalkAroundScreenProps> = observer(() => {
  const { navigate } = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  return QuestionsScreen({
    loadForSection: "highlights",
    buildBlocks: (data: GetUserHighlightsResponse) => buildBlocks(data),
    onPressQuestion: (id: string) => navigate("QuestionDetail", { id }),
    enableOnEndReached: false,
  })
})
