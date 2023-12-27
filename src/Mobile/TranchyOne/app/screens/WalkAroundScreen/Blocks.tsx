import { View } from "react-native"
import React from "react"
import { Text } from "app/components"
import { ExpertDealsItem, renderExpertDealsItem } from "./ExpertDealsItem"
import { BlockItemType, PopularCategoriesItem, QuestionItem } from "./BlockItem"
import { observer } from "mobx-react-lite"
import { renderQuestionItem } from "./QuestionItem"
import { SectionTitleItem, renderSectionTitleItem } from "./SectionTitleItem"
import { SeeMoreItem, renderSeeMoreItem } from "./SeeMoreItem"
import { QuestionSectionsItem, renderQuestionSectionsItem } from "./QuestionSectionsItem"
import { renderPopularCategoriesItem } from "./PopularCategoriesItem"

export const orderedList: BlockItemType[] = [
  new QuestionSectionsItem([
    { text: "Đang trả lời", icon: "comment-outline", route: "route1" },
    { text: "Chờ phản hồi", route: "route1" },
    { text: "Lịch sử câu hỏi", route: "route1" },
  ]),
  new SectionTitleItem({ title: "Nắm bắt cơ hội" }),
  new ExpertDealsItem([
    {
      title:
        "Quy trình áp dụng Design Thinking vào phát triển sản phẩm? Tôi đang tìm kiếm một vài ví dụ điển hình trên thị trường để c",
      categories: ["Giáo dục", "Kinh tế"],
      price: "$500,00",
    },
    {
      title:
        "Quy trình áp dụng Design Thinking vào phát triển sản phẩm? Tôi đang tìm kiếm một vài ví dụ điển hình trên thị trường để c",
      categories: ["Giáo dục", "Kinh tế"],
      price: "$500,00",
    },
    {
      title:
        "Quy trình áp dụng Design Thinking vào phát triển sản phẩm? Tôi đang tìm kiếm một vài ví dụ điển hình trên thị trường để c",
      categories: ["Giáo dục", "Kinh tế"],
      price: "$500,00",
    },
  ]),
  new SectionTitleItem({ title: "Mới đăng gần đây" }),
  new QuestionItem({
    title:
      "Thúc đẩy cộng tác luôn là hoạt động ưu tiên của hầu hết các nhà quản lý. Thực hiện thế nào để đội nhóm không...",
    categories: ["Giáo dục", "Kinh tế"],
    createdAt: new Date(),
    saved: true,
  }),
  new QuestionItem({
    title:
      "Thúc đẩy cộng tác luôn là hoạt động ưu tiên của hầu hết các nhà quản lý. Thực hiện thế nào để đội nhóm không",
    categories: ["Giáo dục", "Kinh tế"],
    createdAt: new Date(),
    saved: false,
  }),
  new SeeMoreItem({ route: "" }),
  new SectionTitleItem({ title: "Chủ đề nổi bật" }),
  new PopularCategoriesItem([
    { text: "Công nghệ", route: "" },
    { text: "Giáo dục", route: "" },
    { text: "Marketing", route: "" },
    { text: "Pháp luật", route: "" },
  ]),
  new SectionTitleItem({ title: "Phù hợp với bạn" }),
  new QuestionItem({
    title:
      "Thúc đẩy cộng tác luôn là hoạt động ưu tiên của hầu hết các nhà quản lý. Thực hiện thế nào để đội nhóm không...",
    categories: ["Giáo dục", "Kinh tế"],
    createdAt: new Date(),
    saved: true,
  }),
  new QuestionItem({
    title:
      "Thúc đẩy cộng tác luôn là hoạt động ưu tiên của hầu hết các nhà quản lý. Thực hiện thế nào để đội nhóm không...",
    categories: ["Giáo dục", "Kinh tế"],
    createdAt: new Date(),
    saved: true,
  }),
  new QuestionItem({
    title:
      "Thúc đẩy cộng tác luôn là hoạt động ưu tiên của hầu hết các nhà quản lý. Thực hiện thế nào để đội nhóm không...",
    categories: ["Giáo dục", "Kinh tế"],
    createdAt: new Date(),
    saved: true,
  }),
  new SeeMoreItem({ route: "" }),
]

const renderSectionSeparateItem = () => {
  return (
    <View>
      <Text></Text>
    </View>
  )
}

const renderLineSeparateItem = () => {
  return (
    <View>
      <Text>separate</Text>
    </View>
  )
}

export const BlockItem = observer(function BlockItem({ data }: { data: BlockItemType }) {
  switch (data.type) {
    case "QuestionSections": {
      return renderQuestionSectionsItem(data as QuestionSectionsItem)
    }
    case "SectionSeparate": {
      return renderSectionSeparateItem()
    }
    case "LineSeparate": {
      return renderLineSeparateItem()
    }
    case "SectionTitle": {
      return renderSectionTitleItem(data as SectionTitleItem)
    }
    case "ExpertDeals": {
      return renderExpertDealsItem(data as ExpertDealsItem)
    }
    case "QuestionItem": {
      return renderQuestionItem(data as QuestionItem)
    }
    case "SeeMore": {
      return renderSeeMoreItem(data as SeeMoreItem)
    }
    case "PopularCategories": {
      return renderPopularCategoriesItem(data as PopularCategoriesItem)
    }
    default:
      throw new Error("Not supported block type")
  }
})
