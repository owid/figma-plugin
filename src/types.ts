import { EventHandler } from "@create-figma-plugin/utilities";

export interface CreateNewDataInsightPageHandler extends EventHandler {
  name: "CREATE_NEW_DATA_INSIGHT_PAGE";
  handler: (url: string) => void;
}

export interface UpdateChartHandler extends EventHandler {
  name: "UPDATE_CHART";
  handler: (url: string) => void;
}

export interface CloseHandler extends EventHandler {
  name: "CLOSE";
  handler: () => void;
}
