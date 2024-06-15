import { AppBar, Toolbar } from '@mui/material';

import '../../App.css';
import './Toolbar.css';
import FontControls from './FontControls.js';
import AlignmentControls from './AlignmentControls.js';
import Actions from './Actions.js';
import FormattingControls from './FormattingControls.js';
import InsertImage from './InsertImage.js';
import InsertTable from './InsertTable.js';
import InsertEmbed from './InsertEmbed.js';
import Mode from './Mode.js';

const MyToolbar = ({ historyEditor, mode, setMode }) => {
  return (
    <AppBar position="sticky" sx={{ zIndex: 1, borderRadius: '10px' }}>
      <Toolbar className="toolbar">
        <Actions historyEditor={historyEditor} />
        <FontControls />
        <AlignmentControls />
        <FormattingControls />
        <InsertImage />
        <InsertEmbed />
        <InsertTable />
        <Mode mode={mode} setMode={setMode} />
      </Toolbar>
    </AppBar>
  );
};

export default MyToolbar;
