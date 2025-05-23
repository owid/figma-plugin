import Url from "url-parse";
import { showUI } from "@create-figma-plugin/utilities";

import { PLACEHOLDER_NAME, PLUGIN_DIMENSIONS } from "../constants";
import {
  createNewPage,
  createNewPageFromTemplatePage,
  extractTemplatePageForChartType,
  fetchNarrativeChartMap,
  fetchGrapherConfig,
  fetchGrapherSvg,
  findChildNodeByName,
  inferChartType,
  makePageNameForChart,
} from "../helpers";
import { NarrativeChartMap, HandlerArgs, QueryParams } from "../types";
import { strToQueryParams } from "../helpers";

export async function createNewDataInsightPage(arg: HandlerArgs): Promise<{
  success: boolean;
}> {
  let narrativeChartMap: NarrativeChartMap | undefined;
  if (arg.type === "narrativeChartName") {
    narrativeChartMap = await fetchNarrativeChartMap();
  }

  // Fetch the SVG and chart config by narrative chart name or url
  let svg: string, config: Record<string, any> | undefined;
  try {
    [svg, config] = await Promise.all([
      fetchGrapherSvg(arg, narrativeChartMap),
      fetchGrapherConfig(arg, narrativeChartMap),
    ]);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch";
    showUI(PLUGIN_DIMENSIONS, {
      ...arg.uiState,
      errorMessageBackend: errorMessage,
    });
    return { success: false };
  }

  let queryParams: QueryParams | undefined;
  if (arg.type === "grapherUrl" || arg.type === "explorerUrl") {
    const argUrl = new Url(arg.url);
    queryParams = strToQueryParams(argUrl.query);
  }

  // Pick the template page based on the chart type
  const chartType = inferChartType(config, queryParams);
  const templatePage = chartType
    ? extractTemplatePageForChartType(chartType)
    : undefined;

  // Create a new page from the template if it exists
  const pageName = makePageNameForChart(config);
  const page = templatePage
    ? await createNewPageFromTemplatePage(templatePage, { pageName })
    : await createNewPage(pageName);

  // Find the placeholder element for the chart
  const placeholderNode = findChildNodeByName(page, PLACEHOLDER_NAME);
  const x = placeholderNode?.x ?? 0;
  const y = placeholderNode?.y ?? 0;

  // Set the new page as the current page
  await figma.setCurrentPageAsync(page);

  // Add the SVG and adjust its position
  const chartNode = figma.createNodeFromSvg(svg);
  chartNode.x = x;
  chartNode.y = y;

  // Update the chart frame's name
  if (config?.title) chartNode.name = config.title;

  // Scroll the chart into view
  figma.viewport.scrollAndZoomIntoView([chartNode]);
  figma.viewport.zoom = 0.5;

  // Remove the placeholder node
  placeholderNode?.remove();

  return { success: true };
}
