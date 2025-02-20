import { ChartType, GrapherSection, TemplatePageName } from "./types";

export const OWID_URL = "https://ourworldindata.org";
export const ADMIN_URL = "https://admin.owid.io";
export const GRAPHER_URL = `${OWID_URL}/grapher`;
export const EXPLORER_URL = `${OWID_URL}/explorers`;

export const GRAPHER_CHART_AREA = "chart-area" satisfies GrapherSection;
export const GRAPHER_HEADER = "header" satisfies GrapherSection;
export const GRAPHER_FOOTER = "footer" satisfies GrapherSection;

export const TEMPLATE_PAGE_NAME_PREFIX = "Plugin / ";
export const PLACEHOLDER_NAME = "Plugin / Placeholder";
export const IGNORE_SUFFIX = "/ ignore";

export const PLUGIN_DIMENSIONS = {
  height: 325,
  width: 420,
};

export const CHART_TYPE_TO_TEMPLATE_PAGE: Record<ChartType, TemplatePageName> =
  {
    LineChart: "Line charts",
    SlopeChart: "Slope charts",
    DiscreteBar: "Bar charts",
    StackedDiscreteBar: "Bar charts",
    Marimekko: "Bar charts",
    StackedBar: "Bar charts",
    StackedArea: "Stacked area charts",
    ScatterPlot: "Scatter plots",
    WorldMap: "Maps",
  };
