import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, type ReactNode } from "react";
import "./Item.css";
import type { Item } from "../Section";
import clsx from "clsx";
import { Input, Text } from "@mantine/core";

export default function Item({
  item,
  onDoubleClick,
}: {
  item: Item;
  onDoubleClick?: () => void;
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
      <div onDoubleClick={() => setIsEdit(!isEdit)}>
        {!isEdit ? <Text>{item.content}</Text> : <input></input>}
      </div>
    </div>
  );
}
