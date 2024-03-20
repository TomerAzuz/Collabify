import { useMemo } from 'react';
import { ButtonGroup } from '@mui/material';
import { FormatAlignLeft, FormatAlignCenter, FormatAlignRight } from '@mui/icons-material';

import './Toolbar.css';
import CustomEditor from '../Editor/CustomEditor';
import CustomIconButton from './CustomIconButton';

const AlignmentControls = ({ editor }) => {
  const alignment = useMemo(() => [{
      format: 'left',
      title: 'Left align (Ctrl+Shift+L)',
      onClick: () => CustomEditor.alignText(editor, 'left'),
      icon: <FormatAlignLeft />
    }, {
      format: 'center',
      title: 'Center align (Ctrl+Shift+E)',
      onClick: () => CustomEditor.alignText(editor, 'center'),
      icon: <FormatAlignCenter />
    }, {
      format: 'right',
      title: 'Right align (Ctrl+Shift+R)',
      onClick: () => CustomEditor.alignText(editor, 'right'),
      icon: <FormatAlignRight />
    }], [editor]);
    
    return (
      <ButtonGroup 
        variant='outlined' 
        aria-label='formatting-options' 
        className='button-group'
      >
        {alignment.map((align) => (
          <CustomIconButton 
            key={align.title}
            button={align}
            isBlock={true}
          />
        ))}
      </ButtonGroup>
    )
};

export default AlignmentControls;