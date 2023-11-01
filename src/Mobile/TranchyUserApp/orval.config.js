import { defineConfig } from "orval"

export default defineConfig({
  askapi: {
    output: {
      mode: "single",
      target: "app/services/askapi/askapi.ts",
      schemas: "app/services/askapi/models",
      prettier: true,
      override: {
        mutator: {
          path: "app/services/api/api.ts",
          name: "customInstance",
        },
      },
    },
    input: {
      target: "http://localhost:7200/swagger/v1/swagger.json",
    },
  },
})
