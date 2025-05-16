import React from 'react';

export default function HiddenItem({ item }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('itemId', item.id);
  };

  return (
    <div className="hidden-item" draggable onDragStart={handleDragStart}>
      {item.icon}
    </div>
  );
}
