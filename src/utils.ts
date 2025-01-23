export function getUserName() {
  const userName = figma.currentUser?.name;
  return userName === "Anonymous" ? undefined : userName;
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
