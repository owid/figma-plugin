import { showUI } from "@create-figma-plugin/utilities";

import { PLUGIN_DIMENSIONS } from "../constants";
import {
  createNewPageFromTemplatePage,
  extractTemplatePageForChartType,
  fetchGrapherConfig,
  fetchGrapherSvg,
  inferChartType,
  makePageNameForChart,
} from "../helpers";
import { Input } from "../types";

export async function createNewDataInsightPage(arg: Input) {
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
    return;
  }

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
