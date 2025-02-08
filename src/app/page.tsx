"use client"
import GridLayout from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

export default function Home() {
  const layout = [
    { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2 }
  ];
  return (
    <GridLayout
      className="layout border-black"
      autosize={false}
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
    >
      <div key="a" className="border border-black">a</div>
      <div key="b" className="border border-black">b</div>
      <div key="c" className="border border-black">c</div>
    </GridLayout>
  );
}
