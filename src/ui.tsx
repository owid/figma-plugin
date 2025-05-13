import { Fragment, h } from "preact";
import { useCallback, useState } from "preact/hooks";

import {
  Banner,
  Container,
  IconInfo32,
  render,
  Tabs,
  TabsOption,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";

import {
  AdvancedOptions,
  CloseHandler,
  CreateNewDataInsightPageHandler,
  TabName,
  UIState,
  UpdateChartHandler,
} from "./types";
import { isValidUrl } from "./helpers";
import { EXPLORER_URL, GRAPHER_URL } from "./constants";
import { Form } from "./components/Form";

function Plugin(props: {
  currentTab?: TabName;
  textInput?: { importChartField?: string; updateChartField?: string };
  errorMessageBackend?: string;
}) {
  const [currentTab, setCurrentTab] = useState<TabName>(
    props.currentTab ?? "Import chart",
  );

  const [errorMessageBackend, setErrorMessageBackend] = useState(
    props.errorMessageBackend,
  );
  const [errorMessageFrontend, setErrorMessageFrontend] = useState("");

  const errorMessage = errorMessageBackend || errorMessageFrontend;

  const resetErrorMessages = () => {
    setErrorMessageBackend("");
    setErrorMessageFrontend("");
  };

  const importChart = (text: string, options: AdvancedOptions = {}) => {
    const data = parseTextInput(text);

    const uiState: UIState = {
      currentTab,
      textInput: { importChartField: text },
    };

    if (data.type === "narrativeChartName") {
      emit<CreateNewDataInsightPageHandler>("CREATE_NEW_DATA_INSIGHT_PAGE", {
        type: "narrativeChartName",
        narrativeChartName: data.value,
        options,
        uiState,
      });
    } else if (data.type === "grapherUrl" || data.type === "explorerUrl") {
      emit<CreateNewDataInsightPageHandler>("CREATE_NEW_DATA_INSIGHT_PAGE", {
        type: data.type,
        url: data.value,
        options,
        uiState,
      });
    } else {
      setErrorMessageFrontend(
        "Please enter a valid narrative chart name or a Grapher/Explorer URL",
      );
    }
  };

  const updateChart = (text: string, options: AdvancedOptions = {}) => {
    const data = parseTextInput(text);

    const uiState: UIState = {
      currentTab,
      textInput: { updateChartField: text },
    };

    if (data.type === "narrativeChartName") {
      emit<UpdateChartHandler>("UPDATE_CHART", {
        type: "narrativeChartName",
        narrativeChartName: data.value,
        options,
        uiState,
      });
    } else if (data.type === "grapherUrl" || data.type === "explorerUrl") {
      emit<UpdateChartHandler>("UPDATE_CHART", {
        type: data.type,
        url: data.value,
        options,
        uiState,
      });
    } else {
      setErrorMessageFrontend(
        "Please enter a valid narrative chart name, a Grapher or Explorer URL",
      );
    }
  };

  const onClose = useCallback(function () {
    emit<CloseHandler>("CLOSE");
  }, []);

  const tabs: TabsOption[] = [
    {
      value: "Import chart",
      children: (
        <Form
          key="import"
          title="Import a chart from Grapher to Figma"
          description="Enter the name of a narrative chart, a Grapher or an Explorer URL to import it into this file."
          action="Import chart"
          advancedOptions={["beigeBackground"]}
          textInput={props.textInput?.importChartField}
          onTextInput={resetErrorMessages}
          onClick={importChart}
        />
      ),
    },
    {
      value: "Update chart",
      children: (
        <Form
          key="update"
          title="Update an existing chart in Figma with new data from Grapher"
          description="If you've made edits to your chart in Figma but want to update it with new data or settings (like a different entity selection), select the frame containing your chart and click the button below."
          action="Update chart"
          advancedOptions={["beigeBackground", "updateChartAreaOnly"]}
          textInput={props.textInput?.updateChartField}
          onTextInput={resetErrorMessages}
          onClick={updateChart}
        />
      ),
    },
  ];

  return (
    <Container space="medium" onClose={onClose}>
      <VerticalSpace space="extraSmall" />
      {errorMessage && (
        <Fragment>
          <Banner icon={<IconInfo32 />}>{errorMessage}</Banner>
          <VerticalSpace space="small" />
        </Fragment>
      )}
      <Tabs
        onChange={(event) =>
          setCurrentTab(event.currentTarget.value as TabName)
        }
        options={tabs}
        value={currentTab}
      />
    </Container>
  );
}

type TextInputType = "narrativeChartName" | "grapherUrl" | "explorerUrl";
const parseTextInput = (
  text: string,
): {
  type: TextInputType | "invalid";
  value: string;
} => {
  const input = text.trim();
  const isUrl = isValidUrl(input);
  if (isUrl && input.startsWith(`${GRAPHER_URL}/`))
    return { type: "grapherUrl", value: input };
  if (isUrl && input.startsWith(`${EXPLORER_URL}/`))
    return { type: "explorerUrl", value: input };
  else if (input.length > 0) return { type: "narrativeChartName", value: input };
  else return { type: "invalid", value: input };
};

export default render(Plugin);
