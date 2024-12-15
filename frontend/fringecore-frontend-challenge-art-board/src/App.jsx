import React, { useRef, useState, useEffect } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [lines, setLines] = useState([]);


  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#000000";
    context.lineWidth = 5;
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (isErasing) {
      eraseLine(offsetX, offsetY);
    } else {
      setIsDrawing(true);
      setLastPosition({ x: offsetX, y: offsetY });
      setLines([...lines, [{ x: offsetX, y: offsetY }]]);
    }
  };

  const drawOrErase = (e) => {
    if (!isDrawing && !isErasing) return;

    const { offsetX, offsetY } = e.nativeEvent;
    if (isDrawing) {
      const newLines = [...lines];
      const currentLine = newLines[newLines.length - 1];
      currentLine.push({ x: offsetX, y: offsetY });

      setLines(newLines);
      setLastPosition({ x: offsetX, y: offsetY });
      redrawCanvas(newLines);
    } else if (isErasing) {
      eraseLine(offsetX, offsetY);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const eraseLine = (x, y) => {
    const newLines = lines.filter((line) => {
      return !isLineIntersecting(line, x, y);
    });

    setLines(newLines);
    redrawCanvas(newLines);
  };
  const isLineIntersecting = (line, x, y) => {
    for (let i = 0; i < line.length - 1; i++) {
      const segment = [line[i], line[i + 1]];
      if (isPointNearLine(x, y, segment)) {
        return true;
      }
    }
    return false;
  };

  const isPointNearLine = (px, py, segment) => {
    const [p1, p2] = segment;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    const distanceToLine = Math.abs(dy * px - dx * py + p2.x * p1.y - p2.y * p1.x) / lineLength;
    return distanceToLine < 10;
  };
  const redrawCanvas = (lines) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    lines.forEach((line) => {
      context.beginPath();
      context.moveTo(line[0].x, line[0].y);
      line.forEach((point) => {
        context.lineTo(point.x, point.y);
      });
      context.stroke();
    });
  };

  const handleToolChange = (tool) => {
    if (tool === "pen") {
      setIsErasing(false);
    } else if (tool === "erase") {
      setIsErasing(true);
    }
  };

  return (
    <div className="App">
      <div className="toolbar">
        <button onClick={() => handleToolChange("pen")}>Pen</button>
        <button onClick={() => handleToolChange("erase")}>Erase</button>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}  
        height={window.innerHeight} 
        onMouseDown={startDrawing}
        onMouseMove={drawOrErase}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          border: "1px solid black",
          cursor: isErasing ? "crosshair" : "pointer",
        }}
      />
    </div>
  );
}

export default App;
