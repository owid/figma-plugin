import { fetchGrapherSvg } from "../helpers";
import {
  findAndReplaceChildNodes,
  findChildNodeByName,
  findLastChildAboveY,
  isFrameNode,
} from "../utils";

// TODO: make sure these are in sync with Grapher
const GRAPHER_CHART_AREA = "chart-area";
const GRAPHER_HEADER = "header";
const GRAPHER_FOOTER = "footer";

export async function updateChart(url: string) {
  // Fetch the SVG from the URL and create a Figma node
  const svg = await fetchGrapherSvg(url);
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
