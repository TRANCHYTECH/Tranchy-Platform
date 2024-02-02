import { ExpertDealsItem } from "../UIBlocks/ExpertDealsItem"
import { BlockItemType, PopularCategoriesItem, QuestionItem } from "../UIBlocks/BlockItem"
import { getPosition } from "../UIBlocks/QuestionItem"
import { SectionTitleItem } from "../UIBlocks/SectionTitleItem"
import { SeeMoreItem } from "../UIBlocks/SeeMoreItem"
import { QuestionSectionsItem } from "../UIBlocks/QuestionSectionsItem"
import { arrayOrEmptyArray } from "app/utils/methodHelper"
import { GetUserHighlightsResponse } from "app/services/ask-api/models"

export const buildBlocks = (highlights?: GetUserHighlightsResponse) => {
  if (__DEV__) {
    console.tron.log("Build blocks of walk around")
  }
  const orderedList: BlockItemType[] = []
  orderedList.push(
    new QuestionSectionsItem([
      { text: "Đang trả lời", icon: "comment-outline", route: "MyConsultations" },
      { text: "Chờ phản hồi", route: "route1" },
      { text: "Lịch sử câu hỏi", route: "MyQuestions" },
    ]),
  )

  const expertExclusiveData = arrayOrEmptyArray(highlights?.expertExclusive.data)
  if (expertExclusiveData.length > 0) {
    orderedList.push(new SectionTitleItem({ title: "Nắm bắt cơ hội" }))
    orderedList.push(new ExpertDealsItem(expertExclusiveData))
  }

  const recentData = arrayOrEmptyArray(highlights?.recent.data)
  if (recentData.length > 0) {
    orderedList.push(new SectionTitleItem({ title: "Mới đăng gần đây" }))
    orderedList.push(
      ...recentData.map<QuestionItem>(
        (question, index, source) => new QuestionItem(question, getPosition(index, source.length)),
      ),
    )
    orderedList.push(new SeeMoreItem({ route: "RecentQuestions" }))
  }

  const popularCategoriesData = arrayOrEmptyArray(highlights?.popularCategories.data)
  if (popularCategoriesData.length > 0) {
    orderedList.push(new SectionTitleItem({ title: "Chủ đề nổi bật", route: "todo" }))
    orderedList.push(new PopularCategoriesItem(popularCategoriesData))
  }

  const matchProfileData = arrayOrEmptyArray(highlights?.matchProfile.data)
  if (matchProfileData.length > 0) {
    orderedList.push(new SectionTitleItem({ title: "Phù hợp với bạn" }))
    orderedList.push(
      ...matchProfileData.map<QuestionItem>(
        (question, index, source) => new QuestionItem(question, getPosition(index, source.length)),
      ),
    )
    orderedList.push(new SeeMoreItem({ route: "questions" }))
  }

  return orderedList
}
