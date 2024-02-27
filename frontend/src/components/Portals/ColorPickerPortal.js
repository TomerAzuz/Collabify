import { createPortal } from 'react-dom';
import ColorPicker from '../Toolbar/ColorPicker';

const ColorPickerPortal = ({ open, handleColorChange }) => {
    const portalContainer = document.getElementById('color-picker-portal');
    
    if (!open) return null;
  
    return createPortal(
      <ColorPicker handleColorChange={handleColorChange} />,
      portalContainer
    );
  };
  
  export default ColorPickerPortal;