import {
  Button,
  Columns,
  Container,
  Muted,
  render,
  Text,
  Textbox,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import {
  CloseHandler,
  CreateNewDataInsightPageHandler,
  UpdateChartHandler,
} from "./types";

function Plugin() {
  const [grapherUrl, setGrapherUrl] = useState("");

  const onCreateNewDataInsightPage = useCallback(
    () =>
      emit<CreateNewDataInsightPageHandler>(
        "CREATE_NEW_DATA_INSIGHT_PAGE",
        grapherUrl,
      ),
    [grapherUrl],
  );

  const onUpdateChart = useCallback(
    () => emit<UpdateChartHandler>("UPDATE_CHART", grapherUrl),
    [grapherUrl],
  );

  const onClose = useCallback(function () {
    emit<CloseHandler>("CLOSE");
  }, []);

  return (
    <Container space="medium" onClose={onClose}>
      <VerticalSpace space="large" />
      <Text>
        <Muted>Grapher URL</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Textbox
        value={grapherUrl}
        onValueInput={setGrapherUrl}
        variant="border"
      />
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        <Button fullWidth onClick={onCreateNewDataInsightPage}>
          Create DI
        </Button>
        <Button fullWidth onClick={onUpdateChart} secondary>
          Update chart
        </Button>
      </Columns>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin);
