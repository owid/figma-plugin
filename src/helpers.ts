import Url from "url-parse";

import {
  ADMIN_URL,
  CHART_TYPE_TO_TEMPLATE_PAGE,
  IGNORE_SUFFIX,
  OWID_URL,
  TEMPLATE_PAGE_NAME_PREFIX,
} from "./constants";
import { ChartType, ChartViewMap, HandlerArgs, QueryParams } from "./types";

export async function fetchGrapherSvg(
  input: HandlerArgs,
  chartViewMap?: ChartViewMap,
) {
  switch (input.type) {
    case "grapherUrl":
    case "explorerUrl":
      return await fetchGrapherOrExplorerSvgByUrl(input.url, input.options);
    case "chartViewName":
      return await fetchGrapherSvgByChartViewName(
        input.chartViewName,
        chartViewMap!,
        input.options,
      );
  }
}

export async function fetchGrapherConfig(
  input: HandlerArgs,
  chartViewMap?: ChartViewMap,
) {
  switch (input.type) {
    case "grapherUrl":
      return await fetchGrapherConfigByUrl(input.url);
    case "explorerUrl":
      return undefined; // can't fetch configs for explorers
    case "chartViewName":
      return await fetchGrapherConfigByChartViewName(
        input.chartViewName,
        chartViewMap!,
      );
  }
}

async function fetchGrapherOrExplorerSvgByUrl(
  urlStr: string,
  options?: { beigeBackground?: boolean },
) {
  const url = new Url(urlStr);

  // Update query params
  const queryParams = strToQueryParams(url.query);
  queryParams.imType = options?.beigeBackground
    ? "social-media-square"
    : "square";
  queryParams.nocache = "true";

  // Construct the SVG URL
  let svgUrl = `${url.origin}${url.pathname}.svg${queryParamsToStr(queryParams)}`;

  // Fetch SVG
  const response = await fetch(svgUrl);

  if (response.status !== 200) throw new Error("Failed to fetch " + svgUrl);

  return await response.text();
}

async function fetchGrapherConfigByUrl(urlStr: string) {
  const url = new Url(urlStr);

  // Construct the config URL
  let configUrl = `${url.origin}${url.pathname}.config.json`;

  // Fetch config
  const response = await fetch(configUrl);

  if (response.status !== 200) throw new Error("Failed to fetch " + configUrl);

  return await response.json();
}

export async function fetchChartViewMap() {
  const url = `${ADMIN_URL}/api/chartViewMap`;
  const response = await fetch(url);
  return await response.json();
}

async function fetchGrapherSvgByChartViewName(
  chartViewName: string,
  chartViewMap: ChartViewMap,
  options?: { beigeBackground?: boolean },
) {
  // Get the chart config ID
  const chartConfigId = chartViewMap[chartViewName];
  if (!chartConfigId)
    throw new Error(`Narrative chart does not exist: ${chartViewName}`);

  // Add query params
  const queryParams = {
    imType: options?.beigeBackground ? "social-media-square" : "square",
    nocache: "true",
  };

  // Construct the SVG URL
  const svgUrl = `${OWID_URL}/grapher/by-uuid/${chartConfigId}.svg${queryParamsToStr(queryParams)}`;

  // Fetch SVG
  const response = await fetch(svgUrl);

  if (response.status !== 200) throw new Error("Failed to fetch " + svgUrl);

  return await response.text();
}

async function fetchGrapherConfigByChartViewName(
  chartViewName: string,
  chartViewMap: ChartViewMap,
) {
  // Get the chart config ID
  const chartConfigId = chartViewMap[chartViewName];
  if (!chartConfigId)
    throw new Error(`Narrative chart does not exist: ${chartViewName}`);

  // Construct the config URL
  const configUrl = `${OWID_URL}/grapher/by-uuid/${chartConfigId}.config.json`;

  // Fetch config
  const response = await fetch(configUrl);

  if (response.status !== 200) throw new Error("Failed to fetch " + configUrl);

  return await response.json();
}

