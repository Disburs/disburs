"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; z: number };

export default function AnimatedCube() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯";
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const s = 0.85;
    const V: P[] = [
      { x: -s, y: -s, z: -s },
      { x: s, y: -s, z: -s },
      { x: s, y: s, z: -s },
      { x: -s, y: s, z: -s },
      { x: -s, y: -s, z: s },
      { x: s, y: -s, z: s },
      { x: s, y: s, z: s },
      { x: -s, y: s, z: s },
    ];
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    const faces = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [0, 1, 5, 4],
      [2, 3, 7, 6],
      [1, 2, 6, 5],
      [0, 3, 7, 4],
    ];

    const rotY = (p: P, a: number): P => ({
      x: p.x * Math.cos(a) - p.z * Math.sin(a),
      y: p.y,
      z: p.x * Math.sin(a) + p.z * Math.cos(a),
    });
    const rotX = (p: P, a: number): P => ({
      x: p.x,
      y: p.y * Math.cos(a) - p.z * Math.sin(a),
      z: p.y * Math.sin(a) + p.z * Math.cos(a),
    });
    const rotZ = (p: P, a: number): P => ({
      x: p.x * Math.cos(a) - p.y * Math.sin(a),
      y: p.x * Math.sin(a) + p.y * Math.cos(a),
      z: p.z,
    });
    const spin = (p: P): P => rotZ(rotX(rotY(p, time * 0.4), time * 0.3), time * 0.2);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const scale = Math.min(rect.width, rect.height) * 0.3;

      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const pts: { x: number; y: number; z: number; char: string }[] = [];

      const push = (p: P) => {
        const r = spin(p);
        const depth = Math.max(0, Math.min(1, (r.z + 1.5) / 3));
        const ci = Math.floor(depth * (chars.length - 1));
        pts.push({ x: cx + r.x * scale, y: cy - r.y * scale, z: r.z, char: chars[ci] });
      };

      edges.forEach(([i, j]) => {
        for (let t = 0; t <= 1; t += 0.11) {
          push({
            x: V[i].x + (V[j].x - V[i].x) * t,
            y: V[i].y + (V[j].y - V[i].y) * t,
            z: V[i].z + (V[j].z - V[i].z) * t,
          });
        }
      });

      faces.forEach(([a, b, c, d]) => {
        for (let u = 0; u <= 1; u += 0.12) {
          for (let v = 0; v <= 1; v += 0.12) {
            push({
              x: V[a].x * (1 - u) * (1 - v) + V[b].x * u * (1 - v) + V[c].x * u * v + V[d].x * (1 - u) * v,
              y: V[a].y * (1 - u) * (1 - v) + V[b].y * u * (1 - v) + V[c].y * u * v + V[d].y * (1 - u) * v,
              z: V[a].z * (1 - u) * (1 - v) + V[b].z * u * (1 - v) + V[c].z * u * v + V[d].z * (1 - u) * v,
            });
          }
        }
      });

      pts.sort((p1, p2) => p1.z - p2.z);

      pts.forEach((p) => {
        const front = Math.max(0, Math.min(1, (p.z + 1.5) / 3));
        const alpha = 0.16 + front * 0.5;
        ctx.fillStyle =
          front > 0.5 ? `rgba(18, 255, 128, ${alpha})` : `rgba(10, 146, 0, ${alpha})`;
        ctx.fillText(p.char, p.x, p.y);
      });

      time += 0.015;
      if (!reduce) frameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" style={{ display: "block" }} />;
}
