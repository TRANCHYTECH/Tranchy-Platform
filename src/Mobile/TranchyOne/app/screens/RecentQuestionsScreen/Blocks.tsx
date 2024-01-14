import { BlockItemType, QuestionItem } from "../UIBlocks/BlockItem"
import { getPosition } from "../UIBlocks/QuestionItem"
import { QuestionBrief } from "app/services/ask-api/models"

export const buildBlocks = (questions: QuestionBrief[]) => {
  const orderedList: BlockItemType[] = []

  if (questions.length > 0) {
    orderedList.push(
      ...questions.map<QuestionItem>(
        (q, i, source) => new QuestionItem(q, getPosition(i, source.length)),
      ),
    )
  }

  return orderedList
}
