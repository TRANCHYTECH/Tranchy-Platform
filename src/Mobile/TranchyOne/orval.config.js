import { defineConfig } from "orval"

export default defineConfig({
  AskApi: {
    output: {
      mode: "single",
      target: "app/services/ask-api/askApi.ts",
      schemas: "app/services/ask-api/models",
      prettier: true,
      clean: true,
      override: {
        mutator: {
          path: "app/services/api/api.ts",
          name: "apiRequest",
        },
        useDates: true,
        useNativeEnums: true,
      },
    },
    input: {
      target_: "https://askapi.tranchy.tech/swagger/v1/swagger.json",
      target: "http://localhost:7300/swagger/v1/swagger.json",
      filters: {
        tags: ["Mobile"],
      },
    },
  },
})
