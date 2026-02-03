// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { MantineProvider, SimpleGrid } from "@mantine/core";
import Section, { type Item as ItemType } from "./section/Section";
import { useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import Item from "./section/item/Item";
import "./App.css";

const sectionsData = [
  {
    id: 0,
    name: "todo",
  },
  {
    id: 1,
    name: "done",
  },
];

const itemsData = [
  { id: "A1", content: "Item A1", sectionId: 0 },
  { id: "A2", content: "Item A2", sectionId: 0 },
  { id: "A3", content: "Item A3", sectionId: 1 },
  { id: "A4", content: "Item A4", sectionId: 1 },
];

export default function App() {
  const [sections] = useState(sectionsData);
  const [items, setItems] = useState(itemsData);
  const [overlayItemId, setOverlayItemId] = useState<string | null>(null);

  return (
    <MantineProvider defaultColorScheme="dark">
      <DndContext
        onDragOver={handleDragOver}
        collisionDetection={closestCenter}
      >
        <SimpleGrid cols={sections.length} spacing="lg" h={"100vh"} p="md">
          {sections.map((section) => (
            <Section
              key={section.id}
              id={section.id}
              color="var(--mantine-color-yellow-5)"
              items={items.filter((item) => item.sectionId === section.id)}
            />
          ))}
        </SimpleGrid>
        <DragOverlay>
          {overlayItemId ? (
            <Item item={items.filter((item) => item.id === overlayItemId)[0]} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </MantineProvider>
  );

  function handleDragOver(event: DragOverEvent) {
    console.log("Drag over", event);
    const { active, over } = event;

    if (!active || !over) {
      return;
    }
    const item = items.find((i) => i.id === active.id);

    if (!item) {
      return;
    }

    const overId = over.id;
    const isContainer = over.data.current ? false : true;

    if (isContainer === true) {
      setItems((prevItems) =>
        prevItems.map((i) =>
          i.id === item.id ? { ...i, sectionId: Number(overId) } : i
        )
      );
    }

    setOverlayItemId(active.id as string);
  }
}
