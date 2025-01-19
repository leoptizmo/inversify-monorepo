#!/usr/bin/env node

import fs from 'node:fs/promises';

import { glob } from 'glob';
import ts from 'typescript';
import path from 'node:path';

const SRC_FOLDER: string = './src';
const EXAMPLES_GLOB_PATTERN: string = `${SRC_FOLDER}/examples/**/*.ts`;
const TEST_EXAMPLES_GLOB_PATTERN: string = `${SRC_FOLDER}/examples/**/*.spec.ts`;

enum RelevantCommentKind {
  begin,
  end,
  exclude,
  isInversifyImport,
}

interface RelevantCommentPosition<
  TKind extends RelevantCommentKind = RelevantCommentKind,
> {
  kind: TKind;
  node: ts.Node;
  range: ts.CommentRange;
}

interface RelevantCommentPositions {
  kindToPositionsMap: {
    [TKind in RelevantCommentKind]: RelevantCommentPosition<TKind>[];
  };
  list: RelevantCommentPosition[];
}

interface ReplaceRange {
  deleteRange: [number, number];
  replacement: string | ((text: string) => string) | undefined;
}

const BEGIN_EXAMPLE_COMMENT: string = '// Begin-example';
const END_EXAMPLE_COMMENT: string = '// End-example';
const EXCLUDE_FROM_EXAMPLE_COMMENT: string = '// Exclude-from-example';
const IS_INVERSIFY_IMPORT_EXAMPLE_COMMENT: string =
  '// Is-inversify-import-example';

const NODE_IMPORT_REXEP: RegExp = /^(.*)(import.*)(['"])([^'"]+)(['"])(.*)$/gms;
const INVERSIFY_NODE_IMPORT_REPLACE: string = '$2$3inversify$5$6';

const commentToRelevantCommentKindMap: {
  [key: string]: RelevantCommentKind;
} = {
  [BEGIN_EXAMPLE_COMMENT]: RelevantCommentKind.begin,
  [END_EXAMPLE_COMMENT]: RelevantCommentKind.end,
  [EXCLUDE_FROM_EXAMPLE_COMMENT]: RelevantCommentKind.exclude,
  [IS_INVERSIFY_IMPORT_EXAMPLE_COMMENT]: RelevantCommentKind.isInversifyImport,
};

function findRelevantCommentPositions(
  fileContent: string,
  sourceFileNode: ts.SourceFile,
): RelevantCommentPositions {
  const positions: RelevantCommentPositions = {
    kindToPositionsMap: {
      [RelevantCommentKind.begin]: [],
      [RelevantCommentKind.end]: [],
      [RelevantCommentKind.exclude]: [],
      [RelevantCommentKind.isInversifyImport]: [],
    },
    list: [],
  };

  // Do not visit the source file node
  for (const childNode of sourceFileNode.getChildren()) {
    visitRelevantCommentPositions(fileContent, childNode, positions);
  }

  return positions;
}

function visitRelevantCommentPositions(
  fileContent: string,
  node: ts.Node,
  positions: RelevantCommentPositions,
): void {
  // sourceFileNode.getSourceFile() might return undefined!
  if (node.getSourceFile() === undefined) {
    return;
  }

  for (const childNode of node.getChildren()) {
    for (const comment of ts.getLeadingCommentRanges(
      fileContent,
      childNode.getFullStart(),
    ) ?? []) {
      const commentContent: string = fileContent.substring(
        comment.pos,
        comment.end,
      );

      const relevanCommentKind: RelevantCommentKind | undefined =
        commentToRelevantCommentKindMap[commentContent];

      if (relevanCommentKind !== undefined) {
        const relevantCommentPosition: RelevantCommentPosition = {
          kind: relevanCommentKind,
          node: childNode,
          range: comment,
        };

        (
          positions.kindToPositionsMap as Record<
            RelevantCommentKind,
            RelevantCommentPosition[]
          >
        )[relevanCommentKind].push(relevantCommentPosition);

        positions.list.push(relevantCommentPosition);
      }
    }

    visitRelevantCommentPositions(fileContent, childNode, positions);
  }
}

async function getExamplePaths(): Promise<string[]> {
  return glob(EXAMPLES_GLOB_PATTERN, { ignore: TEST_EXAMPLES_GLOB_PATTERN });
}

