import { QueryParams } from "./types";

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

export function findLastChildAboveY(node: ChildrenMixin, y: number) {
  return node.children
    .filter((child) => child.y < y)
    .sort((a, b) => b.y - a.y)[0];
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
