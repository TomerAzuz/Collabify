import React, { useMemo } from 'react';
import { useSlate } from 'slate-react'
import { FormatQuote } from '@mui/icons-material';
import { FormatListBulleted, FormatListNumbered, Checklist } from '@mui/icons-material';

import '../../App.css';
import './Toolbar.css';
import CustomEditor from '../Editor/CustomEditor';
import CustomIconButton from './CustomIconButton';

const FormattingControls = () => {
  const editor = useSlate();

  const buttons = useMemo(() => [{
      format: 'quote',
      title: 'Quote block',
      onClick: () => CustomEditor.toggleBlock(editor, 'quote'),
      icon: <FormatQuote />
    }, {
      format: 'bulleted-list',
      title: 'Bulleted list (Ctrl+Shift+8)',
      onClick: () => CustomEditor.toggleBlock(editor, 'bulleted-list'),
      icon: <FormatListBulleted />
    }, {
      format: 'numbered-list',
      title: 'Numbered list (Ctrl+Shift+7)',
      onClick: () => CustomEditor.toggleBlock(editor, 'numbered-list'),
      icon: <FormatListNumbered />
    }, {
      format: 'check-list-item',
      title: 'Checklist',
      onClick: () => CustomEditor.insertCheckListItem(editor),
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
    </>
  )
};

export default FormattingControls;