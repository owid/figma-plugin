import { VerticalSpace, Text, Textbox, Button } from "@create-figma-plugin/ui";
import { Fragment, h, JSX } from "preact";
import { useState } from "preact/hooks";

export function Form(props: {
  title: string;
  description: string;
  action: string;
  textInput?: string;
  onTextInput: () => void;
  onClick: (text: string) => void;
}) {
  const [textInput, setTextInput] = useState(props.textInput ?? "");

  const handleInput = (event: JSX.TargetedEvent<HTMLInputElement>) => {
    setTextInput(event.currentTarget.value);
    props.onTextInput();
  };

  const handleClick = () => {
    props.onClick(textInput);
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
      <h2 style={{ fontSize: 13, fontWeight: "bold" }}>{props.title}</h2>
      <VerticalSpace space="small" />
      <Text>{props.description}</Text>
      <VerticalSpace space="large" />
      <Textbox
        value={textInput}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Narrative chart slug, Grapher, or Explorer URL"
        variant="border"
      />
      <VerticalSpace space="large" />
      <Button onClick={handleClick} disabled={!textInput}>
        {props.action}
      </Button>
    </Fragment>
  );
}
