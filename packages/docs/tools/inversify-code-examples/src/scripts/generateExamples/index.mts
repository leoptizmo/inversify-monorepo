#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

import { glob } from 'glob';
import ts from 'typescript';

import getReplaceRanges from './getReplaceRanges.mjs';
import {
  RelevantCommentKind,
  RelevantCommentPosition,
  RelevantCommentPositions,
  ReplaceRange,
} from './types.mjs';

const SRC_FOLDER: string = './src';
const EXAMPLES_GLOB_PATTERN: string = `${SRC_FOLDER}/examples/**/*.ts`;
const TEST_EXAMPLES_GLOB_PATTERN: string = `${SRC_FOLDER}/examples/**/*.spec.ts`;

const BEGIN_EXAMPLE_COMMENT: string = '// Begin-example';
const END_EXAMPLE_COMMENT: string = '// End-example';
const EXCLUDE_FROM_EXAMPLE_COMMENT: string = '// Exclude-from-example';
const IS_INVERSIFY_IMPORT_EXAMPLE_COMMENT: string =
  '// Is-inversify-import-example';
const SHIFT_LINES_SPACES_2_COMMENT: string = '// Shift-line-spaces-2';
const SHIFT_LINES_SPACES_2_OFFSET: number = 2;

const commentToRelevantCommentKindMap: {
  [key: string]: RelevantCommentKind;
} = {
  [BEGIN_EXAMPLE_COMMENT]: RelevantCommentKind.begin,
  [END_EXAMPLE_COMMENT]: RelevantCommentKind.end,
  [EXCLUDE_FROM_EXAMPLE_COMMENT]: RelevantCommentKind.exclude,
  [IS_INVERSIFY_IMPORT_EXAMPLE_COMMENT]: RelevantCommentKind.isInversifyImport,
  [SHIFT_LINES_SPACES_2_COMMENT]: RelevantCommentKind.shiftLineSpaces2,
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
      [RelevantCommentKind.shiftLineSpaces2]: [],
    },
    list: [],
  };

  /*
   * Do not visit the source file node.
   * A source file node has two children: a root node and an end of file token node.
   * Visit grandchildren nodes so that the root node is not visited.
   */
  for (const childNode of sourceFileNode.getChildren()) {
    for (const granchildNode of childNode.getChildren()) {
      visitRelevantCommentPositions(
        sourceFileNode,
        fileContent,
        granchildNode,
        positions,
      );
    }
  }

  // Visit the end of file token node.
  visitRelevantCommentPositions(
    sourceFileNode,
    fileContent,
    sourceFileNode.endOfFileToken,
    positions,
  );

  return positions;
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

async function getExamplePaths(): Promise<string[]> {
  return glob(EXAMPLES_GLOB_PATTERN, { ignore: TEST_EXAMPLES_GLOB_PATTERN });
}

function getShiftOffet(positions: RelevantCommentPositions): number {
  let shiftOffset: number = 0;

  if (
    positions.kindToPositionsMap[RelevantCommentKind.shiftLineSpaces2].length >
    0
  ) {
    shiftOffset = SHIFT_LINES_SPACES_2_OFFSET;
  }

  return shiftOffset;
}

async function run(): Promise<void> {
  const codeExamplePaths: string[] = await getExamplePaths();

  for (const codeExamplePath of codeExamplePaths) {
    await writeSourceCodeExample(
      codeExamplePath,
      await generateExampleFromSourceCode(codeExamplePath),
    );
  }
}

function shift(offset: number, text: string): string {
  if (offset === 0) {
    return text;
  }

  let transformedText: string = '';

  for (let i: number = 0; i < text.length; ++i) {
    const currentChar: string = text[i] as string;

    transformedText += currentChar;

    if (currentChar === '\n') {
      let spacesFound: number = 0;

      for (let j: number = 1; j <= offset && i + j < text.length; ++j) {
        if (text[i + j] === ' ') {
          ++spacesFound;
        } else {
          break;
        }
      }

      i += spacesFound;
    }
  }

  return transformedText;
}

function transformSourceFile(
  sourceFile: ts.SourceFile,
  positions: RelevantCommentPositions,
): string {
  const replaceRanges: ReplaceRange[] = getReplaceRanges(sourceFile, positions);
  const shiftOffset: number = getShiftOffet(positions);

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

  return shift(shiftOffset, transformedSourceCode);
}

function visitRelevantCommentPositions(
  sourceFileNode: ts.SourceFile,
  fileContent: string,
  node: ts.Node,
  positions: RelevantCommentPositions,
): void {
  for (const comment of ts.getLeadingCommentRanges(
    fileContent,
    node.getFullStart(),
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
        node,
        range: comment,
      };

      const kindToPositionsMapEntry: RelevantCommentPosition[] = (
        positions.kindToPositionsMap as Record<
          RelevantCommentKind,
          RelevantCommentPosition[]
        >
      )[relevanCommentKind];

      const lastKindToPositionsMapEntry: RelevantCommentPosition | undefined =
        kindToPositionsMapEntry[kindToPositionsMapEntry.length - 1];

      if (
        lastKindToPositionsMapEntry === undefined ||
        lastKindToPositionsMapEntry.range.pos !==
          relevantCommentPosition.range.pos
      ) {
        kindToPositionsMapEntry.push(relevantCommentPosition);
        positions.list.push(relevantCommentPosition);
      }
    }
  }

  for (const childNode of node.getChildren(sourceFileNode)) {
    visitRelevantCommentPositions(
      sourceFileNode,
      fileContent,
      childNode,
      positions,
    );
  }
}

async function writeSourceCodeExample(
  sourcePath: string,
  sourceContent: string,
): Promise<void> {
  const destinationPath: string = `${sourcePath.replace('src', 'generated')}.txt`;

  const directory: string = path.dirname(destinationPath);

  try {
    await fs.stat(directory);
  } catch (_error: unknown) {
    await fs.mkdir(directory, { recursive: true });
  }

  await fs.writeFile(destinationPath, sourceContent);
}

await run();
