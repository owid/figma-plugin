import { CHART_NAMES, CHART_VIEWS } from "./constants";
import { Input } from "./types";
import { getUserName } from "./utils";

export async function fetchGrapherSvg(input: Input) {
  switch (input.type) {
    case "url":
      return await fetchGrapherSvgByUrl(input.url);
    case "chartViewName":
      return await fetchGrapherSvgByChartViewName(input.chartViewName);
  }
}

export async function fetchGrapherConfig(input: Input) {
  switch (input.type) {
    case "url":
      return await fetchGrapherConfigByUrl(input.url);
    case "chartViewName":
      return await fetchGrapherSvgByChartViewName(input.chartViewName);
  }
}

export async function fetchGrapherSvgByUrl(url: string) {
  // TODO: make more robust
  const [baseUrl, queryParams] = url.split("?");
  let svgUrl = `${baseUrl}.svg?imType=square`;
  if (queryParams) svgUrl += `&${queryParams}`;
  const svgResponse = await fetch(svgUrl);
  return await svgResponse.text();
}

export async function fetchGrapherConfigByUrl(url: string) {
  // TODO: make more robust
  const [baseUrl] = url.split("?");
  let svgUrl = `${baseUrl}.config.json`;
  const svgResponse = await fetch(svgUrl);
  return await svgResponse.json();
}

export async function fetchGrapherSvgByChartViewName(chartViewName: string) {
  // TODO: make more robust
  const chartConfigId = CHART_VIEWS[chartViewName];
  const url = `https://ourworldindata.org/grapher/by-uuid/${chartConfigId}.svg?imType=square`;
  const svgResponse = await fetch(url);
  return await svgResponse.text();
}

export async function fetchGrapherConfigByChartViewName(chartViewName: string) {
  // TODO: make more robust
  const chartConfigId = CHART_VIEWS[chartViewName];
  const url = `https://ourworldindata.org/grapher/by-uuid/${chartConfigId}.config.json`;
  const svgResponse = await fetch(url);
  return await svgResponse.json();
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
