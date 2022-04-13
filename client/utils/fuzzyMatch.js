export function fuzzyMatch(pattern, string) {
  const pattern2 = `.*${pattern.split('')
    .join('.*')
    .split(' ')
    .join('')
    .split('-')
    .join('')}.*`;
  const re = new RegExp(pattern2, 'ig');
  return re.test(string);
}
