// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { MantineProvider, SimpleGrid } from "@mantine/core";
import Section, {
  type ItemType,
  type SectionType as SectionType,
} from "./section/Section";
import { useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Item from "./section/item/Item";
import "./App.css";
import { useLocalStorage } from "@mantine/hooks";
import { v4 as uuid } from "uuid";

const sectionsData = [
  {
    id: 0,
    name: "todo",
    color: "orange",
  },
  {
    id: 1,
    name: "done",
    color: "green",
  },
];

const itemsData = [
  { id: uuid(), content: "Item A1", sectionId: 0 },
  { id: uuid(), content: "Item A2", sectionId: 0 },
  { id: uuid(), content: "Item A3", sectionId: 1 },
  { id: uuid(), content: "Item A4", sectionId: 1 },
];

export default function App() {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  );

  const [sections, setSections] = useLocalStorage({
    key: "sections",
    defaultValue: sectionsData,
  });
  const [items, setItems] = useLocalStorage({
    key: "items",
    defaultValue: itemsData,
  });
  const [overlayItemId, setOverlayItemId] = useState<string | null>(null);

  return (
    <MantineProvider defaultColorScheme="dark">
      <DndContext
        onDragOver={handleDragOver}
        collisionDetection={closestCenter}
        sensors={sensors}
      >
        <SimpleGrid cols={sections.length} spacing="lg" h={"100vh"} p="md">
          {sections.map((section) => (
            <Section
              key={section.id}
              section={section}
              items={items.filter((item) => item.sectionId === section.id)}
              onColorChange={setSectionColor}
              onAddItem={addItem}
              onItemSubmit={updateItem}
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

    if (!active || !over || active.id === over.id) {
      return;
    }

    const activeIndex = items.findIndex((item) => item.id === active.id);

    const isContainer = over.data.current ? false : true;

    if (isContainer === true) {
      setItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.id === items[activeIndex].id
            ? { ...prevItem, sectionId: Number(over.id) }
            : prevItem
        )
      );
    } else {
      const overIndex = items.findIndex((item) => item.id === over.id);
      setItems((prevItems) => {
        prevItems[activeIndex].sectionId = prevItems[overIndex].sectionId;
        return arrayMove(prevItems, activeIndex, overIndex);
      });
    }

    setOverlayItemId(active.id as string);
  }

  function setSectionColor(section: SectionType) {
    setSections((prevSections) =>
      prevSections.map((prevSection) => {
        if (prevSection.id !== section.id) {
          return prevSection;
        }
        return section;
      })
    );
  }

  function addItem(sectionId: number) {
    setItems([...items, { id: uuid(), content: "New Item", sectionId }]);
  }

  function updateItem(item: ItemType) {
    setItems((prevItems) =>
      prevItems.map((prevItem) => {
        if (prevItem.id !== item.id) {
          return prevItem;
        }
        return item;
      })
    );
  }
}
