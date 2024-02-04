import { type Id, Quote } from '../virtualizedGrid';

type DraggableLocation = {
  index: number;
  droppableId: Id;
};

export const multiSelectTo = (quotes: Quote[], selectedQuoteIds: Id[], newQuoteId: Id): Id[] => {
  // Nothing already selected
  if (!selectedQuoteIds.length) {
    return [newQuoteId];
  }

  // DO: 从目前的 quote 顺序中找到 selectedTaskIds 最后一项从属的item，将其与 newQuoteId 中间 item 的 id 插入 selectedTaskIds，若 id 已存在则忽略
  const lastItemIndex = quotes.findIndex(
    (item) => item.id === selectedQuoteIds[selectedQuoteIds.length - 1],
  );
  const newItemIndex = quotes.findIndex((item) => item.id === newQuoteId);
  const largerIndex = Math.max(lastItemIndex, newItemIndex);
  const smallerIndex = Math.min(lastItemIndex, newItemIndex);

  const combined = [...selectedQuoteIds];

  for (let i = smallerIndex; i <= largerIndex; i++) {
    if (!combined.includes(quotes[i].id)) {
      combined.push(quotes[i].id);
    }
  }

  return combined;
};

export const multiDragAwareReorder = (
  quotes: Quote[],
  selectedTaskIds: Id[],
  endIndex: number
) => {
  const removedItems: Quote[] = [];
  // 不按照先后顺序，需要将 selectedTaskIds 按 quotes 的原相对顺序进行调整
  selectedTaskIds.sort((a, b) => {
    const indexA = quotes.findIndex(q => q.id === a);
    const indexB = quotes.findIndex(q => q.id === b);

    // 如果其中一个 id 不在原始数据中，将其排在后面
    // if (indexA === -1) return 1;
    // if (indexB === -1) return -1;

    return indexA - indexB;
})
  
  for (let i = 0; i < selectedTaskIds.length; i++) {
    const [removedItem] = quotes.splice(
      quotes.findIndex((item) => item.id === selectedTaskIds[i]),
      1,
    );
    removedItems.push(removedItem)
  }
  quotes.splice(endIndex, 0, ...removedItems)
  console.log(selectedTaskIds);
  
  // const [removed] = result.splice(startIndex, 1);

  return quotes;
};
