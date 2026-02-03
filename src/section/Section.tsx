import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, type ReactNode } from "react";
import Item from "./item/Item";
import { useDroppable } from "@dnd-kit/core";
import { Card, ColorPicker, Grid, HoverCard } from "@mantine/core";
export interface Item {
  id: string;
  content: string;
}

function Section({
  id,
  color,
  items,
}: {
  id: number;
  color: string;
  items: Item[];
}): ReactNode {
  const [value, onChange] = useState(color);
  const { setNodeRef } = useDroppable({
    id,
  });
  return (
    <Card h={"100%"} style={{ overflow: "visible" }}>
      <Card.Section py="xs">
        <Grid justify="left" align="center">
          <Grid.Col span="content">Section {id + 1}</Grid.Col>
        </Grid>
        <HoverCard width={280} shadow="md">
          <HoverCard.Target>
            <div
              style={{ width: "100%", height: 5, backgroundColor: value }}
            ></div>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <ColorPicker value={value} onChange={onChange} />
          </HoverCard.Dropdown>
        </HoverCard>
      </Card.Section>

      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div style={{ height: "100%" }} ref={setNodeRef}>
          {items.map((item) => (
            <Item key={item.id} item={item}></Item>
          ))}
        </div>
      </SortableContext>
    </Card>
  );
}

export default Section;