async function generateExampleFromSourceCode(
  sourcePath: string,
): Promise<string> {
  const fileContent: string = (await fs.readFile(sourcePath)).toString();

  const sourceFile: ts.SourceFile = ts.createSourceFile(
    path.basename(sourcePath),
    fileContent,
    ts.ScriptTarget.Latest,
  );

  const relevantCommentPositions: RelevantCommentPositions =
    findRelevantCommentPositions(fileContent, sourceFile);

  return transformSourceFile(sourceFile, relevantCommentPositions);
}

async function writeSourceCodeExample(
  sourcePath: string,
  sourceContent: string,
): Promise<void> {
  const destinationPath: string = `${sourcePath.replace('src', 'generated')}.txt`;

  const directory = path.dirname(destinationPath);

  try {
    await fs.stat(directory);
  } catch (_error: unknown) {
    await fs.mkdir(directory, { recursive: true });
  }

  await fs.writeFile(destinationPath, sourceContent);
}

async function run(): Promise<void> {
  const codeExamplePaths: string[] = await getExamplePaths();

  for (const codeExamplePath of codeExamplePaths) {
    console.log(`Generating code example at ${codeExamplePath}...`);

    await writeSourceCodeExample(
      codeExamplePath,
      await generateExampleFromSourceCode(codeExamplePath),
    );

    console.log('Code example generated successfully');
  }
}

await run();

function getReplaceRanges(
  sourceFile: ts.SourceFile,
  positions: RelevantCommentPositions,
): ReplaceRange[] {
  const [firstBeginOfExamplePosition]: RelevantCommentPosition[] =
    positions.kindToPositionsMap[RelevantCommentKind.begin];

  const lastEndOfExamplePosition: RelevantCommentPosition | undefined =
    positions.kindToPositionsMap[RelevantCommentKind.end].at(-1);

  const replaceRanges: ReplaceRange[] = [];

  const relevantCommentPositions: RelevantCommentPosition[] = positions.list;

  let index: number = 0;

  // 1. Iterate until the first begin example comment is found in case there's at least one.
  if (firstBeginOfExamplePosition !== undefined) {
    while (relevantCommentPositions[index] !== firstBeginOfExamplePosition) {
      ++index;
    }

    replaceRanges.push({
      deleteRange: [0, firstBeginOfExamplePosition.range.end],
      replacement: undefined,
    });

    ++index;
  }

  // 2. Iterate over the rest of the relevant comments until the last end of example comment is found, if any.
  while (index < relevantCommentPositions.length) {
    const currentRelevantCommentPosition: RelevantCommentPosition =
      relevantCommentPositions[index] as RelevantCommentPosition;

    switch (currentRelevantCommentPosition.kind) {
      case RelevantCommentKind.end:
        if (currentRelevantCommentPosition === lastEndOfExamplePosition) {
          replaceRanges.push({
            deleteRange: [lastEndOfExamplePosition.node.pos, sourceFile.end],
            replacement: undefined,
          });

          return replaceRanges;
        }

        break;
      case RelevantCommentKind.exclude:
        replaceRanges.push({
          deleteRange: [
            currentRelevantCommentPosition.node.pos,
            currentRelevantCommentPosition.node.end,
          ],
          replacement: undefined,
        });
        break;
      case RelevantCommentKind.isInversifyImport:
        replaceRanges.push({
          deleteRange: [
            currentRelevantCommentPosition.node.pos,
            currentRelevantCommentPosition.node.end,
          ],
          replacement: (text: string) =>
            text.replace(NODE_IMPORT_REXEP, INVERSIFY_NODE_IMPORT_REPLACE),
        });
        break;
      default:
    }

    ++index;
  }

  return replaceRanges;
}

function transformSourceFile(
  sourceFile: ts.SourceFile,
  positions: RelevantCommentPositions,
): string {
  const replaceRanges: ReplaceRange[] = getReplaceRanges(sourceFile, positions);

  let transformedSourceCode: string = '';
  let currentIndex: number = 0;

  for (const {
    deleteRange: [min, max],
    replacement,
  } of replaceRanges) {
    while (currentIndex < max) {
      if (currentIndex < min) {
        transformedSourceCode += sourceFile.text[currentIndex];
      }

      ++currentIndex;
    }

    if (replacement !== undefined) {
      transformedSourceCode +=
        replacement instanceof Function
          ? replacement(sourceFile.text.slice(min, max))
          : replacement;
    }
  }

  transformedSourceCode += sourceFile.text.slice(currentIndex);

  return transformedSourceCode;
}
