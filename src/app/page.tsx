"use client"
import GridLayout, { ItemCallback, Layout } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { JSX, useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [boxes, setBoxes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Fetch the latest layout data from the server
    fetch('/api/grid')
      .then(response => response.json())
      .then(data => {
        const gridItems = data.map((item: { i: string }) => (
          <div key={item.i} className="border border-black">{item.i}</div>
        ));
        setBoxes(gridItems);
        setLayout(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching layout:', error);
      });
  }, []);

  const addNewBox = () => {
    const newItem = {
      i: "n" + new Date().getTime(),
      x: (layout.length * 2) % (12 - 2),
      y: Infinity, // puts it at the bottom
      w: 2,
      h: 2
    };
    const newLayout = [...layout, newItem];
    const newBoxes = newLayout.map(item => (
      <div key={item.i} className="border border-black">{item.i}</div>
    ));
    setBoxes(newBoxes);
    setLayout(newLayout);
  };

  const saveLayout = () => {
    console.log("Saving layout:", layout);
    fetch('/api/grid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(layout)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleItemCallback: ItemCallback = (
    newLayout: Layout[],
  ) => {
    setLayout(newLayout);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen w-screen">
      <button onClick={saveLayout}>Save Layout</button>
      <br/>
      <button onClick={addNewBox}>Add new box</button>
      <GridLayout
        className="layouts border-black"
        onResizeStop={handleItemCallback}
        onDragStop={handleItemCallback}
        layout={layout}
        cols={12}
        rowHeight={30}
        width={1200}
        autoSize={true}
      >
        {boxes}
      </GridLayout>
    </div>
  );
}