import { on, once, showUI } from "@create-figma-plugin/utilities";

import {
  CloseHandler,
  CreateNewDataInsightPageHandler,
  Input,
  UpdateChartHandler,
} from "./types";

import { createNewDataInsightPage } from "./actions/createNewPage";
import { updateChart } from "./actions/updateChart";
import { PLUGIN_DIMENSIONS } from "./constants";

export default function () {
  on<CreateNewDataInsightPageHandler>(
    "CREATE_NEW_DATA_INSIGHT_PAGE",
    async (arg: Input) => {
      const { success } = await createNewDataInsightPage(arg);
      if (success) figma.closePlugin();
    },
  );

  on<UpdateChartHandler>("UPDATE_CHART", async (arg: Input) => {
    const { success } = await updateChart(arg);
    if (success) figma.closePlugin();
  });

  once<CloseHandler>("CLOSE", () => figma.closePlugin());

  showUI(PLUGIN_DIMENSIONS);
}
