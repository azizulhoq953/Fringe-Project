
import React, { useState } from 'react';

function App() {
  const [polygons, setPolygons] = useState([]); 
  const [currentPolygon, setCurrentPolygon] = useState([]); 
  const [isDrawing, setIsDrawing] = useState(false);
  const [draggingVertex, setDraggingVertex] = useState(null);
  const handleCanvasClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;

    if (!isDrawing) {
      setIsDrawing(true);
      setCurrentPolygon([{ x: offsetX, y: offsetY }]);
    } else {
      const newVertex = { x: offsetX, y: offsetY };
      const distance = Math.sqrt(
        (newVertex.x - currentPolygon[0]?.x) ** 2 + (newVertex.y - currentPolygon[0]?.y) ** 2
      );

      if (distance < 10 && currentPolygon.length > 2) {
        setPolygons([...polygons, currentPolygon]);
        setCurrentPolygon([]);
        setIsDrawing(false);
      } else {
        setCurrentPolygon([...currentPolygon, newVertex]);
      }
    }
  };

  const handleMouseMove = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;

    if (draggingVertex) {
      const { polygonIndex, vertexIndex } = draggingVertex;
      const updatedPolygons = polygons.map((polygon, pIndex) => {
        if (pIndex !== polygonIndex) return polygon;

        return polygon.map((point, vIndex) =>
          vIndex === vertexIndex ? { x: offsetX, y: offsetY } : point
        );
      });

      setPolygons(updatedPolygons);
    } else if (isDrawing && currentPolygon.length > 0) {
      const updatedPolygon = [...currentPolygon.slice(0, -1), { x: offsetX, y: offsetY }];
      setCurrentPolygon(updatedPolygon);
    }
  };

  const handleMouseDown = (polygonIndex, vertexIndex) => {
    setDraggingVertex({ polygonIndex, vertexIndex });
  };

  const handleDoubleClick = (polygonIndex, vertexIndex) => {
    const updatedPolygons = polygons.map((polygon, pIndex) => {
      if (pIndex !== polygonIndex) return polygon;

      return polygon.filter((_, vIndex) => vIndex !== vertexIndex);
    });

    setPolygons(updatedPolygons);
  };

  const handleMouseUp = () => {
    setDraggingVertex(null);
  };

  return (
    <div className="App">
      <svg
        className="drawing-area"
        width="100%"
        height="100vh"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}
      >
        {polygons.map((polygon, polygonIndex) => (
          <g key={polygonIndex}>
            <polygon
              points={polygon.map(({ x, y }) => `${x},${y}`).join(' ')}
              fill="rgba(0, 128, 255, 0.3)" 
              stroke="blue"
            />
            {polygon.map((point, vertexIndex) => (
              <circle
                key={vertexIndex}
                cx={point.x}
                cy={point.y}
                r="8"
                fill="rgba(0, 0, 0, 0.5)" 
                style={{ cursor: 'pointer' }}
                onMouseDown={() => handleMouseDown(polygonIndex, vertexIndex)}
                onDoubleClick={() => handleDoubleClick(polygonIndex, vertexIndex)} 
              />
            ))}
          </g>
        ))}
        {isDrawing && currentPolygon.length > 0 && (
          <>
            <polyline
              points={currentPolygon.map(({ x, y }) => `${x},${y}`).join(' ')}
              fill="none"
              stroke="gray"
              strokeDasharray="5,5"
            />
            {currentPolygon.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="8"
                fill="rgba(0, 0, 0, 0.5)" 
                style={{ cursor: 'pointer' }}
              />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}

export default App;
