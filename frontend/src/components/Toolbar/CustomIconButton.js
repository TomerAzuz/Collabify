import { useSlate } from 'slate-react'
import { IconButton, Tooltip } from '@mui/material';
import useCustomEditor from '../Hooks/useCustomEditor';

const CustomIconButton = ({ button, isBlock }) => {
  const editor = useSlate();
  const { isBlockActive, isMarkActive } = useCustomEditor();
  const isActive = button?.format ?
        (isBlock ? isBlockActive(editor, button.format) : 
                   isMarkActive(editor, button.format))
        : false;

  return (
    <Tooltip title={button.title}>
      <IconButton
        onClick={button.onClick}
        edge='end'
        size='small'
        sx={{
          backgroundColor: isActive ? '#CCD1D9' : 'transparent',
          borderRadius: '50%',
          margin: 'auto',
          padding: '6px',
          '&:hover': {
            borderRadius: '50px', 
          },
        }}
      >
        {button.icon}
      </IconButton>
    </Tooltip>
  );
};

export default CustomIconButton;
