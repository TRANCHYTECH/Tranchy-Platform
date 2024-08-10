import { FC } from "react"
import { observer } from "mobx-react-lite"
import { AppStackParamList, MainTabScreenProps } from "app/navigators"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { QuestionBriefPaginationResponse } from "app/services/ask-api/models"
import { QuestionsScreen } from "../UIBlocks/QuestionsScreen"
import { buildBlocks } from "./Blocks"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface CommunityScreenProps extends MainTabScreenProps<"Community"> {}

export const CommunityScreen: FC<CommunityScreenProps> = observer(function CommunityScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const { navigate } = useNavigation<NativeStackNavigationProp<AppStackParamList>>()

  return QuestionsScreen({
    loadForSection: "community",
    buildBlocks: (data: QuestionBriefPaginationResponse) => buildBlocks(data.data),
    onPressQuestion: (id: string) => navigate("QuestionDetail", { id }),
    enableOnEndReached: true,
  })
})
