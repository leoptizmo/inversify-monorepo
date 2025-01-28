import {
  RelevantCommentKind,
  RelevantCommentPosition,
  RelevantCommentPositions,
  ShiftLinesSpacesRange,
} from './types.mjs';

interface ShiftLinesSpacesRangeEdge<
  TKind extends ShiftLinesSpacesRangeEdgeKind = ShiftLinesSpacesRangeEdgeKind,
> {
  kind: TKind;
  range: ShiftLinesSpacesRange;
}

enum ShiftLinesSpacesRangeEdgeKind {
  end,
  start,
}

export function getShiftLinesSpacesRanges(
  positions: RelevantCommentPositions,
): ShiftLinesSpacesRange[] {
  const shiftLinesSpacesRangesResult: ShiftLinesSpacesRange[] = [];

  const startEdgesStack: ShiftLinesSpacesRangeEdge<ShiftLinesSpacesRangeEdgeKind.start>[] =
    [];

  for (const edge of getSortedShiftLinesSpacesRangeEdges(positions)) {
    if (isShiftLinesSpacesRangeEdgeStart(edge)) {
      const lastShiftLinesSpacesRangesResult:
        | ShiftLinesSpacesRange
        | undefined =
        shiftLinesSpacesRangesResult[shiftLinesSpacesRangesResult.length - 1];

      const lastStackEdge:
        | ShiftLinesSpacesRangeEdge<ShiftLinesSpacesRangeEdgeKind.start>
        | undefined = startEdgesStack[startEdgesStack.length - 1];

      startEdgesStack.push(edge);

      if (lastShiftLinesSpacesRangesResult === undefined) {
        if (lastStackEdge === undefined) {
          shiftLinesSpacesRangesResult.push({
            end: edge.range.start,
            offset: 0,
            start: 0,
          });
        } else {
          shiftLinesSpacesRangesResult.push({
            end: edge.range.start,
            offset: lastStackEdge.range.offset,
            start: lastStackEdge.range.start,
          });
        }
      } else {
        if (lastStackEdge === undefined) {
          shiftLinesSpacesRangesResult.push({
            end: edge.range.start,
            offset: 0,
            start: lastShiftLinesSpacesRangesResult.end,
          });
        } else {
          shiftLinesSpacesRangesResult.push({
            end: edge.range.start,
            offset: lastStackEdge.range.offset,
            start: Math.max(
              lastStackEdge.range.start,
              lastShiftLinesSpacesRangesResult.end,
            ),
          });
        }
      }
    } else {
      const startEdge = startEdgesStack.pop();

      if (startEdge === undefined || startEdge.range !== edge.range) {
        throw new Error('Unmatched end edge');
      }

      const lastShiftLinesSpacesRangesResult:
        | ShiftLinesSpacesRange
        | undefined =
        shiftLinesSpacesRangesResult[shiftLinesSpacesRangesResult.length - 1];

      if (
        lastShiftLinesSpacesRangesResult === undefined ||
        lastShiftLinesSpacesRangesResult.end <= edge.range.start
      ) {
        shiftLinesSpacesRangesResult.push(edge.range);
      } else {
        shiftLinesSpacesRangesResult.push({
          end: edge.range.end,
          offset: edge.range.offset,
          start: lastShiftLinesSpacesRangesResult.start,
        });
      }
    }
  }

  return shiftLinesSpacesRangesResult;
}

function getSortedShiftLinesSpacesRangeEdges(
  positions: RelevantCommentPositions,
): ShiftLinesSpacesRangeEdge[] {
  const relevantCommentPositions: RelevantCommentPosition<RelevantCommentKind.shiftLineSpaces2>[] =
    [...positions.kindToPositionsMap[RelevantCommentKind.shiftLineSpaces2]];

  const shiftLinesSpacesRangeEdges: ShiftLinesSpacesRangeEdge[] = [];

  for (const { range } of relevantCommentPositions) {
    const shiftLinesSpacesRange = {
      start: range.pos,
      end: range.end,
      offset: 2,
    };

    shiftLinesSpacesRangeEdges.push(
      {
        kind: ShiftLinesSpacesRangeEdgeKind.start,
        range: shiftLinesSpacesRange,
      },
      {
        kind: ShiftLinesSpacesRangeEdgeKind.end,
        range: shiftLinesSpacesRange,
      },
    );
  }

  shiftLinesSpacesRangeEdges.sort((a, b) => {
    const startComparison = a.range.start - b.range.start;

    if (startComparison !== 0) {
      return startComparison;
    }

    // Return end edges first
    return a.kind - b.kind;
  });

  return shiftLinesSpacesRangeEdges;
}

function isShiftLinesSpacesRangeEdgeStart(
  edge: ShiftLinesSpacesRangeEdge,
): edge is ShiftLinesSpacesRangeEdge<ShiftLinesSpacesRangeEdgeKind.start> {
  return edge.kind === ShiftLinesSpacesRangeEdgeKind.start;
}
