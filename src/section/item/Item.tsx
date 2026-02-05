import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useState,
  type FormEventHandler,
  type KeyboardEvent,
  type ReactNode,
  type SubmitEvent,
  type SubmitEventHandler,
} from "react";
import "./Item.css";
import type { ItemType } from "../Section";
import clsx from "clsx";
import { Input, Text } from "@mantine/core";

export default function Item({
  item,
  onSubmit,
}: {
  item: ItemType;
  onSubmit?: (item: ItemType) => void;
}): ReactNode {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx("item", { ["itemDragging"]: isDragging })}
      {...attributes}
      {...listeners}
    >
      <form onSubmit={handleSubmit} onDoubleClick={() => setIsEdit(true)}>
        {!isEdit ? (
          <Text>{item.content}</Text>
        ) : (
          <Input name="content" defaultValue={item.content}></Input>
        )}
      </form>
    </div>
  );

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsEdit(!isEdit);

    if (onSubmit === undefined) {
      return;
    }

    onSubmit({
      ...item,
      content: new FormData(event.target).get("content") as string,
    });
  }
}
