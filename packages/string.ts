
/**
 * kebab-caseに変換
 * ex:
 *  'camelCase' => 'camel-case'
 *  'PascalCase' => 'pascal-case'
 */
export const toKebabCase = (inputString: string): string => {
  return inputString.replace(
    /[A-Z]/g,
    (match, offset) => (offset > 0 ? '-' : '') + match.toLowerCase()
  );
};

/**
 * camelCaseに変換
 * * ex:
 *  'kebab-Case' => 'camelCase'
 */
export const toCamelCase = (inputString: string): string => {
  return inputString.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
};
