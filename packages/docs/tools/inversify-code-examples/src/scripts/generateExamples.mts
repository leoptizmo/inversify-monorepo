#!/usr/bin/env node

import fs from 'node:fs/promises';

import { glob } from 'glob';
import ts from 'typescript';
import path from 'node:path';

const SRC_FOLDER: string = './src';
const EXAMPLES_GLOB_PATTERN: string = `${SRC_FOLDER}/examples/*.ts`;
const TEST_EXAMPLES_GLOB_PATTERN: string = `${SRC_FOLDER}/examples/*.spec.ts`;

const END_OF_EXAMPLE_COMMENT: string = '// End-of-example';

function findEndOfExampleCommentPosition(
  fileContent: string,
  sourceFileNode: ts.Node,
): number | undefined {
  // sourceFileNode.getSourceFile() might return undefined!
  if (sourceFileNode.getSourceFile() === undefined) {
    return undefined;
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

      if (commentContent === END_OF_EXAMPLE_COMMENT) {
        return comment.pos;
      }
    }

    const childEndOfExampleCommentPosition: number | undefined =
      findEndOfExampleCommentPosition(fileContent, childNode);

    if (childEndOfExampleCommentPosition !== undefined) {
      return childEndOfExampleCommentPosition;
    }
  }

  return undefined;
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

  const endOfExampleCommentPosition: number | undefined =
    findEndOfExampleCommentPosition(fileContent, sourceFile);

  if (endOfExampleCommentPosition === undefined) {
    return fileContent;
  }

  return fileContent.slice(0, endOfExampleCommentPosition);
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
