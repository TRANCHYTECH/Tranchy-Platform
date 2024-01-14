import { observer } from "mobx-react-lite"
import { ExpertDealsItem, renderExpertDealsItem } from "./ExpertDealsItem"
import { PopularCategoriesItem, renderPopularCategoriesItem } from "./PopularCategoriesItem"
import { QuestionItem, renderQuestionItem } from "./QuestionItem"
import { QuestionSectionsItem, renderQuestionSectionsItem } from "./QuestionSectionsItem"
import { SectionTitleItem, renderSectionTitleItem } from "./SectionTitleItem"
import { SeeMoreItem, renderSeeMoreItem } from "./SeeMoreItem"

export interface BlockItemBase {
  readonly type: BlockType
}

export type BlockItemPosition = "First" | "Middle" | "Last"

export type BlockType =
  | "QuestionSections"
  | "SectionSeparate"
  | "LineSeparate"
  | "SectionTitle"
  | "ExpertDeals"
  | "QuestionItem"
  | "SeeMore"
  | "PopularCategories"

export type SupportLevel = BlockType[number]

export class SectionSeparateItem implements BlockItemBase {
  type: BlockType = "SectionSeparate"
}

export class LineSeparateItem implements BlockItemBase {
  type: BlockType = "LineSeparate"
}

export type BlockItemType =
  | QuestionSectionsItem
  | SectionTitleItem
  | ExpertDealsItem
  | QuestionItem
  | SeeMoreItem
  | PopularCategoriesItem
export { QuestionItem, PopularCategoriesItem }

export const BlockItem = observer(function BlockItem({ data }: { data: BlockItemType }) {
  switch (data.type) {
    case "QuestionSections": {
      return renderQuestionSectionsItem(data as QuestionSectionsItem)
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
