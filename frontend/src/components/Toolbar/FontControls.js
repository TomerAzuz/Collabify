import React, { useMemo } from 'react';
import { useSlate } from 'slate-react'
import { Editor } from 'slate';
import { Divider, TextField, IconButton, Tooltip, Select, MenuItem } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, Add, Remove, BorderColor, StrikethroughS } from '@mui/icons-material';

import './Toolbar.css';
import useCustomEditor from '../Hooks/useCustomEditor';
import CustomIconButton from './CustomIconButton';
import ColorPicker from './ColorPicker';
import { FONTS } from '../Common/Utils/constants';

const FontControls = () => {
  const editor = useSlate();
  const { setTextSize, toggleMark, addMark } = useCustomEditor();

  const getFontSize = () => {
    const marks = Editor.marks(editor);
    return marks && marks.fontSize ? marks.fontSize : 14;
  };

  const getFontFamily = () => {
    const marks = Editor.marks(editor);
    return marks && marks.fontFamily ? marks.fontFamily : 'Arial';
  };

  const adjustFontSize = (increment) => {
    const size = getFontSize() + increment;
    const clampedSize = Math.min(Math.max(size, 1), 400);
    setTextSize(editor, clampedSize);
    return clampedSize;
  };

  const changeFontSize = (e) => {
    const size = Number(e.target.value);
    if (!isNaN(size)) {
      const clampedSize = Math.min(Math.max(size, 1), 400);
      setTextSize(editor, clampedSize);
    }
  };

  const changeFontFamily = (e) => {
    e.preventDefault();
    addMark(editor, 'fontFamily', e.target.value);
  };

  const buttons = useMemo(() => [{
      title: 'Increase font size',
      onClick: () => adjustFontSize(1),
      icon: <Add sx={{ fontSize: '16px' }} />
    }, {
      format: 'bold',
      title: 'Bold (Ctrl+B)',
      onClick: () => toggleMark(editor, 'bold'),
      icon: <FormatBold />
    }, {
      format: 'italic',
      title: 'Italic (Ctrl+I)',
      onClick: () => toggleMark(editor, 'italic'),
      icon: <FormatItalic />
    }, {
      format: 'underline',
      title: 'Underline (Ctrl+U)',
      onClick: () => toggleMark(editor, 'underline'),
      icon: <FormatUnderlined />
    }, {
      format: 'strikethrough',
      title: 'Strikethrough (Ctrl+5)',
      onClick: () => toggleMark(editor, 'strikethrough'),
      icon: <StrikethroughS />
    }, {
      format: 'backgroundColor',
      title: 'Highlight color (Ctrl+H)',
      onClick: () => toggleMark(editor, 'backgroundColor'),
      icon: <BorderColor />
    }
  ], [editor, adjustFontSize]);  

  return (
    <>
      {/* Font family */}
      <Divider sx={{ margin: '10px' }} orientation="vertical" variant="middle" flexItem />
      <Tooltip title="Font">
        <Select
          labelId="font-select-label"
          id="font-family"
          sx={{
            width: '90px',
            textAlign: 'center',
            margin: '2px',
            height: '60px',
            boxShadow: 'none', 
            '.MuiOutlinedInput-notchedOutline': { border: 0 },
            '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':  { border: 0 },
            '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 0 },
            '& .MuiSelect-select': {
              fontWeight: 'thin', 
            },
          }}
          value={getFontFamily()}
          onChange={changeFontFamily}
        >
          {FONTS.map((font, index) => (
            <MenuItem 
              key={index} 
              value={font}
              style={{ fontFamily: font, fontSize: '20px', }}
            >
            {font}
          </MenuItem>
          ))} 
        </Select>
      </Tooltip> 
      <Divider 
        sx={{ margin: '10px' }} 
        orientation="vertical" 
        variant="middle" 
        flexItem 
      />
      {/* Decrease font size */}
      <Tooltip title="Decrease font size">
        <IconButton
          className='button'
          onClick={() => adjustFontSize(-1)}
        >
          <Remove sx={{ fontSize: 'small' }} />
        </IconButton>
      </Tooltip>
      
      {/* Font size */}
      <Tooltip title="Font size">
        <TextField
          id='font-size'
          type="text"
          size="small"
          inputProps={{
            style: { 
              fontSize: 16, 
              textAlign: 'center', 
              fontWeight: 'bold', 
          }}}
          sx={{ width: '50px', textAlign: 'center' }}
          value={getFontSize()}
          onChange={(e) => changeFontSize(e)}
        />
      </Tooltip>
      {buttons.map((button, index) => (
        <React.Fragment key={index}>
          {button.format === 'bold' && index !== buttons.length - 1 && (
            <Divider 
              sx={{ margin: '10px' }} 
              orientation="vertical" 
              variant="middle" 
              flexItem 
            />
          )}
          <CustomIconButton
            button={button}
            isBlock={false}
          />
        </React.Fragment>
      ))}
      <ColorPicker />
    </>
  );
};

export default FontControls;
