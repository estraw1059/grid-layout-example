"use client"
import GridLayout, { ItemCallback, Layout } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { JSX, useEffect, useState } from "react";
import layoutData from "./layout.json";


export default function Home() {
  const layout: Layout[] = layoutData;

  const [boxes, setBoxes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const newBoxes = layout.map(item => (
      <div key={item.i} className="border border-black">{item.i}</div>
    ));
    setBoxes(newBoxes);
  }, [layout]);


  const addNewBox = () => {
    layout.push({
      i: "n" + new Date().getTime(),
      x: (layout.length * 2) % (12 - 2),
      y: Infinity, // puts it at the bottom
      w: 2,
      h: 2
    });
    const newBoxes = layout.map(item => (
      <div key={item.i} className="border border-black">{item.i}</div>
    ));
    setBoxes(newBoxes);
  };


  const handleItemCallback: ItemCallback = (
    layout: Layout[],
    oldItem: Layout,
    newItem: Layout,
    placeholder: Layout,
    event: MouseEvent,
    element: HTMLElement
  ) => {
    console.log("Layout:", layout);
    console.log("Old Item:", oldItem);
    console.log("New Item:", newItem);
    console.log("Placeholder:", placeholder);
    console.log("Event:", event);
    console.log("Element:", element);
  };
  return (
    <div>
      <button onClick={addNewBox}>Add new box</button>
      <GridLayout
        className="layout border-black"
        onResizeStop={handleItemCallback}
        onDragStop={handleItemCallback}
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        {boxes}
      </GridLayout>
    </div>
  );
}
