import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TimeTableUI from '../components/TimeTableUI';
import './index.css'

function TimeTable() {
  return (
    <DndProvider backend={HTML5Backend}>
      <TimeTableUI />
    </DndProvider>
  );
}

export default TimeTable;
