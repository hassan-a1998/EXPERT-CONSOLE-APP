import React, { useState } from 'react';

export default function ImageCarousel({ images = [] }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  if (!images.length) return <div className="text-gray-500">No images</div>;

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(images.length - 1, i + 1));
  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button onClick={prev} className="px-2 py-1 border rounded">◀</button>
        <div className="flex-1 flex justify-center">
          <div className="overflow-hidden bg-gray-100 rounded shadow" style={{width:480, height:360}}>
            <img
              src={typeof images[index] === 'string' ? images[index] : images[index]?.url}
              alt={typeof images[index] === 'string' ? `view-${index}` : images[index]?.view || `view-${index}`}
              className="w-full h-full object-contain"
              style={{transform: `scale(${zoom})`, transition: 'transform 120ms ease'}}
            />
          </div>
        </div>
        <button onClick={next} className="px-2 py-1 border rounded">▶</button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={zoomOut} className="px-2 py-1 border rounded">-</button>
          <div className="text-sm">Zoom: {Math.round(zoom * 100)}%</div>
          <button onClick={zoomIn} className="px-2 py-1 border rounded">+</button>
        </div>
        <div className="flex gap-2">
          {images.map((item, i) => {
            const url = typeof item === 'string' ? item : item?.url;
            const view = typeof item === 'string' ? `view-${i}` : item?.view || `view-${i}`;
            return (
              <button key={i} onClick={() => setIndex(i)} className={`w-16 h-12 overflow-hidden rounded border ${i===index?'border-blue-500':''}`}>
                <img src={url} alt={`thumb-${view}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
