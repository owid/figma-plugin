import { getUserName } from "./utils";

// TODO: tighten up types
const CHART_NAMES: Record<string, string> = {
  LineChart: "Line chart",
  DiscreteBar: "Discrete bar chart",
  // TODO: add all chart types
};

export async function fetchGrapherSvg(url: string) {
  // Fetch the SVG from the URL
  // TODO: make more robust, add error handling
  const [baseUrl, queryParams] = url.split("?");
  let svgUrl = `${baseUrl}.svg?imType=social-media-square`;
  if (queryParams) svgUrl += `&${queryParams}`;
  const svgResponse = await fetch(svgUrl);
  return await svgResponse.text();
}

/** Infer the chart type from the chart config and the query params */
export function inferChartType(config: any): string {
  // TODO: typescript
  // TODO: take query params into account
  // TODO: make work for maps and edge cases
  return config.chartTypes && config.chartTypes.length > 0
    ? config.chartTypes[0]
    : "LineChart";
}

export function extractTemplatePageForChartType(chartType: string) {
  // TODO: typescript
  const templatePageName = "[Template] " + CHART_NAMES[chartType];

  // Find the template page in the Figma document
  const templatePage = figma.root.findChild(
    (page) => page.name === templatePageName,
  );

  return templatePage;
}

export function makePageNameForChart(config: any) {
  // TODO: typescript
  // TODO: handle edge cases (no user name, no title)
  const userName = getUserName();
  const chartTitle = config.title;
  return `${chartTitle} (${userName})`;
}

export async function createNewPageFromTemplatePage(
  templatePage: any, // TODO: Typescript
  options: {
    pageName: string;
  },
) {
  // TODO: Typescript

  // Load the template page
  await templatePage.loadAsync();

  // Create a new page
  const newPage = figma.createPage();
  if (options.pageName) newPage.name = options.pageName;

  // Copy all nodes from the template page to the new page
  for (const node of templatePage.children) {
    // Ignore nodes with "[ignore]" in their name
    if (node.name.toLowerCase().includes("[ignore]")) continue;

    const newNode = node.clone();
    newPage.appendChild(newNode);
  }

  return newPage;
}
