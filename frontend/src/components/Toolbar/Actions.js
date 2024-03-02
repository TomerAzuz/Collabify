import { ButtonGroup } from '@mui/material';
import { Undo, Redo } from '@mui/icons-material';

import '../../App.css';
import './Toolbar.css';
import CustomIconButton from './CustomIconButton';
import { useState } from 'react';

const Actions = ({ editor, historyEditor }) => {
  const actions = [{
      title: 'Undo (Ctrl+Z)',
      onClick: () => historyEditor.undo(editor),
      icon: <Undo />,
    }, {
      title: 'Redo (Ctrl+Y)',
      onClick: () => historyEditor.redo(editor),
      icon: <Redo/>,
    },
  ];

  return (
    <ButtonGroup variant='outlined' aria-label="actions" className='button-group'>
      {actions.map((action) => (
        <CustomIconButton
          key={action.title}
          title={action.title}
          onClick={action.onClick}
          icon={action.icon}
        />
      ))}
    </ButtonGroup>
  );
};

export default Actions;