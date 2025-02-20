import { on, once, showUI } from "@create-figma-plugin/utilities";

import {
  CloseHandler,
  CreateNewDataInsightPageHandler,
  HandlerArgs,
  UpdateChartHandler,
} from "./types";

import { createNewDataInsightPage } from "./actions/createNewPage";
import { updateChart } from "./actions/updateChart";
import { PLUGIN_DIMENSIONS } from "./constants";

export default function () {
  on<CreateNewDataInsightPageHandler>(
    "CREATE_NEW_DATA_INSIGHT_PAGE",
    async (arg: HandlerArgs) => {
      const { success } = await createNewDataInsightPage(arg);
      if (success) figma.closePlugin();
    },
  );

  on<UpdateChartHandler>("UPDATE_CHART", async (arg: HandlerArgs) => {
    const { success } = await updateChart(arg);
    if (success) figma.closePlugin();
  });

  once<CloseHandler>("CLOSE", () => figma.closePlugin());

  // TOOD: types?
  showUI(PLUGIN_DIMENSIONS);
}
