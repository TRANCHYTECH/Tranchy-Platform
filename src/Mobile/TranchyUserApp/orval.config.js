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
      },
    },
    input: {
      target: "https://askapi.tranchy.tech/swagger/v1/swagger.json",
      target_: "http://localhost:7200/swagger/v1/swagger.json",
    },
  },
})
