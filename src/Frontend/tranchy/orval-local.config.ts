import { defineConfig } from 'orval';
import { OpenAPIObject } from 'openapi3-ts';

const askApiPrefixFn = (inputSchema: OpenAPIObject): OpenAPIObject => ({
  ...inputSchema,
  paths: Object.entries(inputSchema.paths).reduce(
    (acc, [path, pathItem]) => ({
      ...acc,
      [`ask:${path}`]: pathItem,
    }),
    {}
  ),
});

export default defineConfig({
  askapi: {
    output: {
      mode: 'single',
      target: 'apps/agencyportal/src/app/_state/askapi/askapi.service.ts',
      schemas: 'apps/agencyportal/src/app/_state/askapi/models',
      client: 'angular',
      prettier: true,
    },
    input: {
      target: 'swagger.json',
      override: {
        transformer: askApiPrefixFn,
      },
      filters: {
        tags: ["BackOffice"],
      },
    },
  },
});
