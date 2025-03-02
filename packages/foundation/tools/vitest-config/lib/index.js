import { defineConfig, defineWorkspace } from 'vitest/config';

export const workspaceConfig = defineWorkspace([
  {
    test: {
      exclude: ['src/**/*.int.spec.ts'],
      include: ['src/**/*.spec.ts'],
      name: 'Unit',
    },
  },
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

export const strykerConfig = defineConfig({
  test: {
    exclude: ['src/**/*.int.spec.ts'],
    include: ['src/**/*.spec.ts'],
    coverage: {
      all: true,
    },
    passWithNoTests: true,
    sequence: {
      hooks: 'parallel',
    },
  },
});
