'use client';

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  freq: number;
}

export function AstroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);

  // Parallax state
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });
  const mouseEnabled = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = 1;
    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0;
    let R = 0;

    // ── Use window directly, not parentElement ──
    // parentElement is fixed inset-0 so getBoundingClientRect is unreliable
    // after resize. Read innerWidth/innerHeight instead.
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      W = vw * dpr;
      H = vh * dpr;

      canvas.width  = W;
      canvas.height = H;
      canvas.style.width  = `100%`;
      canvas.style.height = `100%`;

      cx = W / 2;
      cy = H / 2;

      // On mobile portrait the viewport is narrow — use the LARGER dimension
      // so the wheel always feels full and atmospheric, not tiny.
      // On desktop use the classic min approach.
      const isMobilePortrait = vw < 768 && vh > vw;
      R = isMobilePortrait
        ? (Math.max(W, H) / 2) * 0.72   // fills ~72% of the long axis
        : (Math.min(W, H) / 2) * 1.05;  // slightly larger than before on desktop

      // Rebuild stars proportional to viewport area
      const starCount = Math.floor((vw * vh) / 8000); // ~110 on 1080p, ~40 on 375px mobile
      starsRef.current = Array.from({ length: Math.min(starCount, 160) }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 * dpr,
        baseOpacity: Math.random() * 0.35 + 0.08,
        freq: Math.random() * 0.02 + 0.005,
      }));
    };

    // ── Debounced resize to avoid thrashing ──
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 60);
    };

    window.addEventListener('resize', onResize);
    resize();

    // ── Parallax Event Listeners ──
    const handleMouseMove = (e: MouseEvent) => {
      mouseEnabled.current = true;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      // Invert movement so it feels like looking through a window
      targetOffset.current = { x: -nx * 35, y: -ny * 35 };
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      // Ignore gyro if user is actively using a mouse (desktop)
      if (!mouseEnabled.current && e.gamma !== null && e.beta !== null) {
        // gamma: left-to-right tilt (-90 to 90)
        // beta: front-to-back tilt, ~45 is standard holding angle
        const nx = Math.max(-1, Math.min(1, e.gamma / 45));
        const ny = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
        targetOffset.current = { x: -nx * 25, y: -ny * 25 };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    // Note: iOS requires permission for DeviceOrientation, but Android usually doesn't.
    // We add it passively here to enhance devices that support it immediately.
    window.addEventListener('deviceorientation', handleDeviceOrientation);

    const img = new Image();
    img.src = '/astro-wheel.png';
    let imgLoaded = false;
    img.onload = () => { imgLoaded = true; };

    const drawRing = (r: number, alpha: number, dash: number[], lineWidth: number) => {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201, 146, 42, ${alpha})`;
      ctx.lineWidth = lineWidth * dpr;
      ctx.setLineDash(dash.map((d) => d * dpr));
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const draw = () => {
      frameRef.current++;
      const frame = frameRef.current;

      ctx.clearRect(0, 0, W, H);

      // ── Parallax LERP ──
      // Smoothly interpolate current offset towards target offset
      currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * 0.04;
      currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * 0.04;
      const { x: px, y: py } = currentOffset.current;

      // 1. Ambient glow — purple tint
      // Shift the glow slightly with parallax
      const grad = ctx.createRadialGradient(cx + px * 0.2, cy + py * 0.2, 0, cx + px * 0.2, cy + py * 0.2, R * 1.2);
      grad.addColorStop(0,    'rgba(123, 94, 167, 0.09)');
      grad.addColorStop(0.45, 'rgba(123, 94, 167, 0.04)');
      grad.addColorStop(1,    'rgba(123, 94, 167, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // 2. Star field
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(frame * star.freq);
        const opacity = star.baseOpacity + twinkle * 0.07;
        
        // Stars are in the deep background, they move slowly
        const sx = star.x + px * 0.3;
        const sy = star.y + py * 0.3;

        ctx.beginPath();
        ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, opacity)})`;
        ctx.fill();
      });

      ctx.save();
      // The main astro wheel is foreground, moves more drastically
      ctx.translate(cx + px * 0.9, cy + py * 0.9);

      // 3. Astro wheel image
      if (imgLoaded) {
        ctx.save();
        const rImgRot = frame * 0.00012;
        ctx.rotate(rImgRot);
        // imgSize is always derived from the current R which updates on resize
        const imgSize = R * 1.8;
        ctx.globalAlpha = 0.12;
        ctx.drawImage(img, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // 4. Planet orbits — all radii derived from R so they rescale automatically
      const planets = [
        { tamil: 'சூ', radius: R * 0.22, speed:  0.00022, color: '#f2c96a', dot: 4 },
        { tamil: 'ச',  radius: R * 0.41, speed: -0.00014, color: '#c0a0e0', dot: 3.5 },
        { tamil: 'கு', radius: R * 0.575, speed:  0.00009, color: '#7ec8c8', dot: 3 },
        { tamil: 'செ', radius: R * 0.695, speed: -0.00019, color: '#e07070', dot: 3 },
      ];

      planets.forEach((p) => {
        drawRing(p.radius, 0.10, [], 0.5);

        const angle = frame * p.speed;
        const x = Math.cos(angle) * p.radius;
        const y = Math.sin(angle) * p.radius;

        const pGrad = ctx.createRadialGradient(x, y, 0, x, y, 10 * dpr);
        pGrad.addColorStop(0, p.color + '99');
        pGrad.addColorStop(1, p.color + '00');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(x, y, 10 * dpr, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, p.dot * dpr, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = `${8 * dpr}px "Anek Tamil", sans-serif`;
        ctx.fillStyle = p.color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.tamil, x + (p.dot + 4) * dpr, y);
      });

      // 5. Center pulse
      const pulse = 0.5 + 0.5 * Math.sin(frame * 0.025);
      const pulseRingR = (12 + pulse * 4) * dpr;
      ctx.beginPath();
      ctx.arc(0, 0, pulseRingR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(201, 146, 42, ${0.15 + pulse * 0.15})`;
      ctx.lineWidth = 1 * dpr;
      ctx.stroke();

      const glowR = 4 * dpr;
      ctx.beginPath();
      ctx.arc(0, 0, glowR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 146, 42, ${0.7 + pulse * 0.3})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 2 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = '#f2c96a';
      ctx.fill();

      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
