import { fetchGrapherSvg, findNonGrapherNodes } from "../helpers";

export async function updateChart(url: string) {
  // Fetch the SVG from the URL
  const svg = await fetchGrapherSvg(url);

  for (const selectedNode of figma.currentPage.selection) {
    // TODO: another approach is to find a Grapher node and replace it

    const nonGrapherNodes = findNonGrapherNodes(selectedNode);

    const x = selectedNode.x,
      y = selectedNode.y;

    // Remove the selected node
    selectedNode.remove();

    // Create a new node for the downloaded SVG
    const newNode = figma.createNodeFromSvg(svg);
    newNode.x = x;
    newNode.y = y;

    for (const customNode of nonGrapherNodes) {
      newNode.appendChild(customNode);
    }
  }
}
