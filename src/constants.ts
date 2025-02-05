import { ChartType, GrapherSection, TemplatePageName } from "./types";

export const OWID_URL = "https://ourworldindata.org";
export const ADMIN_URL = "https://admin.owid.io";
export const GRAPHER_URL = `${OWID_URL}/grapher`;
export const DEFAULT_SVG_QUERY_PARAMS = "imType=square&nocache";

export const GRAPHER_CHART_AREA = "chart-area" satisfies GrapherSection;
export const GRAPHER_HEADER = "header" satisfies GrapherSection;
export const GRAPHER_FOOTER = "footer" satisfies GrapherSection;

export const PLUGIN_DIMENSIONS = {
  height: 380,
  width: 420,
};

export const CHART_TYPE_TO_TEMPLATE_PAGE: Record<ChartType, TemplatePageName> =
  {
    LineChart: "Line chart",
    SlopeChart: "Line chart",
    DiscreteBar: "Bar chart",
    StackedDiscreteBar: "Bar chart",
    Marimekko: "Bar chart",
    StackedBar: "Stacked chart",
    StackedArea: "Stacked chart",
    ScatterPlot: "Scatter plot",
    WorldMap: "World map",
  };
