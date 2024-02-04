// @flow
import React, { MouseEventHandler } from 'react';
// import { type DraggableProvided } from 'react-beautiful-dnd';
import { type Id } from './virtualizedGrid';

type Props = {
  quote: any;
  isDragging: boolean;
  provided: any;
  isClone?: boolean;
  isGroupedOver?: boolean;
  style?: any;
  index?: number;
  logId?: (id: Id) => void;
  toggleSelection?: (id: Id) => void;
  toggleSelectionInGroup?: (id: Id) => void;
  multiSelectTo?: (id: Id) => void;
  isSelected?: boolean;
  isDraggingTask: boolean;
};

function getStyle(provided, style: any) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

// 是否按下 meta ｜ ctrl
const wasToggleInSelectionGroupKeyUsed = (event: React.MouseEvent<HTMLElement>) => {
  const isUsingWindows = navigator.platform.indexOf('Win') >= 0;
  return isUsingWindows ? event.ctrlKey : event.metaKey;
};
const wasMultiSelectKeyUsed = (event: React.MouseEvent<HTMLElement>) => event.shiftKey;

const primaryButton = 0;
// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button

const QuoteItem = (props: Props) => {
  const {
    quote,
    isDragging,
    isGroupedOver,
    provided,
    isClone,
    index,
    style,
    logId,
    isSelected,
    toggleSelection,
    toggleSelectionInGroup,
    multiSelectTo,
    isDraggingTask,
  } = props;

  // console.log(logId);

  const customStyle = {
    // width: '100px',
    // height: '100px',
    // backgroundColor: isDragging ? 'blue' : 'skyblue',
    // transition:
    //   quote.id === draggingTaskId
    //     ? 'transform 0s cubic-bezier(0.2, 0, 0, 1)'
    //     : 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
  };

  const performAction = (event: React.MouseEvent<HTMLElement>) => {
    if (wasToggleInSelectionGroupKeyUsed(event)) {
      console.log(event);
      toggleSelectionInGroup(quote.id);
      return;
    }

    if (wasMultiSelectKeyUsed(event)) {
      console.log(event);
      multiSelectTo(quote.id);
      return;
    }

    toggleSelection(quote.id);
  };

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // console.log('item onClick');
    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== primaryButton) {
      return;
    }

    // marking the event as used
    event.preventDefault();
    performAction(event);
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        ...getStyle(provided, style),
        ...customStyle,
        // transitionDuration: isDraggingTask ? undefined : '.5s',
      }}
      // onClick={() => logId(quote.id)}
    >
      <div
        onClick={onClick}
        style={{
          padding: '0 10px',
          height: '100px',
          boxSizing: 'border-box',
          // backgroundColor: isDragging ? '#6eff75' : 'skyblue',
          // border: isSelected ? '2px solid' : 'none',
          backgroundColor: isSelected ? '#29c233' : 'skyblue',
          backgroundClip: 'content-box',
        }}
      >
        {quote.id}
      </div>
    </div>
  );
};

export default React.memo<Props>(QuoteItem);
