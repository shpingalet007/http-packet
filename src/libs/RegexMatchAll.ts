type MatchAllResult = RegExpMatchArray[];

function matchAll(pattern: RegExp, str: string): MatchAllResult {
  const regex = new RegExp(pattern, 'g');
  const matches: MatchAllResult = [];

  const match_result = str.match(regex);

  match_result.forEach((item, i) => {
    matches[i] = item.match(new RegExp(pattern));
  });

  return matches;
}

export default matchAll;
