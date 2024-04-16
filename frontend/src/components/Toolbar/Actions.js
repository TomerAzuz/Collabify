import React, { useMemo } from 'react';
import { useSlate } from 'slate-react'
import { Undo, Redo } from '@mui/icons-material';

import './Toolbar.css';
import CustomIconButton from './CustomIconButton';

const Actions = ({ historyEditor }) => {
  const editor = useSlate();

  const actions = useMemo(() => [{
    id: 0,
    title: 'Undo (Ctrl+Z)',
    onClick: () => historyEditor.undo(editor),
    icon: <Undo />,
  }, {
    id: 1,
    title: 'Redo (Ctrl+Y)',
    onClick: () => historyEditor.redo(editor),
    icon: <Redo />,
  }], [editor, historyEditor]);

  return (
    <>
      {actions.map((action) => (
        <CustomIconButton
          key={action.id}
          button={action}
          isBlock={false}
        />
      ))}
    </>
  );
};

export default Actions;
