import React from 'react';
import { useDrag } from 'react-dnd';

export default function Area({ item, onReveal }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'residuo',
    item: { id: item.id, type: item.type },
    canDrag: item.revealed && !item.collected,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [item]);

  return (
    <div
      ref={drag}
      className={`item ${item.collected ? 'collected' : ''}`}
      onClick={() => !item.revealed && !item.collected && onReveal(item.id)}
      style={{
        position: 'absolute',
        left: item.x,
        top: item.yPercent,
        opacity: isDragging ? 0.5 : 1,
        cursor: item.revealed && !item.collected ? 'grab' : 'pointer',
      }}
    >
      {item.revealed && !item.collected ? (
        <img src={item.image} alt={item.type} className="residue-img" />
      ) : (
        <div className="hidden-item">❓</div>
      )}
    </div>
  );
}
