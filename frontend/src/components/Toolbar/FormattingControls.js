import React, { useMemo } from 'react';
import { useSlate } from 'slate-react'
import { Divider } from '@mui/material';
import { FormatListBulleted, FormatListNumbered, Checklist, LooksOne, LooksTwo } from '@mui/icons-material';

import '../../App.css';
import './Toolbar.css';
import useCustomEditor from '../Hooks/useCustomEditor';
import CustomIconButton from './CustomIconButton';

const FormattingControls = () => {
  const editor = useSlate();
  const { toggleBlock } = useCustomEditor();

  const buttons = useMemo(() => [
    {
      format: 'h1',
      title: 'Heading 1',
      onClick: () => toggleBlock(editor, 'h1'),
      icon: <LooksOne />
    }, 
    {
      format: 'h2',
      title: 'Heading 2',
      onClick: () => toggleBlock(editor, 'h2'),
      icon: <LooksTwo />
    },
    {
      format: 'bulleted-list',
      title: 'Bulleted list (Ctrl+Shift+8)',
      onClick: () => toggleBlock(editor, 'bulleted-list'),
      icon: <FormatListBulleted />
    }, 
    {
      format: 'numbered-list',
      title: 'Numbered list (Ctrl+Shift+7)',
      onClick: () => toggleBlock(editor, 'numbered-list'),
      icon: <FormatListNumbered />
    }, 
    {
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