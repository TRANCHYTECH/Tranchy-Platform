const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
  },
  error: {
    questionTooShort:
      "Câu hỏi quá ngắn, tối thiểu {{min}}. Anh có thể diễn giải thêm vấn đề của mình nhé",
    noQuestionCategorySelected: "Anh có thể chọn tối đa {{max}} chủ đề",
  },
  supportLevel: {
    Community: "Cộng đồng",
    Coffee: "Cafe",
    Expert: "Chuyên gia",
    Agency: "Doanh nghiệp",
  },
  tab: {
    community: "Cộng đồng",
    newQuestion: "Đặt câu hỏi",
    questions: "Câu hỏi",
  },
  newQuestionScreen: {
    questionContent: "Nội dung câu hỏi",
    askQuestionGuideline:
      "Để đặt 1 câu hỏi hiệu quả, bạn nên tham khảo hướng dẫn về cách đặt vấn đề\r\nBước 1: Xác định vấn đề. \r\nBước 2: Nếu câu hỏi nhạy cảm, bạn nên tuân thủ theo hướng dẫn tại đây.\r\nBước 3: Bạn mong muốn câu trả lời.",
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
}

export default en
export type Translations = typeof en
