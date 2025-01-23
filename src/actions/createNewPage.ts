import {
  createNewPageFromTemplatePage,
  extractTemplatePageForChartType,
  fetchGrapherSvg,
  inferChartType,
  makePageNameForChart,
} from "../helpers";

export async function createNewDataInsightPage(url: string) {
  const [baseUrl] = url.split("?");

  // Fetch the SVG from the URL
  const svg = await fetchGrapherSvg(url);

  // Fetch the config
  // TODO: make more robust, add error handling
  const configUrl = `${baseUrl}.config.json`;
  const configResponse = await fetch(configUrl);
  const config = await configResponse.json();

  // Pick the template page based on the chart type
  const chartType = inferChartType(config);
  const templatePage = extractTemplatePageForChartType(chartType);

  // TODO: handle case where template page is not found
  if (!templatePage) return;

  // Create a new page from the template
  const page = await createNewPageFromTemplatePage(templatePage, {
    pageName: makePageNameForChart(config),
  });

  // Add the downloaded SVG to the new page
  page.appendChild(figma.createNodeFromSvg(svg));

  // Set the new page as the current page and scroll content into view
  await figma.setCurrentPageAsync(page);
  figma.viewport.scrollAndZoomIntoView(page.children);
}
