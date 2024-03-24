import React, { useState, useCallback } from 'react';
import { TextField, IconButton, Tooltip, Select, MenuItem } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, Add, Remove, BorderColor } from '@mui/icons-material';
import { faStrikethrough } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Toolbar.css';
import CustomEditor from '../Editor/CustomEditor';
import CustomIconButton from './CustomIconButton';
import ColorPicker from './ColorPicker';

const fontFamilies = [
  'AMATIC SC', 'Arial', 'Caveat', 'Comfortaa', 'Comic Sans MS', 
  'Courier New', 'EB Garamond', 'Georgia', 'Impact', 'Lexend',
  'Lobster', 'Lora', 'Merriweather', 'Nunito', 'Open Sans', 'Oswald',  
  'Pacifico', 'Playfair Display', 'Roboto', 'Roboto Mono', 'Roboto Serif',  
  'Spectral', 'Times New Roman', 'Trebuchet MS', 'Verdana' 
];

const FontControls = ({ editor }) => {
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial');

  const adjustFontSize = useCallback((increment) => {
    setFontSize(prevSize => {
      const size = prevSize + increment;
      const clampedSize = Math.min(Math.max(size, 1), 400);
      CustomEditor.setFontSize(editor, clampedSize);
      return clampedSize;
    });
  }, [editor]);

  const styles = [{
      title: 'Increase font size (Ctrl+Shift+.)',
      onClick: () => adjustFontSize(1),
      icon: <Add sx={{ fontSize: '16px' }} />
    }, {
      format: 'bold',
      title: 'Bold (Ctrl+B)',
      onClick: () => CustomEditor.toggleMark(editor, 'bold'),
      icon: <FormatBold />
    }, {
      format: 'italic',
      title: 'Italic (Ctrl+I)',
      onClick: () => CustomEditor.toggleMark(editor, 'italic'),
      icon: <FormatItalic />
    }, {
      format: 'underline',
      title: 'Underline (Ctrl+U)',
      onClick: () => CustomEditor.toggleMark(editor, 'underline'),
      icon: <FormatUnderlined />
    }, {
      format: 'strikethrough',
      title: 'Strikethrough',
      onClick: () => CustomEditor.toggleMark(editor, 'strikethrough'),
      icon: <FontAwesomeIcon icon={faStrikethrough} />
    }, {
      format: 'backgroundColor',
      title: 'Highlight color',
      onClick: () => CustomEditor.toggleMark(editor, 'backgroundColor'),
      icon: <BorderColor />
    }
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

  return (
    <>
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
      
      {styles.map((style, index) => (
        <CustomIconButton
          key={index}
          button={style}
          isBlock={false}
        />
      ))}
      <ColorPicker editor={editor} />
    </>
  );
};

export default FontControls;
