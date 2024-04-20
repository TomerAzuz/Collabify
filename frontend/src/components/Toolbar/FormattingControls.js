import React, { useMemo } from 'react';
import { useSlate } from 'slate-react'
import { Divider } from '@mui/material';
import { FormatListBulleted, FormatListNumbered, Checklist } from '@mui/icons-material';

import '../../App.css';
import './Toolbar.css';
import useCustomEditor from '../CustomHooks/useCustomEditor';
import CustomIconButton from './CustomIconButton';

const FormattingControls = () => {
  const editor = useSlate();
  const { toggleBlock, insertCheckListItem } = useCustomEditor();

  const buttons = useMemo(() => [{
      format: 'bulleted-list',
      title: 'Bulleted list (Ctrl+Shift+8)',
      onClick: () => toggleBlock(editor, 'bulleted-list'),
      icon: <FormatListBulleted />
    }, {
      format: 'numbered-list',
      title: 'Numbered list (Ctrl+Shift+7)',
      onClick: () => toggleBlock(editor, 'numbered-list'),
      icon: <FormatListNumbered />
    }, {
      format: 'check-list-item',
      title: 'Checklist',
      onClick: () => toggleBlock(editor, 'check-list-item'),
      icon: <Checklist />
    }
  ], [editor]);
  
  return (
    <> 
      {buttons.map((button) => (
        <CustomIconButton
          key={button.format}
          button={button}
          isBlock={true}
        />
      ))}
      <Divider sx={{ margin: '10px' }} orientation="vertical" variant="middle" flexItem />
    </>
  )
};

export default FormattingControls;