/** Infer the chart type from the chart config and the query params */
export function inferChartType(
  config: Record<string, any>,
  queryParams?: QueryParams,
): ChartType | undefined {
  // If the tab query parameter is set, use it to determine the chart type
  const tab = queryParams?.["tab"];
  if (tab) {
    // Handle cases where tab is set to 'line' or 'slope'
    if (tab === "line") return "LineChart";
    if (tab === "slope") return "SlopeChart";

    // Handle cases where tab is set to 'chart', 'map' or 'table'
    if (tab === "table") return undefined;
    if (tab === "map") return "WorldMap";
    if (tab === "chart") return getChartTypeFromConfigField(config.chartTypes);
  }

  // If the chart has a map tab and it's the default tab, use the map type
  if (config.hasMapTab && config.tab === "map") return "WorldMap";

  // Otherwise, rely on the config's chartTypes field
  return getChartTypeFromConfigField(config.chartTypes);
}

function getChartTypeFromConfigField(
  chartTypes?: ChartType[],
): ChartType | undefined {
  if (!chartTypes) return "LineChart";
  if (chartTypes.length === 0) return undefined;
  return chartTypes[0];
}

function makeTemplatePageName(chartType: ChartType) {
  return `${TEMPLATE_PAGE_NAME_PREFIX}${CHART_TYPE_TO_TEMPLATE_PAGE[chartType]}`;
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

export function makePageNameForChart(config?: Record<string, any>) {
  const date = getCurrentDate();
  const userName = getUserName();
  const chartTitle = config?.title || "Untitled chart";
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
    if (node.name.toLowerCase().endsWith(IGNORE_SUFFIX)) continue;

    const newNode = node.clone();
    newPage.appendChild(newNode);
  }

  return newPage;
}

function capitalize(s: string) {
  if (s.length === 0) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function getUserName() {
  const userName = figma.currentUser?.name;
  if (!userName || userName === "Anonymous") return undefined;
  return capitalize(userName);
}

export function findChildNodeByName(node: ChildrenMixin, name: string) {
  return node.children.find((child) => child.name === name);
}

export function isFrameOrGroupNode(
  node: BaseNode,
): node is FrameNode | GroupNode {
  return node.type === "FRAME" || node.type === "GROUP";
}

export function replaceChildNodes(
  targetNode: ChildrenMixin,
  newNode: ChildrenMixin,
) {
  // Group nodes disappear from the document when all their children are removed.
  // That's why we mark the children as stale first and only remove after appending
  // the new children.

  // Mark the target node's children as stale
  targetNode.children.forEach((child) => child.setPluginData("stale", "true"));

  // Append new children to the target node
  newNode.children.forEach((child) => targetNode.appendChild(child));

  // Remove stale children
  targetNode.children
    .filter((child) => child.getPluginData("stale") === "true")
    .forEach((child) => child.remove());
}

export function findAndReplaceChildNodes(
  targetNode: ChildrenMixin,
  newNode: ChildrenMixin,
  targetChildName: string,
) {
  const targetChildNode = findChildNodeByName(targetNode, targetChildName);
  if (!targetChildNode || !isFrameOrGroupNode(targetChildNode)) return false;

  const newChildNode = findChildNodeByName(newNode, targetChildName);
  if (!newChildNode || !isFrameOrGroupNode(newChildNode)) return false;

  replaceChildNodes(targetChildNode, newChildNode);
  return true;
}

function findLastChildAboveY(node: ChildrenMixin, y: number) {
  return node.children
    .filter((child) => child.y < y)
    .sort((a, b) => b.y - a.y)[0];
}

export function moveTargetNodeBelowClosestAbove(
  rootNode: ChildrenMixin,
  targetNode: FrameNode | GroupNode,
  margin = 12,
) {
  const childAbove = findLastChildAboveY(rootNode, targetNode.y);
  if (childAbove) {
    targetNode.y = childAbove.y + childAbove.height + margin;
  }
}

export function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + month + day;
}

export const strToQueryParams = (queryStr: string): QueryParams => {
  const cleanQuery = queryStr.startsWith("?") ? queryStr.slice(1) : queryStr;
  const querySplit = cleanQuery.split("&").filter((s) => s);

  const params: QueryParams = {};
  for (const param of querySplit) {
    const [key, value] = param.split("=", 2);
    const decodedKey = decodeURIComponent(key.replace(/\+/g, "%20"));
    const decoded =
      value !== undefined
        ? decodeURIComponent(value.replace(/\+/g, "%20"))
        : undefined;
    params[decodedKey] = decoded;
  }

  return params;
};

export const queryParamsToStr = (params: QueryParams): string => {
  const queryStr = Object.keys(params)
    .filter((key) => params[key] !== undefined)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key]!)}`,
    )
    .join("&");

  return queryStr ? `?${queryStr}` : "";
};

export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
