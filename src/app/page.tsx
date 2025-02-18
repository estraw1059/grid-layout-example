"use client"
import { ItemCallback, Layout } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { JSX, useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";


const ResponsiveGridLayout = WidthProvider(Responsive);
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
    console.log("Item was moved", newLayout);
    setLayout(newLayout);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const responsiveProps = {
    className: "layout",
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 12, md: 12, sm: 6, xs: 3, xxs: 1 },
    layouts: {
      lg: layout,
      // More layouts for other breakpoints...
    },
    onResizeStop: handleItemCallback,
    onDragStop: handleItemCallback
  };

  return (
    <div>
      <div className="flex flex-row">
        <button className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={saveLayout}>Save Layout</button>
        <button className="m-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={addNewBox}>Add new article</button>
      </div>
      <div>
        <ResponsiveGridLayout
          // className="responsive-grid border-black h-screen w-screen"
          // onResizeStop={handleItemCallback}
          // onDragStop={handleItemCallback}
          // cols={lg: 3, md: 3, sm: 2, xs: 1, xxs: 1}
          rowHeight={30}
          // autoSize={true}
          {...responsiveProps}
        >
          {boxes}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
}