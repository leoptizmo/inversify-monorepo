import { defineConfig, defineWorkspace } from 'vitest/config';

const unitTestConfig = {
  test: {
    exclude: ['src/**/*.int.spec.ts'],
    include: ['src/**/*.spec.ts'],
    name: 'Unit',
  },
};

export const strykerWorkspaceConfig = defineWorkspace([
  unitTestConfig,
]);

export const workspaceConfig = defineWorkspace([
  unitTestConfig,
  {
    test: {
      include: ['src/**/*.int.spec.ts'],
      name: 'Integration',
    },
  },
]);

export const defaultConfig = defineConfig({
  test: {
    coverage: {
      all: false,
    },
    passWithNoTests: true,
    sequence: {
      hooks: 'parallel',
    },
  },
});
