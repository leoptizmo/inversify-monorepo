export function isStackOverflowError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  // V8 (Chrome, Node.js, Edge, Deno): "Maximum call stack size exceeded"
  // SpiderMonkey (Firefox): "too much recursion"
  // JavaScriptCore (Safari): "call stack size exceeded"
  // Chakra (IE/legacy Edge): "Out of stack space"
  const stackOverflowPatterns: RegExp =
    /stack space|call stack|too much recursion/i;

  return (
    // V8 and JavaScriptCore typically throw RangeError
    (error instanceof RangeError &&
      stackOverflowPatterns.test(error.message)) ||
    // SpiderMonkey throws InternalError with "too much recursion"
    (error.name === 'InternalError' && /too much recursion/.test(error.message))
  );
}
