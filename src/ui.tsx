import { h, JSX } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

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
  TextboxAutocomplete,
  TextboxAutocompleteOption,
  Toggle,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";

import {
  ChartViewMap,
  CloseHandler,
  CreateNewDataInsightPageHandler,
  GrapherSection,
  UpdateChartHandler,
} from "./types";
import { fetchChartViewMap } from "./helpers";

function Plugin({
  initialErrorMessageBackend,
}: {
  initialErrorMessageBackend: string;
}) {
  const [chartViewMap, setChartViewMap] = useState<ChartViewMap>({});
  const [grapherUrl, setGrapherUrl] = useState("");
  const [chartViewName, setChartViewName] = useState("");

  const [isAdvancedSectionOpen, setIsAdvancedSectionOpen] = useState(false);
  const [shouldUpdateChartAreaOnly, setShouldUpdateChartAreaOnly] =
    useState(false);

  const [errorMessageBackend, setErrorMessageBackend] = useState(
    initialErrorMessageBackend,
  );
  const [errorMessageFrontend, setErrorMessageFrontend] = useState("");

  const errorMessage = errorMessageBackend || errorMessageFrontend;

  const availableChartViewNames: Array<TextboxAutocompleteOption> = Object.keys(
    chartViewMap,
  ).map((chartViewName) => ({ value: chartViewName }));

  function onChartViewNameUpdate(event: JSX.TargetedEvent<HTMLInputElement>) {
    setErrorMessageBackend("");
    setErrorMessageFrontend("");
    setChartViewName(event.currentTarget.value);
  }

  function onGrapherUrlUpdate(event: JSX.TargetedEvent<HTMLInputElement>) {
    setErrorMessageBackend("");
    setErrorMessageFrontend("");
    setGrapherUrl(event.currentTarget.value);
  }

  const onCreateNewDataInsightPage = useCallback(() => {
    if (chartViewName) {
      emit<CreateNewDataInsightPageHandler>("CREATE_NEW_DATA_INSIGHT_PAGE", {
        type: "chartViewName",
        chartViewName,
        chartViewMap,
      });
    } else if (grapherUrl) {
      emit<CreateNewDataInsightPageHandler>("CREATE_NEW_DATA_INSIGHT_PAGE", {
        type: "url",
        url: grapherUrl,
      });
    } else {
      setErrorMessageFrontend(
        "Please enter a chart view name or a Grapher URL",
      );
    }
  }, [chartViewName, chartViewMap, grapherUrl]);

  const onUpdateChart = useCallback(() => {
    const sections: GrapherSection[] | undefined = shouldUpdateChartAreaOnly
      ? ["chart-area"]
      : undefined;
    if (chartViewName) {
      emit<UpdateChartHandler>("UPDATE_CHART", {
        type: "chartViewName",
        chartViewName,
        chartViewMap,
        sections,
      });
    } else if (grapherUrl) {
      emit<UpdateChartHandler>("UPDATE_CHART", {
        type: "url",
        url: grapherUrl,
        sections,
      });
    } else {
      setErrorMessageFrontend(
        "Please enter a chart view name or a Grapher URL",
      );
    }
  }, [chartViewName, chartViewMap, grapherUrl, shouldUpdateChartAreaOnly]);

  const onClose = useCallback(function () {
    emit<CloseHandler>("CLOSE");
  }, []);

  useEffect(() => {
    const getChartViewMap = async () => {
      return await fetchChartViewMap();
    };

    getChartViewMap().then((chartViewMap) => setChartViewMap(chartViewMap));
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
        <Muted>Narrative view</Muted>
      </Text>
      <VerticalSpace space="small" />
      <TextboxAutocomplete
        onInput={onChartViewNameUpdate}
        options={availableChartViewNames}
        value={chartViewName}
        filter
        variant="border"
      />
      <VerticalSpace space="medium" />
      <Text>
        <Muted>Grapher URL</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Textbox
        value={grapherUrl}
        onInput={onGrapherUrlUpdate}
        variant="border"
      />
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

export default render(Plugin);
