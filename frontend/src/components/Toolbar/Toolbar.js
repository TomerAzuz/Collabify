import { AppBar, Toolbar } from '@mui/material';
import '../../App.css';
import './Toolbar.css';

import FontControls from './FontControls.js';
import AlignmentControls from './AlignmentControls.js';
import InsertImage from './InsertImage.js';
import Actions from './Actions.js';
import FormattingControls from './FormattingControls.js';
import InsertTable from './InsertTable.js';

const MyToolbar = ({ editor, historyEditor }) => {
  return (
    <AppBar 
      position="sticky" 
      sx={{ zIndex: 1000, backgroundColor: '#f5f5f5' }}>
      <Toolbar className='toolbar'>
        <Actions editor={editor} historyEditor={historyEditor} />
        <FontControls editor={editor}/>
        <AlignmentControls editor={editor}/>       
        <FormattingControls editor={editor}/>
        <InsertImage editor={editor} />
        <InsertTable editor={editor}/>
      </Toolbar>
    </AppBar>
  );
};

export default MyToolbar;
