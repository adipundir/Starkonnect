export default function getActivityData(svgContent: string) {
  // Extract using regex since we're dealing with a string
  const commitsMatch = svgContent.match(/data-testid="commits"[^>]*>(\d+)</);
  const prsMatch = svgContent.match(/data-testid="prs"[^>]*>(\d+)</);
  const contribsMatch = svgContent.match(/data-testid="contribs"[^>]*>(\d+)</);

  return {
    totalCommits: commitsMatch ? parseInt(commitsMatch[1]) : 0,
    totalPRs: prsMatch ? parseInt(prsMatch[1]) : 0,
    contributedTo: contribsMatch ? parseInt(contribsMatch[1]) : 0
  };
}