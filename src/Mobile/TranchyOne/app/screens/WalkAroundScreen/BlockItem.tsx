import { ExpertDealsItem } from "./ExpertDealsItem"
import { PopularCategoriesItem } from "./PopularCategoriesItem"
import { QuestionItem } from "./QuestionItem"
import { QuestionSectionsItem } from "./QuestionSectionsItem"
import { SectionTitleItem } from "./SectionTitleItem"
import { SeeMoreItem } from "./SeeMoreItem"

export interface BlockItemBase {
  readonly type: BlockType
}

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
  | SectionSeparateItem
  | SectionTitleItem
  | ExpertDealsItem
  | QuestionItem
  | LineSeparateItem
  | SeeMoreItem
  | PopularCategoriesItem
export { QuestionItem, PopularCategoriesItem }
