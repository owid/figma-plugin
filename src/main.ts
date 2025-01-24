import { on, once, showUI } from "@create-figma-plugin/utilities";

import {
  CloseHandler,
  CreateNewDataInsightPageHandler,
  UpdateChartHandler,
} from "./types";

import { createNewDataInsightPage } from "./actions/createNewPage";
import { updateChart } from "./actions/updateChart";
import { PLUGIN_DIMENSIONS } from "./constants";

export default function () {
  // TODO: close plugin after success
  on<CreateNewDataInsightPageHandler>(
    "CREATE_NEW_DATA_INSIGHT_PAGE",
    createNewDataInsightPage,
  );

  // TODO: close plugin after success
  on<UpdateChartHandler>("UPDATE_CHART", updateChart);

  once<CloseHandler>("CLOSE", () => figma.closePlugin());

  showUI(PLUGIN_DIMENSIONS);
}
