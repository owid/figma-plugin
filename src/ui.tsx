import { h, JSX } from "preact";
import { useCallback, useState } from "preact/hooks";

import {
  Banner,
  Button,
  Container,
  Disclosure,
  IconInfo32,
  Inline,
  Muted,
  render,
  Text,
  Textbox,
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

function Plugin({
  initialErrorMessageBackend,
}: {
  initialErrorMessageBackend: string;
}) {
  const [textInput, setTextInput] = useState("");

  const parseTextInput = (
    rawInput: string,
  ): {
    type: TextInputType | "invalid";
    value: string;
  } => {
    const input = rawInput.trim();
    const isUrl = isValidUrl(input);
    if (isUrl) return { type: "grapherUrl", value: input };
    else if (input.length > 0) return { type: "chartViewName", value: input };
    else return { type: "invalid", value: input };
  };

  const data = parseTextInput(textInput);

  const [isAdvancedSectionOpen, setIsAdvancedSectionOpen] = useState(false);
  const [shouldUpdateChartAreaOnly, setShouldUpdateChartAreaOnly] =
    useState(false);

  const [errorMessageBackend, setErrorMessageBackend] = useState(
    initialErrorMessageBackend,
  );
  const [errorMessageFrontend, setErrorMessageFrontend] = useState("");

  const errorMessage = errorMessageBackend || errorMessageFrontend;

  function onTextInput(event: JSX.TargetedEvent<HTMLInputElement>) {
    setErrorMessageBackend("");
    setErrorMessageFrontend("");
    setTextInput(event.currentTarget.value);
  }

  const onCreateNewDataInsightPage = useCallback(() => {
    if (data.type === "chartViewName") {
      emit<CreateNewDataInsightPageHandler>("CREATE_NEW_DATA_INSIGHT_PAGE", {
        type: "chartViewName",
        chartViewName: data.value,
      });
    } else if (data.type === "grapherUrl") {
      emit<CreateNewDataInsightPageHandler>("CREATE_NEW_DATA_INSIGHT_PAGE", {
        type: "grapherUrl",
        url: data.value,
      });
    } else {
      setErrorMessageFrontend(
        "Please enter a valid narrative chart name or a Grapher URL",
      );
    }
  }, [data]);

  const onUpdateChart = useCallback(() => {
    const sections: GrapherSection[] | undefined = shouldUpdateChartAreaOnly
      ? ["chart-area"]
      : undefined;
    if (data.type === "chartViewName") {
      emit<UpdateChartHandler>("UPDATE_CHART", {
        type: "chartViewName",
        chartViewName: data.value,
        sections,
      });
    } else if (data.type === "grapherUrl") {
      emit<UpdateChartHandler>("UPDATE_CHART", {
        type: "grapherUrl",
        url: data.value,
        sections,
      });
    } else {
      setErrorMessageFrontend(
        "Please enter a valid narrative chart name or a Grapher URL",
      );
    }
  }, [data, shouldUpdateChartAreaOnly]);

  const onClose = useCallback(function () {
    emit<CloseHandler>("CLOSE");
  }, []);

  return (
    <Container space="medium" onClose={onClose}>
      <VerticalSpace space="large" />
      <Text>
        Import a static Grapher export by entering the name of a narrative chart
        or a Grapher URL. The chart will either be inserted into a new page or
        will be used to update the currently selected chart.
      </Text>
      <VerticalSpace space="extraLarge" />
      <Text>
        <Muted>Grapher URL or Narrative chart name</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Textbox value={textInput} onInput={onTextInput} variant="border" />
      <VerticalSpace space="extraLarge" />
      <Inline space="extraSmall">
        <Button onClick={onCreateNewDataInsightPage}>Create DI page</Button>
        <Button onClick={onUpdateChart} secondary>
          Update selected chart
        </Button>
      </Inline>
      <VerticalSpace space="small" />
      {errorMessage && <Banner icon={<IconInfo32 />}>{errorMessage}</Banner>}
      <Disclosure
        onClick={() => setIsAdvancedSectionOpen(!isAdvancedSectionOpen)}
        open={isAdvancedSectionOpen}
        title="Advanced"
      >
        <Toggle
          onChange={(event) =>
            setShouldUpdateChartAreaOnly(event.currentTarget.checked)
          }
          value={shouldUpdateChartAreaOnly}
        >
          <Text>Only update the chart area</Text>
        </Toggle>
      </Disclosure>
    </Container>
  );
}

type TextInputType = "chartViewName" | "grapherUrl";
export default render(Plugin);
