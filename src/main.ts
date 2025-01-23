import { on, once, showUI } from "@create-figma-plugin/utilities";
import {
  CloseHandler,
  CreateNewDataInsightPageHandler,
  UpdateChartHandler,
} from "./types";

import { updateChart } from "./actions/updateChart";
import { createNewDataInsightPage } from "./actions/createNewPage";

export default function () {
  on<CreateNewDataInsightPageHandler>(
    "CREATE_NEW_DATA_INSIGHT_PAGE",
    createNewDataInsightPage,
  );

  on<UpdateChartHandler>("UPDATE_CHART", updateChart);

  once<CloseHandler>("CLOSE", function () {
    figma.closePlugin();
  });

  showUI({
    height: 137,
    width: 240,
  });
}
