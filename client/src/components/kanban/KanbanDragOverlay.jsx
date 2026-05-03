import { DragOverlay } from '@dnd-kit/core';
import { KanbanCardDisplay } from './KanbanCard.jsx';

export default function KanbanDragOverlay({ activeLead }) {
  return (
    <DragOverlay>
      {activeLead ? (
        <div className="rotate-2 shadow-2xl">
          <KanbanCardDisplay lead={activeLead} />
        </div>
      ) : null}
    </DragOverlay>
  );
}
