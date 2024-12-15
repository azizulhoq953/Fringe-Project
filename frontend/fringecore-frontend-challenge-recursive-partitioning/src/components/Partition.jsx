
import React from "react";
import { observer } from "mobx-react-lite";

const Partition = observer(({ partition, store }) => {
  const { id, direction, children, color } = partition;

  const handleSplit = (direction) => {
    store.splitPartition(id, direction);
  };

  if (!children.length) {
    return (
      <div
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: color,
          border: "2px solid #000",
          resize: "both",
          overflow: "auto", 
          minWidth: "50px",
          minHeight: "50px",
        }}
      >
        
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            gap: "5px",
            zIndex: 10,
          }}
        >
          <button onClick={() => handleSplit("v")}>v</button>
          <button onClick={() => handleSplit("h")}>h</button>
          <button onClick={() => store.removePartition(id)}>-</button>
        </div>
      </div>
    );
  }


  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction === "v" ? "row" : "column",
        flex: 1,
        position: "relative",
      }}
    >
      {children.map((child) => (
        <Partition key={child.id} partition={child} store={store} />
      ))}
    </div>
  );
});

export default Partition;
