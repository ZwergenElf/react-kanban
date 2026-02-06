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
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Item from "./section/item/Item";
import "./App.css";
import { useLocalStorage } from "@mantine/hooks";
import { v4 as uuid } from "uuid";

const sectionsData = [
  {
    id: uuid(),
    name: "todo",
    color: "orange",
  },
  {
    id: uuid(),
    name: "done",
    color: "green",
  },
];

const itemsData = [
  { id: uuid(), content: "Item A1", sectionId: sectionsData[0].id },
  { id: uuid(), content: "Item A2", sectionId: sectionsData[0].id },
  { id: uuid(), content: "Item A3", sectionId: sectionsData[1].id },
  { id: uuid(), content: "Item A4", sectionId: sectionsData[1].id },
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

  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [overlayItemId, setOverlayItemId] = useState<string | null>(null);

  return (
    <MantineProvider defaultColorScheme="dark">
      <DndContext
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
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
              isOverDelete={overId === `delete-${section.id}`}
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
    const { active, over } = event;

    setOverId(over?.id ?? null);
    setOverlayItemId(active.id as string);

    if (!active || !over || active.id === over.id) {
      return;
    }
    const activeIndex = items.findIndex((item) => item.id === active.id);

    const isContainer = over.data.current ? false : true;

    if (isContainer === true) {
      setItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.id === items[activeIndex].id
            ? { ...prevItem, sectionId: over.id as string }
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

  function addItem(sectionId: string) {
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

  function handleDragEnd(event: DragEndEvent) {
    setOverlayItemId(null);
    if (typeof overId === "string" && overId.startsWith("delete")) {
      setItems([...items.filter((item) => item.id !== event.active.id)]);
    }
  }
}
