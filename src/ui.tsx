import { h } from "preact";
import { useCallback, useState } from "preact/hooks";

import {
  Banner,
  Container,
  Disclosure,
  Divider,
  IconInfo32,
  render,
  Text,
  Toggle,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";

import {
  CloseHandler,
  CreateNewDataInsightPageHandler,
  GrapherSection,
  UpdateChartHandler,
} from "./types";
import { isValidUrl } from "./helpers";
import { EXPLORER_URL, GRAPHER_URL } from "./constants";
import { Form } from "./components/Form";

function Plugin(props: {
  textInput?: { forImportChartField?: string; forUpdateChartField?: string };
  errorMessageBackend?: string;
}) {
  const [isAdvancedSectionOpen, setIsAdvancedSectionOpen] = useState(false);
  const [shouldUpdateChartAreaOnly, setShouldUpdateChartAreaOnly] =
    useState(false);

  const [errorMessageBackend, setErrorMessageBackend] = useState(
    props.errorMessageBackend,
  );
  const [errorMessageFrontend, setErrorMessageFrontend] = useState("");

  const errorMessage = errorMessageBackend || errorMessageFrontend;

  const resetErrorMessages = () => {
    setErrorMessageBackend("");
    setErrorMessageFrontend("");
  };

  const importChart = (text: string) => {
    const data = parseTextInput(text);
    if (data.type === "chartViewName") {
      emit<CreateNewDataInsightPageHandler>("CREATE_NEW_DATA_INSIGHT_PAGE", {
        type: "chartViewName",
        chartViewName: data.value,
        textInput: { forImportChartField: text },
      });
    } else if (data.type === "grapherUrl") {
      emit<CreateNewDataInsightPageHandler>("CREATE_NEW_DATA_INSIGHT_PAGE", {
        type: "grapherUrl",
        url: data.value,
        textInput: { forImportChartField: text },
      });
    } else if (data.type === "explorerUrl") {
      emit<CreateNewDataInsightPageHandler>("CREATE_NEW_DATA_INSIGHT_PAGE", {
        type: "explorerUrl",
        url: data.value,
        textInput: { forImportChartField: text },
      });
    } else {
      setErrorMessageFrontend(
        "Please enter a valid narrative chart name or a Grapher or Explorer URL",
      );
    }
  };

  const updateChart = (text: string) => {
    const data = parseTextInput(text);
    const sections: GrapherSection[] | undefined = shouldUpdateChartAreaOnly
      ? ["chart-area"]
      : undefined;
    if (data.type === "chartViewName") {
      emit<UpdateChartHandler>("UPDATE_CHART", {
        type: "chartViewName",
        chartViewName: data.value,
        sections,
        textInput: { forUpdateChartField: text },
      });
    } else if (data.type === "grapherUrl") {
      emit<UpdateChartHandler>("UPDATE_CHART", {
        type: "grapherUrl",
        url: data.value,
        sections,
        textInput: { forUpdateChartField: text },
      });
    } else if (data.type === "explorerUrl") {
      emit<UpdateChartHandler>("UPDATE_CHART", {
        type: "explorerUrl",
        url: data.value,
        sections,
        textInput: { forUpdateChartField: text },
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

  return (
    <Container space="medium" onClose={onClose}>
      <VerticalSpace space="small" />
      {errorMessage && <Banner icon={<IconInfo32 />}>{errorMessage}</Banner>}

      <VerticalSpace space="small" />

      <Form
        title="Import a chart from Grapher to Figma"
        description="Enter the name of a narrative chart, a Grapher or an Explorer URL to import it into this file."
        action="Import chart"
        textInput={props.textInput?.forImportChartField}
        onTextInput={resetErrorMessages}
        onClick={importChart}
      />

      <VerticalSpace space="large" />
      <Divider />
      <VerticalSpace space="large" />

      <Form
        title="Update an existing chart in Figma with new data from Grapher"
        description="If you've already edited your chart in Figma but want to update it with data from Grapher such as entity selection or a data update, select the Frame your chart is in and click the button below."
        action="Update chart"
        textInput={props.textInput?.forUpdateChartField}
        onTextInput={resetErrorMessages}
        onClick={updateChart}
      />

      <VerticalSpace space="large" />

      <Disclosure
        onClick={() => setIsAdvancedSectionOpen(!isAdvancedSectionOpen)}
        open={isAdvancedSectionOpen}
        title="Advanced options"
      >
        <Toggle
          onChange={(event) =>
            setShouldUpdateChartAreaOnly(event.currentTarget.checked)
          }
          value={shouldUpdateChartAreaOnly}
        >
          <Text>
            Only update the chart area. The header and footer of the chart will
            remain unchanged.
          </Text>
        </Toggle>
      </Disclosure>
    </Container>
  );
}

type TextInputType = "chartViewName" | "grapherUrl" | "explorerUrl";
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
  else if (input.length > 0) return { type: "chartViewName", value: input };
  else return { type: "invalid", value: input };
};

export default render(Plugin);
