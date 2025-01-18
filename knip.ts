import { KnipConfig } from "knip";

type RecordValues<T> = T extends Record<any, infer U> ? U : never;

type WorkspaceProjectConfig = RecordValues<Required<KnipConfig["workspaces"]>>;

const defaultWorkspaceProjectConfig: WorkspaceProjectConfig = {
  entry: [
    "{index,cli,main}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
    "src/{index,cli,main}.{js,cjs,mjs,jsx,ts,cts,mts,tsx}",
  ],
  project: [
    "**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}!",
    "!jest.config.stryker.mjs",
    "!**/__mocks__",
  ],
};

export default {
  workspaces: {
    ".": {
      entry: ["config/commitlint/commitlint.config.js"],
      project: [],
    },
    "packages/container/libraries/*": defaultWorkspaceProjectConfig,
    "packages/container/tools/*": defaultWorkspaceProjectConfig,
    "packages/docs/services/*": defaultWorkspaceProjectConfig,
    "packages/docs/tools/inversify-code-examples": {
      entry: ["src/examples/**/*.ts", "src/scripts/generateExamples.mts"],
      project: defaultWorkspaceProjectConfig.project,
    },
    "packages/docs/tools/*": defaultWorkspaceProjectConfig,
    "packages/foundation/libraries/*": defaultWorkspaceProjectConfig,
    "packages/foundation/tools/*": defaultWorkspaceProjectConfig,
    "packages/container/tools/e2e-tests": {
      entry: [
        "src/*/parameters/*.ts",
        "src/*/step-definitions/*.ts",
        "src/app/hooks/*.ts",
      ],
      project: [
        ...(defaultWorkspaceProjectConfig.project as string[]),
        "!config/*",
      ],
    },
  },
} satisfies KnipConfig;
