// @ts-nocheck
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'react-virtualized/styles.css';
import { List } from 'react-virtualized';
import {
  Droppable,
  Draggable,
  DragDropContext,
  type DroppableProvided,
  type DraggableProvided,
  type DraggableStateSnapshot,
  type DraggableRubric,
  type DropResult,
} from 'react-beautiful-dnd';
import Item from './item';
import 'react-virtualized/styles.css';

const grid = 8;
const getItems = (count) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));
const getItemStyle = (isDragging, draggableStyle) => ({
  background: isDragging ? 'lightgreen' : 'red',

  ...draggableStyle,
});

const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

type Quote = {
  id: string;
  content: string;
};

type Props = {
  initial: Quote[];
};

type RowProps = {
  index: number;
  style: any;
};

// Using a higher order function so that we can look up the quotes data to retrieve
// our quote from within the rowRender function
const getRowRender = (quotes: Quote[]) =>
  function RenderList({ index, style }) {
    const quote = quotes[index];

    return (
      <Draggable draggableId={quote.id} index={index} key={quote.id}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <Item
            provided={provided}
            quote={quote}
            isDragging={snapshot.isDragging}
            style={{ margin: 0, display: 'inline-block', ...style }}
            index={index}
          >
            {index}
          </Item>
        )}
      </Draggable>
    );
  };

function App() {
  const [quotes, setQuotes] = useState(() => getItems(100));

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    if (result.source.index === result.destination.index) {
      return;
    }

    const newQuotes: Quote[] = reorder(quotes, result.source.index, result.destination.index);
    setQuotes(newQuotes);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable"
        mode="virtual"
        direction="horizontal"
        renderClone={(provided, snapshot, rubric) => (
          <Item
            provided={provided}
            isDragging={snapshot.isDragging}
            quote={quotes[rubric.source.index]}
            style={{ margin: 0 }}
            index={rubric.source.index}
          >
            {rubric.source.index}
          </Item>
        )}
      >
        {(droppableProvided: DroppableProvided) => (
          <List
            height={700}
            width={700}
            rowCount={quotes.length}
            rowHeight={100}
            ref={(ref) => {
              // react-virtualized has no way to get the list's ref that I can so
              // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
              if (ref) {
                // eslint-disable-next-line react/no-find-dom-node
                const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                if (whatHasMyLifeComeTo instanceof HTMLElement) {
                  droppableProvided.innerRef(whatHasMyLifeComeTo);
                }
              }
            }}
            rowRenderer={getRowRender(quotes)}
            horizontal
          />
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
