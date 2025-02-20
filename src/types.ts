import { EventHandler } from "@create-figma-plugin/utilities";

export interface QueryParams {
  [key: string]: string | undefined;
}

export type TabName = "Import chart" | "Update chart";

export type AdvancedOption = "updateChartAreaOnly" | "beigeBackground";
export type AdvancedOptions = Partial<Record<AdvancedOption, boolean>>;

export interface UIState {
  currentTab?: TabName;
  textInput?: {
    importChartField?: string;
    updateChartField?: string;
  };
}

interface CommonArgs {
  uiState: UIState;
  options: AdvancedOptions;
}

interface UrlArgs {
  type: "grapherUrl" | "explorerUrl";
  url: string;
}

interface ChartViewArgs {
  type: "chartViewName";
  chartViewName: string;
}

export type HandlerArgs = CommonArgs & (UrlArgs | ChartViewArgs);

export interface PluginProps {
  errorMessageBackend: string;
}

export interface CreateNewDataInsightPageHandler extends EventHandler {
  name: "CREATE_NEW_DATA_INSIGHT_PAGE";
  handler: (arg: HandlerArgs) => void;
}

export interface UpdateChartHandler extends EventHandler {
  name: "UPDATE_CHART";
  handler: (arg: HandlerArgs) => void;
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
