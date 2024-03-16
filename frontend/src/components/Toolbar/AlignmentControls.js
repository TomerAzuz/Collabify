import { ButtonGroup } from '@mui/material';
import { FormatAlignLeft, FormatAlignCenter, FormatAlignRight } from '@mui/icons-material';

import './Toolbar.css';
import CustomEditor from '../Editor/CustomEditor';
import CustomIconButton from './CustomIconButton';

const AlignmentControls = ({ editor }) => {
  const alignment = [{
      title: 'Left align (Ctrl+Shift+L)',
      onClick: () => CustomEditor.alignText(editor, 'left'),
      icon: <FormatAlignLeft />
    }, {
      title: 'Center align (Ctrl+Shift+E)',
      onClick: () => CustomEditor.alignText(editor, 'center'),
      icon: <FormatAlignCenter />
    }, {
      title: 'Right align (Ctrl+Shift+R)',
      onClick: () => CustomEditor.alignText(editor, 'right'),
      icon: <FormatAlignRight />
    }];
    
    return (
      <ButtonGroup 
        variant='outlined' 
        aria-label='formatting-options' 
        className='button-group'
      >
        {alignment.map((align) => (
          <CustomIconButton 
            key={align.title}
            title={align.title} 
            onClick={align.onClick} 
            icon={align.icon} 
          />
        ))}
      </ButtonGroup>
    )
};

export default AlignmentControls;