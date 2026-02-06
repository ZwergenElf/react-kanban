import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type ReactNode } from "react";
import Item from "./item/Item";
import { useDroppable } from "@dnd-kit/core";
import { alpha, Card, ColorPicker, Grid, HoverCard } from "@mantine/core";
import "./Section.css";

export interface SectionType {
  id: string;
  color: string;
  name: string;
}

export interface ItemType {
  id: string;
  content: string;
  sectionId: string;
}

function Section({
  section,
  items,
  isOverDelete,
  onColorChange,
  onAddItem,
  onItemSubmit,
}: {
  section: SectionType;
  items: ItemType[];
  isOverDelete: boolean;
  onColorChange: (section: SectionType) => void;
  onAddItem: (sectionId: string) => void;
  onItemDoubleClick?: () => void;
  onItemSubmit?: (item: ItemType) => void;
}): ReactNode {
  const { setNodeRef } = useDroppable({
    id: section.id,
  });

  const { setNodeRef: setDeleteNodeRef } = useDroppable({
    id: `delete-${section.id}`,
  });
  return (
    <Card h={"100%"} style={{ overflow: "visible" }}>
      <Card.Section mb="sm">
        <Grid align="center" m="sm">
          <Grid.Col tt="capitalize">{section.name}</Grid.Col>
        </Grid>
        <HoverCard shadow="md">
          <HoverCard.Target>
            <div
              style={{
                width: "100%",
                height: 4,
                backgroundColor: section.color,
              }}
            ></div>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <ColorPicker
              value={section.color}
              onChange={(color) => onColorChange({ ...section, color })}
            />
          </HoverCard.Dropdown>
        </HoverCard>
      </Card.Section>

      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div style={{ height: "100%" }} ref={setNodeRef}>
          {items.map((item) => (
            <Item onSubmit={onItemSubmit} key={item.id} item={item}></Item>
          ))}
          <div className="action-overlay" onClick={() => onAddItem(section.id)}>
            +
          </div>
        </div>
        <div
          ref={setDeleteNodeRef}
          style={{
            bottom: 0,
            backgroundColor: isOverDelete
              ? "var(--mantine-color-red-light)"
              : alpha("var(--mantine-color-red-light)", 0.4),
          }}
          className="action-overlay"
        >
          Delete
        </div>
      </SortableContext>
    </Card>
  );
}

export default Section;
