import React, { useMemo } from 'react';
import { Code, FormatQuote } from '@mui/icons-material';
import { LooksOne, LooksTwo, FormatListBulleted, FormatListNumbered } from '@mui/icons-material';

import '../../App.css';
import './Toolbar.css';
import CustomEditor from '../Editor/CustomEditor';
import CustomIconButton from './CustomIconButton';

const FormattingControls = ({ editor }) => {
  const formats = useMemo(() => [{
      format: 'h1',
      title: 'Heading 1',
      onClick: () => CustomEditor.toggleBlock(editor, 'h1'),
      icon: <LooksOne />
    }, {
      format: 'h2',
      title: 'Heading 2',
      onClick: () => CustomEditor.toggleBlock(editor, 'h2'),
      icon: <LooksTwo />
    }, {
      format: 'h3',
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