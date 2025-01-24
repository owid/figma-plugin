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

export function isFrameNode(node: BaseNode): node is FrameNode {
  return node.type === "FRAME";
}

export function replaceChildNodes(
  targetNode: ChildrenMixin,
  newNode: ChildrenMixin,
) {
  // Remove old children from the target node
  targetNode.children.forEach((child) => child.remove());
  // Append new children to the target node
  newNode.children.forEach((child) => targetNode.appendChild(child));
}

export function findAndReplaceChildNodes(
  targetNode: ChildrenMixin,
  newNode: ChildrenMixin,
  targetChildName: string,
) {
  const targetChildNode = findChildNodeByName(targetNode, targetChildName);
  if (!targetChildNode || !isFrameNode(targetChildNode)) return false;

  const newChildNode = findChildNodeByName(newNode, targetChildName);
  if (!newChildNode || !isFrameNode(newChildNode)) return false;

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
