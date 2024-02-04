import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'react-virtualized/styles.css';
import { Grid } from 'react-virtualized';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

import type {
  DroppableProvided,
  DraggableStateSnapshot,
  DropResult,
  DraggableProvided,
  DraggableLocation,
  DragStart,
  ReorderResult,
} from 'react-beautiful-dnd';
import Item from './item';
import 'react-virtualized/styles.css';
import { multiSelectTo as multiSelect, multiDragAwareReorder } from './utils';

const getItems = (count): Quote[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k}`,
    content: `item ${k}`,
  }));

export type Quote = {
  id: Id;
  content: string;
};

export type Id = string | number;

function App() {
  const [quotes, setQuotes] = useState(() => getItems(100));
  const [selectedTaskIds, setSelectedTaskIds] = useState<Id[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState<Id>(null);

  const onDragStart = (start: DragStart) => {
    setDraggingTaskId(start.draggableId);
  };

  const onDragEnd = (result: DropResult) => {
    const destination: DraggableLocation = result.destination;
    const source: DraggableLocation = result.source;
    console.log(destination, source);

    // nothing to do
    if (!destination || result.reason === 'CANCEL' || result.index === destination.index) {
      return;
    }

    const newQuotes: ReorderResult = multiDragAwareReorder(
      quotes,
      selectedTaskIds,
      destination.index,
    );

    setQuotes(newQuotes);
  };

  const toggleSelection = (taskId: Id) => {
    console.log('toggleSelection', taskId);
    const wasSelected: boolean = selectedTaskIds.includes(taskId);

    const newTaskIds: Id[] = (() => {
      if (!wasSelected) {
        return [taskId];
      }

      if (selectedTaskIds.length > 1) {
        return [taskId];
      }

      return [];
    })();

    setSelectedTaskIds(newTaskIds);
  };

  const toggleSelectionInGroup = (taskId: Id) => {
    console.log('toggleSelectionInGroup', taskId);
    const index = selectedTaskIds.indexOf(taskId);
    if (index === -1) {
      setSelectedTaskIds([...selectedTaskIds, taskId]);
      return;
    }

    const shallow = [...selectedTaskIds];
    shallow.splice(index, 1);

    setSelectedTaskIds(shallow);
  };

  const multiSelectTo = (newTaskId: Id) => {
    console.log('multiSelectTo', newTaskId);
    const updated: Id[] = multiSelect(quotes, selectedTaskIds, newTaskId);

    if (updated == null) {
      return;
    }

    setSelectedTaskIds(updated);
  };

  const logId = (id: Id) => {
    console.log('logId', id);
  };

  // Using a higher order function so that we can look up the quotes data to retrieve
  // our quote from within the rowRender function
  const getRowRender = (quotes: Quote[]) => {
    return function RenderList({ columnIndex, style }) {
      const quote = quotes[columnIndex];
      // console.log(columnIndex, quote);

      return (
        <Draggable draggableId={quote.id} index={columnIndex} key={quote.id}>
          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
            <Item
              provided={provided}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              quote={quote}
              isDragging={snapshot.isDragging}
              style={{ ...style }}
              index={columnIndex}
              toggleSelection={toggleSelection}
              logId={logId}
              isSelected={selectedTaskIds.includes(quote.id)}
              toggleSelectionInGroup={toggleSelectionInGroup}
              multiSelectTo={multiSelectTo}
              isDraggingTask={draggingTaskId === quote.id}
            />
          )}
        </Draggable>
      );
    };
  };

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      style={{ width: '100vw', height: '100vh' }}
    >
      <Droppable
        droppableId="droppable"
        mode="virtual"
        direction="horizontal"
        renderClone={(provided, snapshot, rubric) => (
          <Item
            provided={provided}
            isDragging={snapshot.isDragging}
            quote={quotes[rubric.source.index]}
            index={rubric.source.index}
            isSelected={selectedTaskIds.includes(quotes[rubric.source.index].id)}
            isDraggingTask={draggingTaskId === quotes[rubric.source.index].id}
          />
        )}
      >
        {(droppableProvided: DroppableProvided) => (
          <Grid
            height={100}
            width={1000}
            rowCount={1}
            rowHeight={100}
            columnCount={quotes.length}
            columnWidth={120}
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
            containerProps={{ onWheel: (e) => e.stopPropagation() }}
            cellRenderer={getRowRender(quotes)}
          />
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
