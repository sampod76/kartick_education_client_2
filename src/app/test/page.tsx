'use client';

import { useEffect, useRef, useState, MouseEvent } from 'react';
import { FloatButton } from 'antd';

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CroppedResult {
  coords: string;
  base64: string;
}

export default function AdvancedImageCropper() {
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [resizing, setResizing] = useState<{ dir: string } | null>(null);
  const [results, setResults] = useState<CroppedResult[]>([]);
  console.log('🚀 ~ AdvancedImageCropper ~ results:', results);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const startRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const fetchImage = async () => {
      const imageSrc =
        'https://d2ezooqjcs5g4c.cloudfront.net/upload/images/votine-1750077532851.jpg';
      try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        setImageURL(objectURL);
      } catch (error) {
        console.error('Error fetching image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
    return () => {
      if (imageURL) {
        URL.revokeObjectURL(imageURL);
      }
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectURL = URL.createObjectURL(file);
      setImageURL(objectURL);
      setResults([]);
      setSelection(null);
    }
  };

  const getMousePos = (e: MouseEvent): { x: number; y: number } => {
    const rect = imageRef.current!.getBoundingClientRect();
    const scaleX = imageRef.current!.naturalWidth / rect.width;
    const scaleY = imageRef.current!.naturalHeight / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (!imageRef.current) return;
    const { x, y } = getMousePos(e);

    if (selection) {
      const withinX = x >= selection.x && x <= selection.x + selection.width;
      const withinY = y >= selection.y && y <= selection.y + selection.height;
      if (withinX && withinY) {
        startRef.current = { x, y };
        setIsMoving(true);
        return;
      }
    }

    startRef.current = { x, y };
    setIsDragging(true);
    setSelection({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (resizing) return handleResizeMove(e);
    if (isMoving && selection) {
      const { x, y } = getMousePos(e);
      const dx = x - startRef.current.x;
      const dy = y - startRef.current.y;
      startRef.current = { x, y };

      const newX = Math.max(
        0,
        Math.min(selection.x + dx, imageRef.current!.naturalWidth - selection.width),
      );
      const newY = Math.max(
        0,
        Math.min(selection.y + dy, imageRef.current!.naturalHeight - selection.height),
      );

      setSelection({ ...selection, x: newX, y: newY });
      return;
    }

    if (!isDragging || !selection) return;
    const { x, y } = getMousePos(e);
    const startX = startRef.current.x;
    const startY = startRef.current.y;
    setSelection({
      x: Math.min(startX, x),
      y: Math.min(startY, y),
      width: Math.abs(x - startX),
      height: Math.abs(y - startY),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizing(null);
    setIsMoving(false);
  };

  const handleResizeStart = (e: MouseEvent, dir: string) => {
    e.stopPropagation();
    setResizing({ dir });
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing || !selection || !imageRef.current) return;
    const { x, y } = getMousePos(e);
    const updated = { ...selection };

    switch (resizing.dir) {
      case 'bottom-right':
        updated.width = x - updated.x;
        updated.height = y - updated.y;
        break;
      case 'bottom-left':
        updated.width = updated.x + updated.width - x;
        updated.x = x;
        updated.height = y - updated.y;
        break;
      case 'top-left':
        updated.width = updated.x + updated.width - x;
        updated.x = x;
        updated.height = updated.y + updated.height - y;
        updated.y = y;
        break;
      case 'top-right':
        updated.width = x - updated.x;
        updated.height = updated.y + updated.height - y;
        updated.y = y;
        break;
    }

    updated.width = Math.max(10, updated.width);
    updated.height = Math.max(10, updated.height);
    setSelection(updated);
  };

  const saveCroppedImage = () => {
    if (!selection || !imageRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = selection.width;
    canvas.height = selection.height;
    ctx.drawImage(
      imageRef.current,
      selection.x,
      selection.y,
      selection.width,
      selection.height,
      0,
      0,
      selection.width,
      selection.height,
    );
    const base64Image = canvas.toDataURL('image/png');
    const coords = `coords="${Math.round(selection.x)},${Math.round(
      selection.y,
    )},${Math.round(selection.x + selection.width)},${Math.round(
      selection.y + selection.height,
    )}"`;
    setResults((prev) => [...prev, { coords, base64: base64Image }]);
    setSelection(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <div
        style={{ position: 'relative', display: 'inline-block', cursor: 'crosshair' }}
        onMouseDown={resizing ? undefined : handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {imageURL && (
          <img
            src={imageURL}
            ref={imageRef}
            alt="Main"
            draggable={false}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        )}

        {selection && imageRef.current && (
          <div
            style={{
              position: 'absolute',
              left: `${(selection.x / imageRef.current.naturalWidth) * 100}%`,
              top: `${(selection.y / imageRef.current.naturalHeight) * 100}%`,
              width: `${(selection.width / imageRef.current.naturalWidth) * 100}%`,
              height: `${(selection.height / imageRef.current.naturalHeight) * 100}%`,
              border: '2px dashed red',
              background: 'rgba(255,0,0,0.1)',
              cursor: 'move',
            }}
          >
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((dir) => (
              <div
                key={dir}
                onMouseDown={(e) => handleResizeStart(e, dir)}
                style={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  background: 'white',
                  border: '2px solid red',
                  borderRadius: 4,
                  cursor: `${dir}-resize`,
                  ...(dir === 'top-left' && { top: -5, left: -5 }),
                  ...(dir === 'top-right' && { top: -5, right: -5 }),
                  ...(dir === 'bottom-left' && { bottom: -5, left: -5 }),
                  ...(dir === 'bottom-right' && { bottom: -5, right: -5 }),
                }}
              />
            ))}
          </div>
        )}

        {imageRef.current &&
          results.map((res, i) => {
            const match = res.coords.match(/\d+/g);
            if (!match || !imageRef.current) return null;
            const [x1, y1, x2, y2] = match.map(Number);
            const width = x2 - x1;
            const height = y2 - y1;
            return (
              <div
                key={`saved-${i}`}
                style={{
                  position: 'absolute',
                  left: `${(x1 / imageRef.current.naturalWidth) * 100}%`,
                  top: `${(y1 / imageRef.current.naturalHeight) * 100}%`,
                  width: `${(width / imageRef.current.naturalWidth) * 100}%`,
                  height: `${(height / imageRef.current.naturalHeight) * 100}%`,
                  border: '2px solid green',
                  background: 'rgba(0,255,0,0.1)',
                  pointerEvents: 'none',
                }}
              />
            );
          })}
      </div>

      {selection && (
        <div className="mt-4">
          <code>
            coords=&quot;{Math.round(selection.x)},{Math.round(selection.y)},
            {Math.round(selection.x + selection.width)},
            {Math.round(selection.y + selection.height)}&quot;
          </code>
          <FloatButton
            onClick={saveCroppedImage}
            style={{ zIndex: 9999, insetInlineEnd: 10, marginTop: 20 }}
          />
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h3>Saved Selections</h3>
          {results.map((r, i) => (
            <div key={i} className="mb-6">
              <p>{r.coords}</p>
              <img
                src={r.base64}
                alt={`Crop ${i}`}
                style={{ border: '1px solid #ccc', maxWidth: '100%' }}
                className="w-[650px] max-h-[500px] lg:max-w-[1200px]"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
