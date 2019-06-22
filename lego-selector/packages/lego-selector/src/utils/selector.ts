export const parseListSelector = (selector: string) => {
  const SEPARATOR = ':nth-child(';
  const splitParts = selector.split(SEPARATOR);

  const result: any = {
    length: 0,
    selectorParts: []
  };

  if (splitParts.length > 0) {
    const lastPart = splitParts.pop();
    const firstPart = splitParts.join(SEPARATOR);

    result.length = document.querySelector(firstPart)!.parentNode!.children.length;
    result.selectorParts[0] = firstPart + SEPARATOR;
    result.selectorParts[1] = lastPart!.replace(/\d+\)/, ')');
  }

  return result;
};
