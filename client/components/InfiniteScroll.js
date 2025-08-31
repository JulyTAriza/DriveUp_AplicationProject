"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import "./InfiniteScroll.css";

gsap.registerPlugin(Observer);

export default function InfiniteScroll({
  width = "100%",
  maxHeight = "200px",
  negativeMargin = "0.75rem", // separación entre cards
  items = [],                 // [{ content: <CarCard .../> }, ...]
  itemMinWidth = 280,         // ancho mínimo de cada ítem
  isTilted = false,
  tiltDirection = "left",
  autoplay = true,
  autoplaySpeed = 1,          // px por frame aprox. (ajusta velocidad)
  autoplayDirection = "right",
  pauseOnHover = true,
}) {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  const getTiltTransform = () => {
    if (!isTilted) return "none";
    return tiltDirection === "left"
      ? "rotateY(12deg) skewX(-6deg)"
      : "rotateY(-12deg) skewX(6deg)";
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!items || items.length === 0) return;

    const divItems = gsap.utils.toArray(container.children);
    if (!divItems.length) return;

    // Calcular ancho de cada item y total de la “tira”
    const firstItem = divItems[0];
    const itemStyle = getComputedStyle(firstItem);
    const itemWidth = firstItem.offsetWidth;
    const itemMarginLeft = parseFloat(itemStyle.marginLeft) || 0;
    const totalItemWidth = itemWidth + itemMarginLeft;
    const totalWidth = itemWidth * items.length + itemMarginLeft * (items.length - 1);

    // Posicionar items en fila (x escalonado)
    divItems.forEach((child, i) => {
      const x = i * totalItemWidth;
      gsap.set(child, { x });
    });

    // Función wrap para loop infinito horizontal
    const wrapFn = gsap.utils.wrap(-totalWidth, totalWidth);

    // Interacción: rueda/drag → mueve horizontal
    const observer = Observer.create({
      target: container,
      type: "wheel,touch,pointer",
      preventDefault: true,
      onPress: ({ target }) => {
        target.style.cursor = "grabbing";
      },
      onRelease: ({ target }) => {
        target.style.cursor = "grab";
      },
      onChange: ({ deltaX, deltaY, isDragging, event }) => {
        // Rueda vertical → movimiento horizontal
        const base = event.type === "wheel" ? -deltaY : deltaX;
        const distance = isDragging ? base * 5 : base * 10;
        divItems.forEach((child) => {
          gsap.to(child, {
            duration: 0.4,
            ease: "power3.out",
            x: `+=${distance}`,
            modifiers: {
              x: gsap.utils.unitize(wrapFn),
            },
          });
        });
      },
    });

    // Autoplay continuo
    let rafId = null;
    if (autoplay) {
      const dir = autoplayDirection === "right" ? 1 : -1;
      const speedPerFrame = autoplaySpeed * dir;

      const tick = () => {
        divItems.forEach((child) => {
          gsap.set(child, {
            x: `+=${speedPerFrame}`,
            modifiers: {
              x: gsap.utils.unitize(wrapFn),
            },
          });
        });
        rafId = requestAnimationFrame(tick);
      };

      const startTicker = () => {
        if (rafId == null) rafId = requestAnimationFrame(tick);
      };
      const stopTicker = () => {
        if (rafId != null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      startTicker();

      if (pauseOnHover) {
        container.addEventListener("mouseenter", stopTicker);
        container.addEventListener("mouseleave", startTicker);

        return () => {
          observer.kill();
          stopTicker();
          container.removeEventListener("mouseenter", stopTicker);
          container.removeEventListener("mouseleave", startTicker);
        };
      } else {
        return () => {
          observer.kill();
          stopTicker();
        };
      }
    }

    // Limpieza si autoplay está off
    return () => {
      observer.kill();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [
    items,
    autoplay,
    autoplaySpeed,
    autoplayDirection,
    pauseOnHover,
    isTilted,
    tiltDirection,
    negativeMargin,
  ]);

  return (
    <>
      <style>
        {`
        .infinite-scroll-wrapper {
          max-width: ${width};
          max-height: ${maxHeight};
          overflow: hidden;
        }
        .infinite-scroll-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          will-change: transform;
        }
        .infinite-scroll-item {
          min-width: ${itemMinWidth}px;
          margin-left: ${negativeMargin};
          flex-shrink: 0;
        }
        `}
      </style>

      <div className="infinite-scroll-wrapper" ref={wrapperRef}>
        <div
          className="infinite-scroll-container"
          ref={containerRef}
          style={{ transform: getTiltTransform() }}
        >
          {items.map((item, i) => (
            <div className="infinite-scroll-item" key={i}>
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
