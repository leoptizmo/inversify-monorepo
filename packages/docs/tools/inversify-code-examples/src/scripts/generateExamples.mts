#!/usr/bin/env node

import fs from 'node:fs/promises';

import { glob } from 'glob';
import ts from 'typescript';
import path from 'node:path';

const SRC_FOLDER: string = './src';
const EXAMPLES_GLOB_PATTERN: string = `${SRC_FOLDER}/examples/*.ts`;
const TEST_EXAMPLES_GLOB_PATTERN: string = `${SRC_FOLDER}/examples/*.spec.ts`;

enum RelevanCommentKind {
  begin,
  end,
  exclude,
}

interface RelevanCommentPositions {
  [RelevanCommentKind.begin]: [ts.CommentRange, ts.Node][];
  [RelevanCommentKind.end]: [ts.CommentRange, ts.Node][];
  [RelevanCommentKind.exclude]: [ts.CommentRange, ts.Node][];
}

const BEGIN_EXAMPLE_COMMENT: string = '// Begin-example';
const END_EXAMPLE_COMMENT: string = '// End-example';
const EXCLUDE_FROM_EXAMPLE_COMMENT: string = '// Exclude-from-example';

const commentToRelevantCommentKindMap: {
  [key: string]: RelevanCommentKind;
} = {
  [BEGIN_EXAMPLE_COMMENT]: RelevanCommentKind.begin,
  [END_EXAMPLE_COMMENT]: RelevanCommentKind.end,
  [EXCLUDE_FROM_EXAMPLE_COMMENT]: RelevanCommentKind.exclude,
};

function findRelevantCommentPositions(
  fileContent: string,
  sourceFileNode: ts.Node,
): RelevanCommentPositions {
  const positions: RelevanCommentPositions = {
    [RelevanCommentKind.begin]: [],
    [RelevanCommentKind.end]: [],
    [RelevanCommentKind.exclude]: [],
  };

  visitRelevantCommentPositions(fileContent, sourceFileNode, positions);

  return positions;
}

function visitRelevantCommentPositions(
  fileContent: string,
  sourceFileNode: ts.Node,
  positions: RelevanCommentPositions,
): void {
  // sourceFileNode.getSourceFile() might return undefined!
  if (sourceFileNode.getSourceFile() === undefined) {
    return;
  }

  for (const childNode of sourceFileNode.getChildren()) {
    for (const comment of ts.getLeadingCommentRanges(
      fileContent,
      childNode.getFullStart(),
    ) ?? []) {
      const commentContent: string = fileContent.substring(
        comment.pos,
        comment.end,
      );

      const relevanCommentKind: RelevanCommentKind | undefined =
        commentToRelevantCommentKindMap[commentContent];

      if (relevanCommentKind !== undefined) {
        positions[relevanCommentKind].push([comment, childNode]);
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

  const relevantCommentPositions: RelevanCommentPositions =
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

function getExcludeRanges(
  sourceFile: ts.SourceFile,
  positions: RelevanCommentPositions,
): [number, number][] {
  const [firstBeginOfExamplePosition]: [ts.CommentRange, ts.Node][] =
    positions[RelevanCommentKind.begin];

  const lastEndOfExamplePosition: [ts.CommentRange, ts.Node] | undefined =
    positions[RelevanCommentKind.end].at(-1);

  const excludedRanges: [number, number][] = [];

  if (firstBeginOfExamplePosition !== undefined) {
    const [commentNode] = firstBeginOfExamplePosition;

    excludedRanges.push([0, commentNode.end]);
  }

  for (const [, node] of positions[RelevanCommentKind.exclude]) {
    excludedRanges.push([node.pos, node.end]);
  }

  if (lastEndOfExamplePosition !== undefined) {
    const [, node] = lastEndOfExamplePosition;

    excludedRanges.push([node.pos, sourceFile.end]);
  }

  return excludedRanges;
}

function transformSourceFile(
  sourceFile: ts.SourceFile,
  positions: RelevanCommentPositions,
): string {
  const excludedRanges: [number, number][] = getExcludeRanges(
    sourceFile,
    positions,
  );

  let transformedSourceCode: string = '';
  let currentIndex: number = 0;

  for (const [min, max] of excludedRanges) {
    while (currentIndex <= max) {
      if (currentIndex < min) {
        transformedSourceCode += sourceFile.text[currentIndex];
      }

      ++currentIndex;
    }
  }

  transformedSourceCode += sourceFile.text.slice(currentIndex);

  return transformedSourceCode;
}
