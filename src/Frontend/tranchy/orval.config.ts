import { defineConfig } from 'orval';

export default defineConfig({
  askapi: {
    output: {
      mode: 'single',
      target: 'apps/agencyportal/src/app/apis/askapi/askapi.service.ts',
      schemas: 'apps/agencyportal/src/app/apis/askapi/models',
      client: 'angular',
      prettier: false,
    },
    input: {
      target: 'https://askapi.vietgeeks.io/swagger/v1/swagger.json',
    },
  },
});
