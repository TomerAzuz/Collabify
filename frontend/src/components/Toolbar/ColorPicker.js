import React, { useState, useMemo, useEffect } from 'react';
import { useSlate } from 'slate-react'
import { Editor } from 'slate';
import { Paper, Popover, IconButton } from '@mui/material';
import { FormatColorText } from '@mui/icons-material';

import { COLORS } from '../Common/Utils/constants';
import useCustomEditor from '../Hooks/useCustomEditor';
import CustomIconButton from './CustomIconButton';

const ColorPicker = () => {
  const [fontColor, setFontColor] = useState('black');
  const [openColorPicker, setOpenColorPicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const editor = useSlate();
  const { addMark } = useCustomEditor();

  const getCurrentColor = () => {
    const marks = Editor.marks(editor);
    return marks && marks.color !== undefined ? marks.color : 'black';
  };

  useEffect(() => {
    const color = getCurrentColor();
    setFontColor(color);
  }, [editor, fontColor]);

  const colorButtons = useMemo(() => {
    return COLORS.reduce((rows, color, index) => {
      if (index % 10 === 0) rows.push([]);
      rows[rows.length - 1].push(color);
      return rows;
    }, []);
  }, []);

  const toggleColorPicker = (e) => {
    e.preventDefault();
    setOpenColorPicker(!openColorPicker);
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const handleColorChange = (newColor) => {
    handleCloseColorPicker();
    setFontColor(newColor);
    addMark(editor, 'color', newColor);
  };

  const handleCloseColorPicker = () => {
    setOpenColorPicker(false);
    setAnchorEl(null);
  };

  const colorButton = {
    title: 'Text color',
    onClick: (e) => toggleColorPicker(e),
    icon: (
          <div className='color-indicator'>
            <FormatColorText />
            <span
              className='pallete'
              style={{ backgroundColor: getCurrentColor() }}
            />
          </div>
        ),
  };

  return (
    <>
      <CustomIconButton button={colorButton} isBlock={false} />
      <Popover
        open={openColorPicker}
        anchorEl={anchorEl}
        onClose={handleCloseColorPicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Paper sx={{ padding: '10px' }}>
          {colorButtons.map((rowColors, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', marginBottom: '5px' }}>
              {rowColors.map((color, colorIndex) => (
                <IconButton
                  key={colorIndex}
                  sx={{
                    backgroundColor: color,
                    borderRadius: '50%',
                    border: '1px solid grey',
                    width: '30px',
                    height: '30px',
                    margin: 0.3,
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      backgroundColor: color,
                      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                    },
                  }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          ))}
        </Paper>
      </Popover>
    </>
  );
};

export default ColorPicker;
