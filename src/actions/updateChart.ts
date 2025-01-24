import { showUI } from "@create-figma-plugin/utilities";

import {
  GRAPHER_CHART_AREA,
  GRAPHER_FOOTER,
  GRAPHER_HEADER,
  PLUGIN_DIMENSIONS,
} from "../constants";
import { fetchGrapherSvg } from "../helpers";
import { Input } from "../types";
import {
  findAndReplaceChildNodes,
  findChildNodeByName,
  findLastChildAboveY,
  isFrameNode,
} from "../utils";

export async function updateChart(arg: Input) {
  // Fetch the SVG from the URL and create a Figma node
  let svg: string;
  try {
    svg = await fetchGrapherSvg(arg);
  } catch (error) {
    if (error instanceof Error) {
      showUI(PLUGIN_DIMENSIONS, {
        initialErrorMessageBackend: error.message,
      });
    }
    return;
  }

  const newSvgNode = figma.createNodeFromSvg(svg);

  for (const selectedNode of figma.currentPage.selection) {
    if (!isFrameNode(selectedNode)) continue;

    // Try to find 'header' and 'footer' elements in the selected node.
    // If found, replace their children with contents of the new SVG
    // If not found, we assume the header or footer has been replaced by the user,
    // so we respect the user's changes and don't copy in elements
    const isHeaderReplaced = findAndReplaceChildNodes(
      selectedNode,
      newSvgNode,
      GRAPHER_HEADER,
    );
    findAndReplaceChildNodes(selectedNode, newSvgNode, GRAPHER_FOOTER);

    // Try to find the 'chart-area' element in the selected node.
    // If found, replace its children with contents of the new SVG
    // If not found, append the 'chart-area' element from the new SVG
    const chartAreaNode = findChildNodeByName(selectedNode, GRAPHER_CHART_AREA);
    if (chartAreaNode) {
      findAndReplaceChildNodes(selectedNode, newSvgNode, GRAPHER_CHART_AREA);
    } else {
      const newChartAreaNode = findChildNodeByName(
        newSvgNode,
        GRAPHER_CHART_AREA,
      );
      if (newChartAreaNode) {
        // Adjust the y-position of the new chart area node so that it
        // doesn't overlap with the header
        if (!isHeaderReplaced) {
          const childAbove = findLastChildAboveY(
            selectedNode,
            newChartAreaNode.y,
          );
          if (childAbove) {
            newChartAreaNode.y = childAbove.y + childAbove.height + 12;
          }
        }
        selectedNode.appendChild(newChartAreaNode);
      }
    }
  }
}
