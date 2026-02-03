import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import "./Item.css";
import type { Item } from "../Section";
import clsx from "clsx";
import { Text } from "@mantine/core";

export default function Item({ item }: { item: Item }): ReactNode {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx("item", { ["itemDragging"]: isDragging })}
      {...attributes}
      {...listeners}
    >
      <div>
        <Text>{item.content}</Text>
      </div>
    </div>
  );
}
