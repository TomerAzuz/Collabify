import React, { useState, useCallback, useMemo } from 'react';
import { useSlate } from 'slate-react'
import { Editor } from 'slate';
import { TextField, IconButton, Tooltip, Select, MenuItem } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, Add, Remove, BorderColor } from '@mui/icons-material';
import { faStrikethrough } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './Toolbar.css';
import CustomEditor from '../Editor/CustomEditor';
import CustomIconButton from './CustomIconButton';
import ColorPicker from './ColorPicker';

const FontControls = () => {
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const editor = useSlate();

  const fontFamilies = useMemo(() => [
    'AMATIC SC', 'Arial', 'Caveat', 'Comfortaa', 'Comic Sans MS', 
    'Courier New', 'EB Garamond', 'Georgia', 'Impact', 'Lexend',
    'Lobster', 'Lora', 'Merriweather', 'Montserrat', 'Nunito', 'Open Sans', 'Oswald',  
    'Pacifico', 'Playfair Display', 'PT Mono', 'Roboto', 'Roboto Mono', 'Roboto Serif',  
    'Source Code Pro', 'Spectral', 'Times New Roman', 'Trebuchet MS', 'Verdana' 
  ], []);

  const getFontSize = () => {
    const marks = Editor.marks(editor);
    return marks && marks.fontSize !== undefined ? marks.fontSize : fontSize;
  };

  const getFontFamily = () => {
    const marks = Editor.marks(editor);
    return marks && marks.fontFamily !== undefined ? marks.fontFamily : fontFamily;;
  };

  const adjustFontSize = useCallback((increment) => {
    setFontSize(prevSize => {
      const size = prevSize + increment;
      const clampedSize = Math.min(Math.max(size, 1), 400);
      CustomEditor.setFontSize(editor, clampedSize);
      return clampedSize;
    });
  }, [editor]);

  const buttons = useMemo(() => [{
      title: 'Increase font size',
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
  ], [editor, adjustFontSize]);  

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
          sx={{ width: '100px', textAlign: 'center', margin: '2px' }}
          value={getFontFamily()}
          onChange={changeFontFamily}
        >
          {fontFamilies.map((font, index) => (
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
          variant="outlined"
          sx={{ width: '50px', textAlign: 'center' }}
          value={getFontSize()}
          onChange={(e) => changeFontSize(e)}
        />
      </Tooltip>
      {buttons.map((button, index) => (
        <CustomIconButton
          key={index}
          button={button}
          isBlock={false}
        />
      ))}
      <ColorPicker />
    </>
  );
};

export default FontControls;
