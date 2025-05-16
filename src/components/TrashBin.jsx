import { useDrop } from 'react-dnd';

export default function TrashZone({ type, x, y, onDrop }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'residuo',
    drop: (item) => {
      if (item.type === type) {
        onDrop(item.id); 
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  return (
  <div
    ref={drop}
    className="trash-zone"
    style={{
      position: 'absolute',
      left: x,
      top: y,
      borderRadius: '50%',
      backgroundColor: isOver ? 'rgba(0,255,0,0.2)' : 'transparent',
      opacity: 0,    
    }}
  >
    title={`Lixeira de ${type}`}
  </div>
  );
}
