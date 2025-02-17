"use client"
import GridLayout, { ItemCallback, Layout } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { JSX, useEffect, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [boxes, setBoxes] = useState<JSX.Element[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    className: "responsive-grid",
    breakpoints: {lg: 721, sm: 720},
    cols: { lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 },
    layouts: {
      lg: [{ i: "n1739646579199", x: 0, y: 0, w: 10, h: 10 }],
      sm: [{ i: "n1739646579199", x: 0, y: 0, w: 1, h: 1 }],
      // More layouts for other breakpoints...
    },
    onResizeStop: handleItemCallback,
    onDragStop: handleItemCallback
  };

  return (
    <div>
      <button onClick={saveLayout}>Save Layout</button>
      <br/>
      <button onClick={addNewBox}>Add new box</button>
      <ResponsiveGridLayout
        // className="responsive-grid border-black h-screen w-screen"
        // onResizeStop={handleItemCallback}
        // onDragStop={handleItemCallback}
        // cols={lg: 3, md: 3, sm: 2, xs: 1, xxs: 1}
        // rowHeight={30}
        // width={1200}
        // autoSize={true}
        {...responsiveProps}
      >
        {boxes}
      </ResponsiveGridLayout>
    </div>
  );
}