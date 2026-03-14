import { useEffect, useRef } from "react";

export const GridBackground = () => {
  const canvasRef = useRef(null);
 
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
 
    const resize = () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
      draw();
    };
    window.addEventListener("resize", resize);
 
    const gapX = 80, gapY = 80;
 
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
 
      const cols = Math.ceil(W / gapX) + 1;
      const rows = Math.ceil(H / gapY) + 1;
 
      ctx.strokeStyle = "rgba(99,102,241,0.04)";
      ctx.lineWidth = 1;
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * gapX, 0);
        ctx.lineTo(c * gapX, H);
        ctx.stroke();
      }
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * gapY);
        ctx.lineTo(W, r * gapY);
        ctx.stroke();
      }
 
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          ctx.beginPath();
          ctx.arc(c * gapX, r * gapY, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(99,102,241,0.12)";
          ctx.fill();
        }
      }
    };
 
    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);
 
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
 