import { EventHandler } from "@create-figma-plugin/utilities";

export type Input =
  | { type: "url"; url: string }
  | { type: "chartViewName"; chartViewName: string };

export interface PluginProps {
  errorMessageBackend: string;
}

export interface CreateNewDataInsightPageHandler extends EventHandler {
  name: "CREATE_NEW_DATA_INSIGHT_PAGE";
  handler: (arg: Input) => void;
}

export interface UpdateChartHandler extends EventHandler {
  name: "UPDATE_CHART";
  handler: (arg: Input) => void;
}

export interface CloseHandler extends EventHandler {
  name: "CLOSE";
  handler: () => void;
}
