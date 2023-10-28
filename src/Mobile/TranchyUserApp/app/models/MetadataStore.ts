import { Instance, SnapshotIn, SnapshotOut, types, getSnapshot } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { QuestionCategoryModel, QuestionCategorySnapshotIn } from "./QuestionCategory"
import { load, save } from "app/utils/storage"
import { QuestionPriorityModel, QuestionPrioritySnapshotIn } from "./QuestionPriority"

/**
 * Model description here for TypeScript hints.
 */
export const MetadataStoreModel = types
  .model("MetadataStore")
  .props({
    QuestionCategories: types.array(QuestionCategoryModel),
    QuestionPriorities: types.array(QuestionPriorityModel),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get questionCategories() {
      return self.QuestionCategories
    },
    get questionPriorities() {
      return self.QuestionPriorities
    },
    get questionCategoryIds() {
      return self.QuestionCategories.map<string>(function (v) {
        return v.key
      })
    },
    questionPriority(key: string) {
      return self.QuestionPriorities.find((p) => p.key === key)
    },
  }))
  .actions((self) => ({
    downloadMetadata(force?: boolean) {
      const persistedMetadata = load("metadata")
      if (force || persistedMetadata === null) {
        // todo: call api loading
        const questionCat: QuestionCategorySnapshotIn[] = [
          {
            key: "technology",
            name: {
              vi: "Công nghệ",
              en: "Technology",
            },
          },
          {
            key: "education",
            name: {
              vi: "Giáo dục",
              en: "Education",
            },
          },
          {
            key: "marketing",
            name: {
              vi: "Tiếp thị",
              en: "Marketing",
            },
          },
          {
            key: "commerce",
            name: {
              vi: "Kinh tế",
              en: "Commerce",
            },
          },
          {
            key: "law",
            name: {
              vi: "Luật",
              en: "Law",
            },
          },
        ]
        self.setProp("QuestionCategories", questionCat)

        // Question priorities
        const questionPriorities: QuestionPrioritySnapshotIn[] = [
          {
            key: "urgent",
            name: {
              vi: "Khẩn cấp",
              en: "Urgent",
            },
            description: {
              vi: "Tôi cần câu trả lời sớm nhất",
              en: "Tôi cần câu trả lời sớm nhất",
            },
          },
          {
            key: "day",
            name: {
              vi: "Trong ngày",
              en: "Day",
            },
            description: {
              vi: "Tôi cần câu trả lời trong 24 giờ",
              en: "Tôi cần câu trả lời trong 24 giờ",
            },
          },
          {
            key: "week",
            name: {
              vi: "Trong tuần",
              en: "Week",
            },
            description: {
              vi: "Tôi cần câu trả lời trong tuần",
              en: "Tôi cần câu trả lời trong tuần",
            },
          },
        ]

        self.setProp("QuestionPriorities", questionPriorities)

        const snapshot = getSnapshot(self)
        save("metadata", snapshot)
        console.log("Download metadata", snapshot)
      } else {
        const metadata = MetadataStoreModel.create(persistedMetadata)
        console.tron.log(metadata)
        self = metadata
        console.log("Set metadata", metadata)
      }
    },
  }))

export interface MetadataStore extends Instance<typeof MetadataStoreModel> {}
export interface MetadataStoreSnapshotOut extends SnapshotOut<typeof MetadataStoreModel> {}
export interface MetadataStoreSnapshotIn extends SnapshotIn<typeof MetadataStoreModel> {}
export const createMetadataStoreDefaultModel = () => types.optional(MetadataStoreModel, {})
