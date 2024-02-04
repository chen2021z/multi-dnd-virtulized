import React, { useEffect, useState } from 'react';

const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'red',

  // styles we need to apply on draggables
  ...draggableStyle,
});

export default function DraggableComponent(props: any) {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  const setRef = (ref) => {
    // give the dom ref to react-beautiful-dnd
    props.innerRef(ref);
  };

  const { draggableProvided, item, draggableSnapshot } = props;
  console.log(props);
  if (!enabled) {
    return null;
  }
  return (
    <div
      ref={setRef}
      {...draggableProvided.dragHandleProps}
      {...draggableProvided.draggableProps}
      key={item.id}
      style={getItemStyle(draggableSnapshot.isDragging, draggableProvided.draggableProps.style)}
    >
      {item.content}
    </div>
  );
}
