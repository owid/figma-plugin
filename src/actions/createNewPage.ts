import Url from "url-parse";
import { showUI } from "@create-figma-plugin/utilities";

import { PLUGIN_DIMENSIONS } from "../constants";
import {
  createNewPage,
  createNewPageFromTemplatePage,
  extractTemplatePageForChartType,
  fetchGrapherConfig,
  fetchGrapherSvg,
  inferChartType,
  makePageNameForChart,
} from "../helpers";
import { CreateNewPageArg, QueryParams } from "../types";
import { strToQueryParams } from "../helpers";

export async function createNewDataInsightPage(arg: CreateNewPageArg): Promise<{
  success: boolean;
}> {
  // Fetch the SVG and chart config by chart view name or url
  let svg: string, config: Record<string, any>;
  try {
    [svg, config] = await Promise.all([
      fetchGrapherSvg(arg),
      fetchGrapherConfig(arg),
    ]);
  } catch (error) {
    if (error instanceof Error) {
      showUI(PLUGIN_DIMENSIONS, { initialErrorMessageBackend: error.message });
    }
    return { success: false };
  }

  let queryParams: QueryParams | undefined;
  if (arg.type === "url") {
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

  // Set the new page as the current page, add the SVG and scroll it into view
  await figma.setCurrentPageAsync(page);
  const chartNode = figma.createNodeFromSvg(svg);
  figma.viewport.scrollAndZoomIntoView([chartNode]);

  return { success: true };
}
