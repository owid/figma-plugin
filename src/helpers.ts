import Url from "url-parse";

import {
  CHART_TYPE_TO_TEMPLATE_PAGE,
  CHART_VIEWS,
  OWID_URL,
} from "./constants";
import {
  ChartType,
  CreateNewPageArg,
  QueryParams,
  UpdateChartArg,
} from "./types";
import { getCurrentDate, getUserName } from "./utils";

export async function fetchGrapherSvg(
  input: UpdateChartArg | CreateNewPageArg,
) {
  switch (input.type) {
    case "url":
      return await fetchGrapherSvgByUrl(input.url);
    case "chartViewName":
      return await fetchGrapherSvgByChartViewName(input.chartViewName);
  }
}

export async function fetchGrapherConfig(
  input: UpdateChartArg | CreateNewPageArg,
) {
  switch (input.type) {
    case "url":
      return await fetchGrapherConfigByUrl(input.url);
    case "chartViewName":
      return await fetchGrapherConfigByChartViewName(input.chartViewName);
  }
}

async function fetchGrapherSvgByUrl(urlStr: string) {
  const url = new Url(urlStr);

  // Construct the SVG URL
  let svgUrl = `${url.origin}${url.pathname}.svg`;
  if (url.query) svgUrl += `${url.query}&imType=square`;
  else svgUrl += "?imType=square";

  // Fetch SVG
  const response = await fetch(svgUrl);
  return await response.text();
}

async function fetchGrapherConfigByUrl(urlStr: string) {
  const url = new Url(urlStr);

  // Construct the config URL
  let configUrl = `${url.origin}${url.pathname}.config.json`;

  // Fetch config
  const response = await fetch(configUrl);
  return await response.json();
}

async function fetchGrapherSvgByChartViewName(chartViewName: string) {
  // Get the chart config ID
  const chartConfigId = CHART_VIEWS[chartViewName];
  if (!chartConfigId)
    throw new Error(`Narrative chart does not exist: ${chartViewName}`);

  // Construct the SVG URL
  const svgUrl = `${OWID_URL}/grapher/by-uuid/${chartConfigId}.svg?imType=square`;

  // Fetch SVG
  const response = await fetch(svgUrl);
  return await response.text();
}

async function fetchGrapherConfigByChartViewName(chartViewName: string) {
  // Get the chart config ID
  const chartConfigId = CHART_VIEWS[chartViewName];
  if (!chartConfigId)
    throw new Error(`Narrative chart does not exist: ${chartViewName}`);

  // Construct the config URL
  const configUrl = `${OWID_URL}/grapher/by-uuid/${chartConfigId}.config.json`;

  // Fetch config
  const reponse = await fetch(configUrl);
  return await reponse.json();
}

/** Infer the chart type from the chart config and the query params */
export function inferChartType(
  config: Record<string, any>,
  queryParams?: QueryParams,
): ChartType | undefined {
  // If the query params specify a tab, use that
  const tab = queryParams?.["tab"];
  if (tab === "map") return "WorldMap";
  if (tab === "line") return "LineChart";
  if (tab === "slope") return "SlopeChart";
  // Else, use the chart type from the config
  if (config.hasMapTab && config.tab === "map") return "WorldMap";
  if (!config.chartTypes) return "LineChart";
  return config.chartTypes[0];
}

function makeTemplatePageName(chartType: ChartType) {
  return `[Template] ${CHART_TYPE_TO_TEMPLATE_PAGE[chartType]}`;
}

export function extractTemplatePageForChartType(chartType: ChartType) {
  // Construct the name of the template page
  const templatePageName = makeTemplatePageName(chartType);

  // Find the template page in the Figma document
  const templatePage = figma.root.findChild(
    (page) => page.name === templatePageName,
  );

  return templatePage;
}

export function makePageNameForChart(config: Record<string, any>) {
  const date = getCurrentDate();
  const userName = getUserName();
  const chartTitle = config.title || "Untitled chart";
  let pageName = `${date} ${chartTitle}`;
  if (userName) pageName += ` (${userName})`;
  return pageName;
}

function findPageIndexByNamePrefix(pageNamePrefix: string) {
  return figma.root.children.findIndex((page) =>
    page.name.startsWith(pageNamePrefix),
  );
}

export async function createNewPage(pageName?: string) {
  const newPage = figma.createPage();
  if (pageName) newPage.name = pageName;

  // Insert the page after the first divider
  const separatorPageIndex = findPageIndexByNamePrefix("---");
  figma.root.insertChild(separatorPageIndex + 1, newPage);

  return newPage;
}

export async function createNewPageFromTemplatePage(
  templatePage: PageNode,
  options: {
    pageName: string;
  },
) {
  // Load the template page
  await templatePage.loadAsync();

  // Create a new page
  const newPage = await createNewPage(options.pageName);

  // Copy all nodes from the template page to the new page
  for (const node of templatePage.children) {
    // Ignore nodes with "[ignore]" in their name
    if (node.name.toLowerCase().includes("[ignore]")) continue;

    const newNode = node.clone();
    newPage.appendChild(newNode);
  }

  return newPage;
}
