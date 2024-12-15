import React, { useState, useRef, useEffect } from "react";
import "./App.css"; // Import the CSS file
const App = () => {
  const [ball, setBall] = useState({
    position: { x: null, y: null },
    velocity: { x: 0, y: 0 },
    isMoving: false,
  });
  const canvasRef = useRef(null);
  const ballRadius = 25;
  const gravity = 0.2;
  const friction = 0.98;
  const stopThreshold = 0.1;
  useEffect(() => {
    const initializeBall = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        setBall((prev) => ({
          ...prev,
          position: {
            x: canvas.clientWidth / 2,
            y: canvas.clientHeight / 2,
          }, })); }  };
    initializeBall();
    window.addEventListener("resize", initializeBall);
    return () => window.removeEventListener("resize", initializeBall);
  }, []);
  useEffect(() => {
    if (!ball.isMoving) return;
    const interval = setInterval(() => {
      setBall((prevBall) => {
        const canvas = canvasRef.current;
        const newVelocity = {
          x: prevBall.velocity.x * friction,
          y: prevBall.velocity.y * friction + gravity,
        };
        const newPosition = {
          x: prevBall.position.x + newVelocity.x,
          y: prevBall.position.y + newVelocity.y,
        };
        if (
          newPosition.x - ballRadius <= 0 ||
          newPosition.x + ballRadius >= canvas.clientWidth
        ) {
          newVelocity.x = -newVelocity.x * 0.9;
          newPosition.x =
            newPosition.x - ballRadius <= 0
              ? ballRadius
              : canvas.clientWidth - ballRadius;
        }
        if (newPosition.y - ballRadius <= 0) {
          newVelocity.y = -newVelocity.y * 0.9;
          newPosition.y = ballRadius;
        }
        if (newPosition.y + ballRadius >= canvas.clientHeight - 50) {
          newPosition.y = canvas.clientHeight - ballRadius - 50;
          newVelocity.y = -newVelocity.y * 0.8;
        } const isMoving =
          Math.abs(newVelocity.x) >= stopThreshold ||
          Math.abs(newVelocity.y) >= stopThreshold;
        return {
          ...prevBall,
          position: newPosition,
          velocity: newVelocity,
          isMoving: isMoving,
        };});
    }, 16);
   return () => clearInterval(interval);
  }, [ball.isMoving]);
const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    const velocityX = (clickX - ball.position.x) * 0.5;
    const velocityY = (clickY - ball.position.y) * 0.5;
     setBall((prev) => ({
      ...prev,
      velocity: { x: velocityX, y: velocityY },
      isMoving: true,
    })); };
  return (
    <div ref={canvasRef} className="canvas" onMouseDown={handleMouseDown}>
      <div className="grass-footer" />
      <div
        className="ball"
        style={{
          top: `${ball.position.y - ballRadius}px`,
          left: `${ball.position.x - ballRadius}px`,
        }}  />
      <div className={`instructions ${ball.isMoving ? "hidden" : ""}`}>
        Click to launch ball!
      </div>
    </div>
  );};
export default App;
