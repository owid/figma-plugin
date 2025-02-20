import {
  VerticalSpace,
  Text,
  Textbox,
  Button,
  Disclosure,
  Toggle,
} from "@create-figma-plugin/ui";
import { Fragment, h, JSX } from "preact";
import { useState } from "preact/hooks";
import { AdvancedOption, AdvancedOptions } from "../types";

const OPTION_LABELS: Record<AdvancedOption, string> = {
  updateChartAreaOnly:
    "Only update the chart area. The header and footer of the chart will remain unchanged",
  beigeBackground: "Beige background",
};

export function Form(props: {
  title: string;
  description: string;
  action: string;
  textInput?: string;
  advancedOptions?: AdvancedOption[];
  onTextInput: () => void;
  onClick: (text: string, options?: AdvancedOptions) => void;
}) {
  const [textInput, setTextInput] = useState(props.textInput ?? "");

  const [isAdvancedSectionOpen, setIsAdvancedSectionOpen] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedOptions>({});

  const handleInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setTextInput(event.currentTarget.value);
    props.onTextInput();
  };

  const handleClick = () => {
    props.onClick(textInput, advancedOptions);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleClick();
    } else if (e.key === "Escape") {
      setTextInput("");
    }
  };

  return (
    <Fragment>
      <VerticalSpace space="medium" />
      <Text style={{ fontWeight: "bold" }}>{props.title}</Text>
      <VerticalSpace space="small" />
      <Text>{props.description}</Text>
      <VerticalSpace space="medium" />
      <Textbox
        value={textInput}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Narrative chart slug, Grapher, or Explorer URL"
        variant="border"
      />
      <VerticalSpace space="medium" />
      <Button onClick={handleClick} disabled={!textInput}>
        {props.action}
      </Button>
      <VerticalSpace space="small" />

      <Disclosure
        onClick={() => setIsAdvancedSectionOpen(!isAdvancedSectionOpen)}
        open={isAdvancedSectionOpen}
        title="Advanced options"
      >
        {props.advancedOptions?.map((option) => (
          <Fragment key={option}>
            <Toggle
              onChange={(event) =>
                setAdvancedOptions((options) => ({
                  ...options,
                  [option]: event.currentTarget.checked,
                }))
              }
              value={advancedOptions[option] ?? false}
            >
              <Text>{OPTION_LABELS[option]}</Text>
            </Toggle>
            <VerticalSpace space="extraSmall" />
          </Fragment>
        ))}
      </Disclosure>
    </Fragment>
  );
}
