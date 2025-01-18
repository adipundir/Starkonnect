export default function getTopLanguages(svgContent: string): { [key: string]: number } {
  // Create a temporary div to parse the SVG string
  const div = document.createElement('div');
  div.innerHTML = svgContent;

  const languages: { [key: string]: number } = {};

  // Find all language groups
  const langGroups = div.querySelectorAll('[data-testid="lang-items"] > g > g');
  
  langGroups.forEach((group) => {
    // Get language name
    const langNameElement = group.querySelector('[data-testid="lang-name"]');
    const langName = langNameElement?.textContent?.trim();

    // Get percentage (it's in the second text element with class 'lang-name')
    const percentageElement = group.querySelectorAll('.lang-name')[1];
    const percentageText = percentageElement?.textContent?.trim();
    
    if (langName && percentageText) {
      // Convert percentage string to number (remove the % symbol)
      const percentage = parseFloat(percentageText.replace('%', ''));
      languages[langName] = percentage;
    }
  });

  return languages;
}