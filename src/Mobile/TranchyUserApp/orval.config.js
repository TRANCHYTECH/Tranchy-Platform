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
      },
    },
    input: {
      target1: "https://askapi.vietgeeks.io/swagger/v1/swagger.json",
      target: "http://localhost:7200/swagger/v1/swagger.json",
    },
  },
})
