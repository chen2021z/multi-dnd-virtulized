// disabling flowtype to keep this example super simple
// It matches

// @ts-nocheck
import React, { Component } from 'react';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
// import { Droppable, Draggable, DragDropContext } from '@iamlemon/rbd';
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
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'skyblue',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? 'lightblue' : 'grey',
  padding: grid,
  width: 100,
});

export default class App extends Component {
  constructor(props, context) {
    super(props, context);
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      items: getItems(100),
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(this.state.items, result.source.index, result.destination.index);

    this.setState({
      items,
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable" direction="vir">
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={droppableProvided.innerRef}
              style={{
                ...getListStyle(droppableSnapshot.isDraggingOver),
                width: '100px',
                height: '100px',
                display: 'flex',
                // overflow: 'auto',
              }}
            >
              <div style={{ width: '10000px' }}>
                {this.state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
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
                          width: '100px',
                          display: 'inline-block',
                        }}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}