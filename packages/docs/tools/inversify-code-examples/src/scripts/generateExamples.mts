#!/usr/bin/env node

import fs from 'node:fs/promises';

import { glob } from 'glob';
import ts from 'typescript';
import path from 'node:path';

const SRC_FOLDER: string = './src';
const EXAMPLES_GLOB_PATTERN: string = `${SRC_FOLDER}/examples/*.ts`;
const TEST_EXAMPLES_GLOB_PATTERN: string = `${SRC_FOLDER}/examples/*.spec.ts`;

enum RelevanCommentKind {
  beginExample,
  endExample,
}

interface RelevanCommentPositions {
  [RelevanCommentKind.beginExample]: [ts.CommentRange, ts.Node][];
  [RelevanCommentKind.endExample]: [ts.CommentRange, ts.Node][];
}

const BEGIN_EXAMPLE_COMMENT: string = '// Begin-example';
const END_EXAMPLE_COMMENT: string = '// End-example';

const commentToRelevantCommentKindMap: {
  [key: string]: RelevanCommentKind;
} = {
  [BEGIN_EXAMPLE_COMMENT]: RelevanCommentKind.beginExample,
  [END_EXAMPLE_COMMENT]: RelevanCommentKind.endExample,
};

function findRelevantCommentPositions(
  fileContent: string,
  sourceFileNode: ts.Node,
): RelevanCommentPositions {
  const positions: RelevanCommentPositions = {
    [RelevanCommentKind.beginExample]: [],
    [RelevanCommentKind.endExample]: [],
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

function getCodeExampleBegining(
  sourceFile: ts.SourceFile,
  positions: RelevanCommentPositions,
): number {
  const [firstBeginExamplePosition]: [ts.CommentRange, ts.Node][] =
    positions[RelevanCommentKind.beginExample];

  if (firstBeginExamplePosition === undefined) {
    return 0;
  }

  const [, node] = firstBeginExamplePosition;

  return node.getStart(sourceFile);
}

function getCodeExampleEnd(
  sourceFile: ts.SourceFile,
  positions: RelevanCommentPositions,
): number {
  const lastEndExamplePosition: [ts.CommentRange, ts.Node] | undefined =
    positions[RelevanCommentKind.endExample].at(-1);

  if (lastEndExamplePosition === undefined) {
    return sourceFile.end;
  }

  const [comment] = lastEndExamplePosition;

  return comment.pos;
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

  return fileContent.slice(
    getCodeExampleBegining(sourceFile, relevantCommentPositions),
    getCodeExampleEnd(sourceFile, relevantCommentPositions),
  );
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
    await writeSourceCodeExample(
      codeExamplePath,
      await generateExampleFromSourceCode(codeExamplePath),
    );
  }
}

await run();
