import React, { useState } from 'react';
import { ButtonGroup, TextField, IconButton, Tooltip, Select, MenuItem } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, Add, Remove, FormatColorText } from '@mui/icons-material';
import { faStrikethrough } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Toolbar.css';
import CustomEditor from '../editor/CustomEditor.js';
import CustomIconButton from './CustomIconButton.js';
import ColorPickerPortal from '../portals/ColorPickerPortal.js';

const fontFamilies = [
    'AMATIC SC', 'Arial', 'Caveat', 'Comfortaa', 'Comic Sans MS', 
    'Courier New', 'EB Garamond', 'Georgia', 'Impact', 'Lexend',
    'Lobster', 'Lora', 'Merriweather', 'Monteserrat', 'Nunito',
    'Oswald', 'Pacifico', 'Playfair Display', 'Roboto', 'Roboto Mono', 
    'Roboto Serif', 'Spectral', 'Times New Roman', 'Trebuchet MS', 'Verdana' 
  ];

const FontControls = ({ editor }) => {
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontColor, setFontColor] = useState('black');
  const [openColorPicker, setOpenColorPicker] = useState(false);

  const styles = [{
      title: 'Increase font size (Ctrl+Shift+.)',
      onClick: () => adjustFontSize(1),
      icon: <Add sx={{ fontSize: '16px', }}/>
    }, {
      title: 'Bold (Ctrl+B)',
      onClick: () => CustomEditor.toggleMark(editor, 'bold'),
      icon: <FormatBold />
    }, {
      title: 'Italic (Ctrl+I)',
      onClick: () => CustomEditor.toggleMark(editor, 'italic'),
      icon: <FormatItalic />
    }, {
      title: 'Underline (Ctrl+U)',
      onClick: () => CustomEditor.toggleMark(editor, 'underline'),
      icon: <FormatUnderlined />
    }, {
      title: 'Strikethrough',
      onClick: () => CustomEditor.toggleMark(editor, 'strikethrough'),
      icon: <FontAwesomeIcon icon={faStrikethrough} />
    },
  ];

  const changeFontSize = (e) => {
    const size = Number(e.target.value);
    setFontSize(size);

    if (!isNaN(size)) {
      const clampedSize = Math.min(Math.max(size, 1), 400);
      CustomEditor.setFontSize(editor, clampedSize);
      setFontSize(clampedSize);
    }
  };

  const changeFontFamily = (e) => {
    e.preventDefault();
    setFontFamily(e.target.value);
    CustomEditor.addMark(editor, 'fontFamily', e.target.value);
  };

  const adjustFontSize = (increment) => {
    const size = fontSize + increment;
    const clampedSize = Math.min(Math.max(size, 1), 400);
    setFontSize(clampedSize);
    CustomEditor.addMark(editor, 'fontSize', clampedSize);
  };

  const handleColorChange = (newColor) => {
    setFontColor(newColor);
    CustomEditor.addMark(editor, 'color', newColor);
    setOpenColorPicker(false);
  };

  const toggleColorPicker = (e) => {
    e.preventDefault();
    setOpenColorPicker(!openColorPicker);
  };
  
  return (
    <ButtonGroup 
      variant='outlined' 
      aria-label="formatting-options" 
      className='button-group'
    >
      {/* Font family */}
      <Tooltip title="Font">
        <Select
          labelId="font-select-label"
          id="font-family"
          className='select'
          value={fontFamily}
          onChange={changeFontFamily}
        >
          {fontFamilies.map(font => (
            <MenuItem 
              key={font} 
              value={font}
              style={{ fontFamily: font, fontSize: '20px', }}
            >
            {font}
          </MenuItem>
          ))} 
        </Select>
      </Tooltip> 

      {/* Decrease font size */}
      <Tooltip title="Decrease font size (Ctrl+Shift+,)">
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
          variant="outlined"
          className='textfield'
          value={fontSize}
          onChange={(e) => changeFontSize(e)}
        />
      </Tooltip>
      
      {styles.map((style) => (
        <CustomIconButton
          key={style.title}
          title={style.title}
          onClick={style.onClick}
          icon={style.icon}
        />
      ))}

      {/* Text color */}
      <Tooltip title="Text color">
        <IconButton
          className='button'
          onClick={(e) => toggleColorPicker(e)}
        >
        <div className='color-indicator'>
          <FormatColorText />
          <span
            className='pallete'
            style={{ backgroundColor: fontColor, }}
          />
        </div>
        </IconButton>
      </Tooltip>

      <ColorPickerPortal
        open={openColorPicker}
        handleColorChange={handleColorChange}
      />
    </ButtonGroup>
  );
};

export default FontControls;