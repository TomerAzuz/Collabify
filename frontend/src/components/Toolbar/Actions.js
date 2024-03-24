import React, { useMemo } from 'react';
import { Undo, Redo } from '@mui/icons-material';

import './Toolbar.css';
import CustomIconButton from './CustomIconButton';

const Actions = ({ editor, historyEditor }) => {
  const actions = useMemo(() => [{
    title: 'Undo (Ctrl+Z)',
    onClick: () => historyEditor.undo(editor),
    icon: <Undo />,
  }, {
    title: 'Redo (Ctrl+Y)',
    onClick: () => historyEditor.redo(editor),
    icon: <Redo />,
  }], [editor, historyEditor]);

  return (
    <>
      {actions.map((action, index) => (
        <CustomIconButton
          key={index}
          button={action}
          isBlock={false}
        />
      ))}
      </>
  );
};

export default Actions;
