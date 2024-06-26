import { useMemo } from 'react';
import { useSlate } from 'slate-react';
import { Divider } from '@mui/material';
import {
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
} from '@mui/icons-material';

import './Toolbar.css';
import useCustomEditor from '../../hooks/useCustomEditor';
import CustomIconButton from '../Buttons/CustomIconButton';

const AlignmentControls = () => {
  const editor = useSlate();
  const { toggleBlock } = useCustomEditor();

  const buttons = useMemo(
    () => [
      {
        format: 'left',
        title: 'Left align (Ctrl+Shift+L)',
        onClick: () => toggleBlock(editor, 'left'),
        icon: <FormatAlignLeft />,
      },
      {
        format: 'center',
        title: 'Center align (Ctrl+Shift+E)',
        onClick: () => toggleBlock(editor, 'center'),
        icon: <FormatAlignCenter />,
      },
      {
        format: 'right',
        title: 'Right align (Ctrl+Shift+R)',
        onClick: () => toggleBlock(editor, 'right'),
        icon: <FormatAlignRight />,
      },
    ],
    [editor]
  );

  return (
    <>
      <Divider
        sx={{ margin: '10px' }}
        orientation="vertical"
        variant="middle"
        flexItem
      />
      {buttons.map((button) => (
        <CustomIconButton key={button.format} button={button} isBlock={true} />
      ))}
      <Divider
        sx={{ margin: '10px' }}
        orientation="vertical"
        variant="middle"
        flexItem
      />
    </>
  );
};

export default AlignmentControls;
