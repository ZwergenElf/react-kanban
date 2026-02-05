import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, type ReactNode } from "react";
import Item from "./item/Item";
import { useDroppable } from "@dnd-kit/core";
import { Card, ColorPicker, Grid, HoverCard } from "@mantine/core";
import "./Section.css";

export interface SectionType {
  id: number;
  color: string;
  name: string;
}

export interface ItemType {
  id: string;
  content: string;
  sectionId: number;
}

function Section({
  section,
  items,
  onColorChange,
  onAddItem,
  onItemSubmit,
}: {
  section: SectionType;
  items: ItemType[];
  onColorChange: (section: SectionType) => void;
  onAddItem: (sectionId: number) => void;
  onItemDoubleClick?: () => void;
  onItemSubmit?: (item: ItemType) => void;
}): ReactNode {
  useEffect(() => console.log("react"));
  const { setNodeRef } = useDroppable({
    id: section.id,
  });
  return (
    <Card h={"100%"} style={{ overflow: "visible" }}>
      <Card.Section py="xs">
        <Grid justify="left" align="center">
          <Grid.Col span="content">{section.name}</Grid.Col>
        </Grid>
        <HoverCard width={280} shadow="md">
          <HoverCard.Target>
            <div
              style={{
                width: "100%",
                height: 5,
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
          <div className="add-overlay" onClick={() => onAddItem(section.id)}>
            +
          </div>
        </div>
      </SortableContext>
    </Card>
  );
}

export default Section;
