// @ts-nocheck

import React, { Component, useEffect, useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { DragDropContext, Droppable, Draggable } from '@iamlemon/rbd';
// import { Droppable, Draggable, DragDropContext } from '@kanaries/react-beautiful-dnd';


// fake data generator
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
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 20px ${grid}px 0`,

  background: isDragging ? 'lightgreen' : 'red',

  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'grey',
  padding: grid,
  display: 'flex',
  overflow: 'auto',
});

const MyDraggableComponent = () => {
  const [items, setItems] = useState([]);

  const ref = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    setItems(reorder(items, result.source.index, result.destination.index));
  };
  const onDragstart = (start, provided) => {
    console.log('onDragstart', start, provided);
    const draggableId = start.draggableId;
  };
  const onDragUpdate = (start, provided) => {
    console.log('onDragUpdate', start, provided);
  };

  useEffect(() => {
    setItems(getItems(50));
    setTimeout(() => {
      setShow(true);
    }, 2000);
  }, []);

  const [show, setShow] = useState(false);

  return (
    show && (
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragstart} onDragUpdate={onDragUpdate}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={droppableProvided.innerRef}
              style={getListStyle(droppableSnapshot.isDraggingOver)}
            >
              {items.map((item, index) => {
                return (
                  <div key={item.id} data-wrap-id={item.id} className="item">
                    <Draggable draggableId={item.id} index={index}>
                      {(draggableProvided, draggableSnapshot) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                          style={{
                            ...getItemStyle(
                              draggableSnapshot.isDragging,
                              draggableProvided.draggableProps.style,
                            ),
                          }}
                        >
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  </div>
                );
              })}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  );
};

export default MyDraggableComponent;
