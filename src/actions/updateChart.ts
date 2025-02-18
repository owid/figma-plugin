import { showUI } from "@create-figma-plugin/utilities";

import {
  GRAPHER_CHART_AREA,
  GRAPHER_FOOTER,
  GRAPHER_HEADER,
  PLUGIN_DIMENSIONS,
} from "../constants";
import {
  fetchChartViewMap,
  fetchGrapherSvg,
  findAndReplaceChildNodes,
  findChildNodeByName,
  isFrameOrGroupNode,
  moveTargetNodeBelowClosestAbove,
  replaceChildNodes,
} from "../helpers";
import { ChartViewMap, UpdateChartArg } from "../types";

export async function updateChart(
  arg: UpdateChartArg,
): Promise<{ success: boolean }> {
  let chartViewMap: ChartViewMap | undefined;
  if (arg.type === "chartViewName") {
    chartViewMap = await fetchChartViewMap();
  }

  // Fetch the SVG by chart view name or url
  let svg: string;
  try {
    svg = await fetchGrapherSvg(arg, chartViewMap);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch";
    showUI(PLUGIN_DIMENSIONS, {
      textInput: arg.textInput,
      errorMessageBackend: errorMessage,
    });
    return { success: false };
  }

  // Default to updating all sections
  const sections = arg.sections ?? ["header", "footer", "chart-area"];
  const shouldUpdateHeader = sections.includes("header");
  const shouldUpdateFooter = sections.includes("footer");
  const shouldUpdateChartArea = sections.includes("chart-area");

  const newSvgNode = figma.createNodeFromSvg(svg);

  for (const selectedNode of figma.currentPage.selection) {
    if (!isFrameOrGroupNode(selectedNode)) continue;

    // Try to find the 'header' element in the selected node.
    // If found, replace its children with contents of the new SVG.
    // If not found, we assume the header has been replaced by the user,
    // so we respect the user's changes and leave the header as is
    const isHeaderReplaced = shouldUpdateHeader
      ? findAndReplaceChildNodes(selectedNode, newSvgNode, GRAPHER_HEADER)
      : false;

    // Find and replace the 'footer' element
    if (shouldUpdateFooter) {
      findAndReplaceChildNodes(selectedNode, newSvgNode, GRAPHER_FOOTER);
    }

    // Try to find the 'chart-area' element in the selected node.
    // If found, replace its children with the contents of the new SVG.
    // If not found, append the 'chart-area' element anyway since we assume
    // that's what the user intended
    if (shouldUpdateChartArea) {
      const newChartAreaNode = findChildNodeByName(
        newSvgNode,
        GRAPHER_CHART_AREA,
      );
      if (!newChartAreaNode || !isFrameOrGroupNode(newChartAreaNode)) continue;

      const chartAreaNode = findChildNodeByName(
        selectedNode,
        GRAPHER_CHART_AREA,
      );

      if (chartAreaNode) {
        // If the 'chart-area' element is found, replace its children
        // and maybe reposition it so that it's below the header
        if (!isFrameOrGroupNode(chartAreaNode)) continue;
        replaceChildNodes(chartAreaNode, newChartAreaNode);
        if (!isHeaderReplaced) {
          moveTargetNodeBelowClosestAbove(selectedNode, chartAreaNode);
        }
      } else {
        // If the 'chart-area' element is not found, append it and
        // maybe reposition it so that it's below the header
        selectedNode.appendChild(newChartAreaNode);
        if (!isHeaderReplaced) {
          moveTargetNodeBelowClosestAbove(selectedNode, newChartAreaNode);
        }
      }
    }
  }

  // Clean up
  newSvgNode.remove();

  return { success: true };
}
