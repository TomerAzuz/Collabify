import React, { useMemo } from 'react';
import { ButtonGroup } from '@mui/material';
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
    <ButtonGroup variant='outlined' aria-label="actions" className='button-group'>
      {actions.map((action) => (
        <CustomIconButton
          button={action}
          isBlock={false}
        />
      ))}
    </ButtonGroup>
  );
};

export default Actions;