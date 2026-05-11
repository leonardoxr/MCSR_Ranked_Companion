'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { getSkinUrls } from '@/lib/api/avatar-cache';
import type { UUID } from '@/types/api';

export interface PlayerHead3DProps {
  uuid?: UUID;
  username?: string;
  size?: number;
  className?: string;
}

/**
 * PlayerHead3D component for displaying a 3D rotating Minecraft player head
 * Uses CSS 3D transforms to create a beautiful rotating cube effect
 * Similar to the reference site's "outer front" implementation
 * Implements smart caching with daily rotation for efficient loading
 */
export function PlayerHead3D({
  uuid,
  username,
  size = 128,
  className,
}: PlayerHead3DProps) {
  const [rotation, setRotation] = React.useState({ x: 0, y: 0 });
  const [skinUrlIndex, setSkinUrlIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Generate skin URLs with cache versioning - primary Crafatar, fallback Cloudhaven
  const skinUrls = React.useMemo(() => {
    if (!uuid) return [];
    const urls = getSkinUrls(uuid);
    return [urls.primary, urls.fallback];
  }, [uuid]);

  const skinUrl = skinUrls[skinUrlIndex] || null;

  // Reset skin URL index when uuid changes
  React.useEffect(() => {
    setSkinUrlIndex(0);
  }, [uuid]);

  // Preload skin and handle fallback on error
  React.useEffect(() => {
    if (!skinUrl) return;

    const img = new Image();
    img.src = skinUrl;
    img.onerror = () => {
      // Try next URL if available
      if (skinUrlIndex < skinUrls.length - 1) {
        setSkinUrlIndex(prev => prev + 1);
      }
    };
  }, [skinUrl, skinUrlIndex, skinUrls.length]);

  // Global mouse tracking - head always follows mouse cursor
  // Rotation is clamped to ensure eyes/front of face always look at mouse
  // Focal point is the center of the face (eye area), slightly above center
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      // Focal point: center horizontally, but positioned higher (eye area)
      // Eyes are typically at about 35-40% from top of head
      const focalPointX = rect.left + rect.width / 2;
      const focalPointY = rect.top + rect.height * 0.35; // Position for eye area

      // Calculate distance and direction from focal point to mouse
      const deltaX = e.clientX - focalPointX;
      const deltaY = focalPointY - e.clientY; // Inverted Y axis
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Use viewport size as reference for distance normalization
      // This ensures the calculation works correctly at all distances
      const viewportSize = Math.max(window.innerWidth, window.innerHeight);
      const referenceDistance = viewportSize * 0.3; // Reduced for more reactivity
      
      // Calculate rotation angles directly from mouse position
      // Normalize deltas relative to viewport for consistent calculation at all distances
      const normalizedDeltaX = deltaX / viewportSize;
      const normalizedDeltaY = deltaY / viewportSize;
      
      // Calculate desired rotation angles
      // Increased base scale for more reactive movement
      const baseScale = 45; // Increased maximum rotation in degrees for better reaction
      const desiredAngleY = normalizedDeltaX * baseScale;
      const desiredAngleX = normalizedDeltaY * baseScale;
      
      // Scale rotation intensity based on distance
      // Closer mouse = less rotation, further mouse = more rotation (up to full angle)
      // Adjusted curve for more responsive feel
      const normalizedDistance = Math.min(distance / referenceDistance, 1);
      const distanceFactor = Math.pow(normalizedDistance, 0.6); // More responsive curve

      // Apply rotation with clamping
      const maxRotation = 45;
      const minRotation = -45;

      setRotation({
        x: Math.max(minRotation, Math.min(maxRotation, desiredAngleX * distanceFactor)),
        y: Math.max(minRotation, Math.min(maxRotation, desiredAngleY * distanceFactor)),
      });
    };

    // Add global mouse listener
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!skinUrl) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted rounded-md',
          className
        )}
        style={{ width: size, height: size }}
      >
        <span className="text-2xl text-muted-foreground">
          {username?.[0]?.toUpperCase() || '?'}
        </span>
      </div>
    );
  }

  const cubeSize = size * 0.8; // Slightly smaller for better visual effect
  const innerCubeSize = cubeSize * 0.88; // Inner layer is slightly smaller (typical Minecraft ratio)
  // Overlay layer is 0.5px bigger per 8px face = 8.5px/8px = 1.0625x scale
  // Making it larger and positioned further out from each side for better 3D effect
  const overlayCubeSize = cubeSize * 1.125; // Overlay layer is larger (1.125x) for better visibility
  // Position overlay further outward from center - both cubes share the same center point
  // Base cube faces are at cubeSize/2 from center, overlay cube faces are at overlayCubeSize/2 from center
  // Adding a small offset to make the extension more visible while keeping both cubes centered
  const overlayZOffset = overlayCubeSize / 2 + 2; // Position at the edge of the larger cube + offset for better 3D visibility
  
  // Calculate background-size: scale texture so 8 pixels = cubeSize pixels
  // Each face is 8x8 pixels in a 64x64 texture (or top half of 128x128 texture)
  // We want 8 texture pixels to fill cubeSize display pixels
  // Scale factor = cubeSize / 8
  // Scaled texture size = 64 * scale_factor = 64 * (cubeSize / 8) = 8 * cubeSize
  // As percentage of container: (8 * cubeSize) / cubeSize * 100 = 800%
  // When CSS background-size is 800%, the image is 8x the container size
  // So: 64 pixels of texture = 8 * cubeSize pixels
  // Therefore: 1 pixel of texture = cubeSize / 8 pixels
  // Therefore: 8 pixels of texture = cubeSize pixels ✓ (correct!)
  const backgroundSizePercent = 800;
  
  const getBackgroundPosition = (x: number, y: number, faceSize: number = cubeSize) => {
    // When background-size is 800%, the image is 8x the container size
    // To position at texture coordinate (x, y):
    // We want the top-left corner of the 8x8 region at (x, y) to align with container's (0, 0)
    // In the scaled image: pixel position = x * (faceSize / 8)
    // We need to offset by negative this amount to align with container's (0, 0)
    // Using pixel values for precise positioning
    const offsetX = -(x * faceSize / 8);
    const offsetY = -(y * faceSize / 8);
    return `${offsetX}px ${offsetY}px`;
  };
  

  return (
    <div
      ref={containerRef}
      className={cn('relative flex items-center justify-center', className)}
      style={{
        width: size,
        height: size,
        perspective: `${size * 4}px`, // Increased perspective for larger rendering zone
        perspectiveOrigin: 'center center',
      }}
    >
      {/* Single container with both layers */}
      <div
        className="relative head-3d-container"
        style={{
          width: cubeSize,
          height: cubeSize,
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Inner layer - rendered first so outer layer appears on top */}
        {/* Inner layer is slightly smaller and positioned slightly back */}
        <div
          className="absolute head-3d-container"
          style={{
            width: innerCubeSize,
            height: innerCubeSize,
            left: `${(cubeSize - innerCubeSize) / 2}px`,
            top: `${(cubeSize - innerCubeSize) / 2}px`,
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${(cubeSize - innerCubeSize) / 4}px)`, // Position slightly back
          }}
        >
          {/* Inner Front Face - uses (40,8) to (48,16) in 64x64 texture */}
          <Face
            url={skinUrl}
            transform={`rotateY(0deg) translateZ(${innerCubeSize / 2}px)`}
            size={innerCubeSize}
            className="inner front"
            backgroundPosition={getBackgroundPosition(40, 8, innerCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
          />
          {/* Inner Back Face - uses (56,8) to (64,16) in 64x64 texture */}
          <Face
            url={skinUrl}
            transform={`rotateY(180deg) translateZ(${innerCubeSize / 2}px)`}
            size={innerCubeSize}
            className="inner back"
            backgroundPosition={getBackgroundPosition(56, 8, innerCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
          />
          {/* Inner Right Face (rotateY 90deg) - uses (48,8) to (56,16) in 64x64 texture */}
          <Face
            url={skinUrl}
            transform={`rotateY(90deg) translateZ(${innerCubeSize / 2}px)`}
            size={innerCubeSize}
            className="inner right"
            backgroundPosition={getBackgroundPosition(48, 8, innerCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
          />
          {/* Inner Left Face (rotateY -90deg) - uses (32,8) to (40,16) in 64x64 texture */}
          <Face
            url={skinUrl}
            transform={`rotateY(-90deg) translateZ(${innerCubeSize / 2}px)`}
            size={innerCubeSize}
            className="inner left"
            backgroundPosition={getBackgroundPosition(32, 8, innerCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
          />
          {/* Inner Top Face - uses (40,0) to (48,8) in 64x64 texture */}
          <Face
            url={skinUrl}
            transform={`rotateX(90deg) translateZ(${innerCubeSize / 2}px)`}
            size={innerCubeSize}
            className="inner top"
            backgroundPosition={getBackgroundPosition(40, 0, innerCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
          />
          {/* Inner Bottom Face - uses (48,0) to (56,8) in 64x64 texture */}
          <Face
            url={skinUrl}
            transform={`rotateX(-90deg) translateZ(${innerCubeSize / 2}px)`}
            size={innerCubeSize}
            className="inner bottom"
            backgroundPosition={getBackgroundPosition(48, 0, innerCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
          />
        </div>
        
        {/* Outer layer - rendered on top */}
        {/* Outer Front Face - uses (8,8) to (16,16) in 64x64 texture */}
        <Face
          url={skinUrl}
          transform={`rotateY(0deg) translateZ(${cubeSize / 2}px)`}
          size={cubeSize}
          className="outer front"
          backgroundPosition={getBackgroundPosition(8, 8)}
          backgroundSize={`${backgroundSizePercent}%`}
        />
        {/* Outer Back Face - uses (24,8) to (32,16) in 64x64 texture */}
        <Face
          url={skinUrl}
          transform={`rotateY(180deg) translateZ(${cubeSize / 2}px)`}
          size={cubeSize}
          className="outer back"
          backgroundPosition={getBackgroundPosition(24, 8)}
          backgroundSize={`${backgroundSizePercent}%`}
        />
        {/* Outer Right Face (rotateY 90deg) - uses (16,8) to (24,16) in 64x64 texture */}
        <Face
          url={skinUrl}
          transform={`rotateY(90deg) translateZ(${cubeSize / 2}px)`}
          size={cubeSize}
          className="outer right"
          backgroundPosition={getBackgroundPosition(16, 8)}
          backgroundSize={`${backgroundSizePercent}%`}
        />
        {/* Outer Left Face (rotateY -90deg) - uses (0,8) to (8,16) in 64x64 texture */}
        <Face
          url={skinUrl}
          transform={`rotateY(-90deg) translateZ(${cubeSize / 2}px)`}
          size={cubeSize}
          className="outer left"
          backgroundPosition={getBackgroundPosition(0, 8)}
          backgroundSize={`${backgroundSizePercent}%`}
        />
        {/* Outer Top Face - uses (8,0) to (16,8) in 64x64 texture */}
        <Face
          url={skinUrl}
          transform={`rotateX(90deg) translateZ(${cubeSize / 2}px)`}
          size={cubeSize}
          className="outer top"
          backgroundPosition={getBackgroundPosition(8, 0)}
          backgroundSize={`${backgroundSizePercent}%`}
        />
        {/* Outer Bottom Face - uses (16,0) to (24,8) in 64x64 texture */}
        <Face
          url={skinUrl}
          transform={`rotateX(-90deg) translateZ(${cubeSize / 2}px)`}
          size={cubeSize}
          className="outer bottom"
          backgroundPosition={getBackgroundPosition(16, 0)}
          backgroundSize={`${backgroundSizePercent}%`}
        />
        
        {/* Overlay Outer layer (hat/accessories) - rendered LAST so it appears on top */}
        {/* Using INNER coordinates for overlay outer */}
        {/* Overlay outer head: Front (40,8), Back (56,8), Right (48,8), Left (32,8), Top (40,0), Bottom (48,0) */}
        {/* Overlay is larger (1.125x) - wrap in container to ensure proper centering */}
        {/* Both cubes share the same center point, overlay extends outward equally on all sides */}
        <div
          className="absolute head-3d-container"
          style={{
            width: overlayCubeSize,
            height: overlayCubeSize,
            left: `${(cubeSize - overlayCubeSize) / 2}px`, // Center the larger overlay cube
            top: `${(cubeSize - overlayCubeSize) / 2}px`,  // Center the larger overlay cube
            transformStyle: 'preserve-3d',
          }}
        >
          <Face
            url={skinUrl}
            transform={`rotateY(0deg) translateZ(${overlayZOffset}px)`}
            size={overlayCubeSize}
            className="overlay-outer front"
            backgroundPosition={getBackgroundPosition(40, 8, overlayCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
          <Face
            url={skinUrl}
            transform={`rotateY(180deg) translateZ(${overlayZOffset}px)`}
            size={overlayCubeSize}
            className="overlay-outer back"
            backgroundPosition={getBackgroundPosition(56, 8, overlayCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
          <Face
            url={skinUrl}
            transform={`rotateY(90deg) translateZ(${overlayZOffset}px)`}
            size={overlayCubeSize}
            className="overlay-outer right"
            backgroundPosition={getBackgroundPosition(48, 8, overlayCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
          <Face
            url={skinUrl}
            transform={`rotateY(-90deg) translateZ(${overlayZOffset}px)`}
            size={overlayCubeSize}
            className="overlay-outer left"
            backgroundPosition={getBackgroundPosition(32, 8, overlayCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
          <Face
            url={skinUrl}
            transform={`rotateX(90deg) translateZ(${overlayZOffset}px)`}
            size={overlayCubeSize}
            className="overlay-outer top"
            backgroundPosition={getBackgroundPosition(40, 0, overlayCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
          <Face
            url={skinUrl}
            transform={`rotateX(-90deg) translateZ(${overlayZOffset}px)`}
            size={overlayCubeSize}
            className="overlay-outer bottom"
            backgroundPosition={getBackgroundPosition(48, 0, overlayCubeSize)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
        </div>
        
        {/* Overlay Inner layer */}
        <div
          className="absolute head-3d-container"
          style={{
            width: innerCubeSize * 1.0625,
            height: innerCubeSize * 1.0625,
            left: `${(cubeSize - innerCubeSize * 1.0625) / 2}px`,
            top: `${(cubeSize - innerCubeSize * 1.0625) / 2}px`,
            transformStyle: 'preserve-3d',
            transform: `translateZ(-${(cubeSize - innerCubeSize) / 4}px)`,
          }}
        >
          {/* Overlay Inner Front Face - uses OUTER coordinates (8,8) for 64x64 textures */}
          {/* For 64x64 skins, overlay uses same coordinates as base outer layer */}
          <Face
            url={skinUrl}
            transform={`rotateY(0deg) translateZ(${innerCubeSize * 1.0625 / 2}px)`}
            size={innerCubeSize * 1.0625}
            className="overlay-inner front"
            backgroundPosition={getBackgroundPosition(8, 8, innerCubeSize * 1.0625)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
          <Face
            url={skinUrl}
            transform={`rotateY(180deg) translateZ(${innerCubeSize * 1.0625 / 2}px)`}
            size={innerCubeSize * 1.0625}
            className="overlay-inner back"
            backgroundPosition={getBackgroundPosition(24, 8, innerCubeSize * 1.0625)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
          <Face
            url={skinUrl}
            transform={`rotateY(90deg) translateZ(${innerCubeSize * 1.0625 / 2}px)`}
            size={innerCubeSize * 1.0625}
            className="overlay-inner right"
            backgroundPosition={getBackgroundPosition(16, 8, innerCubeSize * 1.0625)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
          <Face
            url={skinUrl}
            transform={`rotateY(-90deg) translateZ(${innerCubeSize * 1.0625 / 2}px)`}
            size={innerCubeSize * 1.0625}
            className="overlay-inner left"
            backgroundPosition={getBackgroundPosition(0, 8, innerCubeSize * 1.0625)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
          <Face
            url={skinUrl}
            transform={`rotateX(90deg) translateZ(${innerCubeSize * 1.0625 / 2}px)`}
            size={innerCubeSize * 1.0625}
            className="overlay-inner top"
            backgroundPosition={getBackgroundPosition(8, 0, innerCubeSize * 1.0625)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
          <Face
            url={skinUrl}
            transform={`rotateX(-90deg) translateZ(${innerCubeSize * 1.0625 / 2}px)`}
            size={innerCubeSize * 1.0625}
            className="overlay-inner bottom"
            backgroundPosition={getBackgroundPosition(16, 0, innerCubeSize * 1.0625)}
            backgroundSize={`${backgroundSizePercent}%`}
            opacity={1}
          />
        </div>
      </div>
    </div>
  );
}

interface FaceProps {
  url: string;
  transform: string;
  size: number;
  className?: string;
  backgroundPosition?: string;
  backgroundSize?: string;
  opacity?: number;
}

function Face({
  url,
  transform,
  size,
  className,
  backgroundPosition = 'center',
  backgroundSize = '100%',
  opacity = 1,
}: FaceProps) {
  // Overlay faces should not have box shadow to avoid interference
  const isOverlay = className?.includes('overlay-outer') || className?.includes('overlay-inner');
  
  return (
    <div
      className={cn('absolute image-pixelated head-3d-face', className)}
      style={{
        width: size,
        height: size,
        transform,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        boxShadow: isOverlay ? 'none' : 'inset 0 0 10px rgba(0, 0, 0, 0.1)',
        backgroundImage: `url(${url})`,
        backgroundPosition,
        backgroundSize,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated' as const,
        opacity,
        // Ensure overlay renders on top
        pointerEvents: 'none', // Prevent interaction issues
      }}
    />
  );
}

