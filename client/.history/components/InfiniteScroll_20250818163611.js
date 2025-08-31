import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import "./InfiniteScroll.css";

gsap.registerPlugin(Observer);

export default function InfiniteScroll({
  width = "100%",
  maxHeight = "200px",
  negativeMargin = "-0.5em",
  items = [],
  itemMinWidth = 150,
  isTilted = false,
  tiltDirection = "left",
  autoplay = true,
  autoplaySpeed = 1,
  autoplayDirection = "right",
  pauseOnHover = false,
}) {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  const getTiltTransform = () => {
    if (!isTilted) return "none";
    return tiltDirection === "left"
      ? "rotateY(15deg) skewX(-10deg)"
      : "rotateY(-15deg) skewX(10deg)";
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (items.length === 0) return;

    const divItems = gsap.utils.toArray(container.children);
    if (!divItems.length) return;

    // 👉 Cambiamos altura por ancho
    const firstItem = divItems[0];
    const itemStyle = getComputedStyle(firstItem);
    const itemWidth = firstItem.offsetWidth;
    const itemMarginLeft = parseFloat(itemStyle.marginLeft) || 0;
    const totalItemWidth = itemWidth + itemMarginLeft;
    const totalWidth =
      itemWidth * items.length + itemMarginLeft * (items.length - 1);

    const wrapFn = gsap.utils.wrap(-totalWidth, totalWidth);

    // posicionar los items en fila
    divItems.forEach((child, i) => {
      const x = i * totalItemWidth;
      gsap.set(child, { x });
    });

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
      onChange: ({ deltaX, isDragging, event }) => {
        const d = event.type === "wheel" ? -deltaX : deltaX;
        const distance = isDragging ? d * 5 : d * 10;
        divItems.forEach((child) => {
          gsap.to(child, {
            duration: 0.5,
            ease: "expo.out",
            x: `+=${distance}`,
            modifiers: {
              x: gsap.utils.unitize(wrapFn),
            },
          });
        });
      },
    });

    let rafId;
    if (autoplay) {
      const directionFactor = autoplayDirection === "right" ? 1 : -1;
      const speedPerFrame = autoplaySpeed * directionFactor;

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

      rafId = requestAnimationFrame(tick);

      if (pauseOnHover) {
        const stopTicker = () => rafId && cancelAnimationFrame(rafId);
        const startTicker = () => (rafId = requestAnimationFrame(tick));

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
          rafId && cancelAnimationFrame(rafId);
        };
      }
    }

    return () => {
      observer.kill();
      if (rafId) cancelAnimationFrame(rafId);
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
          style={{
            transform: getTiltTransform(),
          }}
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

