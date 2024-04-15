import React, { useMemo } from 'react';
import { useSlate } from 'slate-react'
import { Code, FormatQuote } from '@mui/icons-material';
import { FormatListBulleted, FormatListNumbered, Checklist } from '@mui/icons-material';

import '../../App.css';
import './Toolbar.css';
import CustomEditor from '../Editor/CustomEditor';
import CustomIconButton from './CustomIconButton';

const FormattingControls = () => {
  const editor = useSlate();

  const formats = useMemo(() => [{
      format: 'code',
      title: 'Code block (Ctrl+`)',
      onClick: () => CustomEditor.toggleBlock(editor, 'code'),
      icon: <Code />
    }, {
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
      {formats.map((format) => (
        <CustomIconButton
          key={format.title}
          button={format}
          isBlock={true}
        />
      ))}
    </>
  )
};

export default FormattingControls;