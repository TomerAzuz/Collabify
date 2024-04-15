import { useSlate } from 'slate-react'
import { IconButton, Tooltip } from '@mui/material';
import CustomEditor from '../Editor/CustomEditor';

const CustomIconButton = ({ button, isBlock }) => {
  const editor = useSlate();
  const isActive = button?.format
  ? (isBlock
      ? CustomEditor.isBlockActive(editor, button.format)
      : CustomEditor.isMarkActive(editor, button.format))
  : false;

  return (
    <Tooltip title={button.title}>
      <IconButton
        onClick={button.onClick}
        sx={{
          backgroundColor: isActive ? '#CCD1D9' : 'transparent',
          borderRadius: '50%'
        }}
      >
        {button.icon}
      </IconButton>
    </Tooltip>
  );
};

export default CustomIconButton;
