import { ChartType, GrapherSection, TemplatePageName } from "./types";

// TODO: make sure these are in sync with Grapher
export const GRAPHER_CHART_AREA = "chart-area" satisfies GrapherSection;
export const GRAPHER_HEADER = "header" satisfies GrapherSection;
export const GRAPHER_FOOTER = "footer" satisfies GrapherSection;

export const PLUGIN_DIMENSIONS = {
  height: 380,
  width: 420,
};

export const OWID_URL = "https://ourworldindata.org";

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

// TODO: remove
export const CHART_VIEWS = {
  "men-smoke-more-than-women": "019464df-cd7a-777d-a55b-5292f4427d04",
  "one-year-olds-vaccinated-against-tetanus":
    "01946502-cdc9-72f1-8a3f-aae5e776787a",
  "road-deaths-by-income-group": "01946571-5f11-71c0-a05e-62d5d5be2580",
  "deaths-by-road-user-stacked-bar": "0194657d-da3f-7dbc-915f-e7db654b679f",
  "three-metrics-of-inequality-usa-fra-idn-ury":
    "01946a74-807a-70a5-a43d-77a0772210af",
  "share-of-one-year-olds-vaccinated-against-measles":
    "01946a7f-f76d-7321-ae30-ae835fa206d3",
  "share-of-births-by-age-of-mother": "01946ea1-6173-7b3c-b4de-a4ecbea499be",
  "sierra-leone-decline": "0194830f-c075-7084-9f4f-836084955f1e",
  "millet-sorghum-lag": "01948334-3e1e-7516-afc1-1186b0279959",
  "change-in-global-production-of-five-materials-used-in-the-simon-ehrlich-wager":
    "01948f39-fb38-7d4f-a1b8-553f0baf3a53",
} as Record<string, string>;
