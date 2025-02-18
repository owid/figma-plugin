import { EventHandler } from "@create-figma-plugin/utilities";

export interface QueryParams {
  [key: string]: string | undefined;
}

export type CreateNewPageArg =
  | { type: "grapherUrl"; textInput: string; url: string }
  | { type: "explorerUrl"; textInput: string; url: string }
  | { type: "chartViewName"; textInput: string; chartViewName: string };

export type UpdateChartArg =
  | {
      type: "grapherUrl";
      textInput: string;
      url: string;
      sections?: GrapherSection[];
    }
  | {
      type: "explorerUrl";
      textInput: string;
      url: string;
      sections?: GrapherSection[];
    }
  | {
      type: "chartViewName";
      textInput: string;
      chartViewName: string;
      sections?: GrapherSection[];
    };

export interface PluginProps {
  errorMessageBackend: string;
}

export interface CreateNewDataInsightPageHandler extends EventHandler {
  name: "CREATE_NEW_DATA_INSIGHT_PAGE";
  handler: (arg: CreateNewPageArg) => void;
}

export interface UpdateChartHandler extends EventHandler {
  name: "UPDATE_CHART";
  handler: (arg: UpdateChartArg) => void;
}

export interface CloseHandler extends EventHandler {
  name: "CLOSE";
  handler: () => void;
}

export type GrapherSection = "header" | "footer" | "chart-area";

export type ChartType =
  | "LineChart"
  | "SlopeChart"
  | "DiscreteBar"
  | "StackedDiscreteBar"
  | "StackedBar"
  | "StackedArea"
  | "ScatterPlot"
  | "Marimekko"
  | "WorldMap";

export type TemplatePageName =
  | "Line charts"
  | "Stacked area charts"
  | "Bar charts"
  | "Slope charts"
  | "Scatter plots"
  | "Maps";

export type ChartViewMap = Record<string, string>;
