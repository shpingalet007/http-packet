type MatchAllResult = RegExpMatchArray[];

function matchAll(pattern: RegExp, str: string): MatchAllResult {
  const regex = new RegExp(pattern, 'g');
  const matches: MatchAllResult = [];

  const match_result = str.match(regex);

  for (const index in match_result) {
    const item = match_result[index];
    matches[index] = item.match(new RegExp(pattern));
  }

  return matches;
}

export default matchAll;
