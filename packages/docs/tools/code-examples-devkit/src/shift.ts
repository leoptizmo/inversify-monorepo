export default function shift(offset: number, text: string): string {
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
