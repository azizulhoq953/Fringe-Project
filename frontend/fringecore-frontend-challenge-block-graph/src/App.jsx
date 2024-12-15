
import React, { useState } from "react";

const Block = ({ block, onAddChild, onDrag }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: block.x,
        top: block.y, 
        width: "100px",
        height: "100px",
        backgroundColor: "rgba(247, 0, 118, 1)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px",
        cursor: "move",
        border: "2px solid black", 
      }}
      onMouseDown={(e) => onDrag(e, block.id)}
    >
      <div>
        <span>{block.id}</span> 
        <br />
        <button
          onClick={() => onAddChild(block.id)}
          style={{
            backgroundColor: "white", 
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

function App() {
  const centerX = window.innerWidth / 2 - 50;
  const centerY = window.innerHeight / 2 - 50;

  const [blocks, setBlocks] = useState([
    { id: 0, x: centerX, y: centerY, parent: null },
  ]);

  const addBlock = (parentId) => {
    const newBlock = {
      id: blocks.length,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      parent: parentId,
    };
    setBlocks([...blocks, newBlock]);
  };

  const dragBlock = (e, id) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const updatedBlocks = blocks.map((block) => {
        if (block.id === id) {
          return { ...block, x: block.x + dx, y: block.y + dy };
        }
        return block;
      });
      setBlocks(updatedBlocks);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const renderConnections = () => {
    return blocks.map((block) => {
      if (block.parent === null) return null;

      const parentBlock = blocks.find((b) => b.id === block.parent);

      return (
        <div
          key={`line-${block.id}`}
          style={{
            position: "absolute",
            left: Math.min(block.x, parentBlock.x) + 50,
            top: Math.min(block.y, parentBlock.y) + 50,
            width: Math.abs(block.x - parentBlock.x),
            height: Math.abs(block.y - parentBlock.y),
            borderLeft: "2px dashed black",
            borderTop: "2px dashed black",
            pointerEvents: "none",
            zIndex: -1,
          }}
        ></div>
      );
    });
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100vw" }}>
      {blocks.map((block) => (
        <Block key={block.id} block={block} onAddChild={addBlock} onDrag={dragBlock} />
      ))}

      {renderConnections()}
    </div>
  );
}

export default App;
