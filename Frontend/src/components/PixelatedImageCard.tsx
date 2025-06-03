import { useEffect } from 'react';
import gsap from 'gsap';

interface PixelatedImageCardProps {
  defaultImage: string;
  activeImage: string;
  width?: number;
  height?: number;
}

const PixelatedImageCard = ({ defaultImage, activeImage, width = 400, height = 400 }: PixelatedImageCardProps) => {
  useEffect(() => {
    const animationStepDuration = 0.3;
    const gridSize = 7;
    const pixelSize = 100 / gridSize;
    
    const card = document.querySelector('[data-pixelated-image-reveal]');
    const pixelGrid = card?.querySelector('[data-pixelated-image-reveal-grid]');
    const activeCard = card?.querySelector('[data-pixelated-image-reveal-active]');
    
    if (!card || !pixelGrid || !activeCard) return;

    // Remove existing pixels
    const existingPixels = pixelGrid.querySelectorAll('.pixelated-image-card__pixel');
    existingPixels.forEach(pixel => pixel.remove());

    // Create pixel grid
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixelated-image-card__pixel');
        pixel.style.width = `${pixelSize}%`;
        pixel.style.height = `${pixelSize}%`;
        pixel.style.left = `${col * pixelSize}%`;
        pixel.style.top = `${row * pixelSize}%`;
        pixelGrid.appendChild(pixel);
      }
    }

    const pixels = pixelGrid.querySelectorAll('.pixelated-image-card__pixel');
    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;
    let isActive = false;
    let delayedCall: gsap.core.Tween | null = null;

    const animatePixels = (activate: boolean) => {
      isActive = activate;
      gsap.killTweensOf(pixels);
      if (delayedCall) {
        delayedCall.kill();
      }
      
      gsap.set(pixels, { display: 'none' });
      
      gsap.to(pixels, {
        display: 'block',
        duration: 0,
        stagger: {
          each: staggerDuration,
          from: 'random'
        }
      });

      delayedCall = gsap.delayedCall(animationStepDuration, () => {
        if (activate) {
          (activeCard as HTMLElement).style.display = 'block';
          (activeCard as HTMLElement).style.pointerEvents = 'none';
        } else {
          (activeCard as HTMLElement).style.display = 'none';
        }
      });

      gsap.to(pixels, {
        display: 'none',
        duration: 0,
        delay: animationStepDuration,
        stagger: {
          each: staggerDuration,
          from: 'random'
        }
      });
    };

    const isTouchDevice = 'ontouchstart' in window || 
                         navigator.maxTouchPoints > 0 || 
                         window.matchMedia("(pointer: coarse)").matches;

    if (isTouchDevice) {
      card.addEventListener('click', () => {
        animatePixels(!isActive);
      });
    } else {
      card.addEventListener('mouseenter', () => {
        if (!isActive) {
          animatePixels(true);
        }
      });
      card.addEventListener('mouseleave', () => {
        if (isActive) {
          animatePixels(false);
        }
      });
    }

    return () => {
      if (delayedCall) {
        delayedCall.kill();
      }
    };
  }, [defaultImage, activeImage]);

  return (
    <div data-hover="" data-pixelated-image-reveal="" className="pixelated-image-card">
      <div className="before__100"></div>
      <div className="pixelated-image-card__default">
        <img 
          src={defaultImage} 
          width={width} 
          height={height}
          alt="" 
          className="pixelated-image-card__img"
        />
      </div>
      <div data-pixelated-image-reveal-active="" className="pixelated-image-card__active">
        <img 
          src={activeImage} 
          width={width} 
          height={height}
          alt="" 
          className="pixelated-image-card__img"
        />
      </div>
      <div data-pixelated-image-reveal-grid="" className="pixelated-image-card__pixels">
        <div className="pixelated-image-card__pixel"></div>
      </div>
    </div>
  );
};

export default PixelatedImageCard; 