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

export const jsWorkspaceConfig = defineWorkspace([
  {
    test: {
      exclude: ['lib/esm/**/*.int.spec.js'],
      include: ['lib/esm/**/*.spec.js'],
      name: 'Unit',
    },
  },
  {
    test: {
      include: ['lib/**/*.int.spec.js'],
      name: 'Integration',
    },
  },
]);

export const defaultConfig = defineConfig({
  test: {
    coverage: {
      all: false,
    },
    sequence: {
      hooks: 'parallel',
    },
  },
});
