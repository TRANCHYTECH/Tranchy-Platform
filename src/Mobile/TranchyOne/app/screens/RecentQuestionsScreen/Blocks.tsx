import { BlockItemType, QuestionItem } from "../UIBlocks/BlockItem"
import { getPosition } from "../UIBlocks/QuestionItem"
import { QuestionBrief } from "app/services/ask-api/models"

export const buildBlocks = (questions: QuestionBrief[]) => {
  const orderedList: BlockItemType[] = []

  if (questions.length > 0) {
    orderedList.push(
      ...questions.map<QuestionItem>(
        (question, index, source) => new QuestionItem(question, getPosition(index, source.length)),
      ),
    )
  }

  return orderedList
}
