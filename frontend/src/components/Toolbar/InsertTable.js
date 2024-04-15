import React, { useState } from 'react';
import { useSlate } from 'slate-react'
import TableChart from '@mui/icons-material/TableChart';
import { Grid, Dialog, DialogTitle, DialogActions, DialogContent, Button, TextField } from '@mui/material';

import CustomEditor from '../Editor/CustomEditor';
import CustomIconButton from './CustomIconButton';

const InsertTable = () => {
  const editor = useSlate();
  const [rows, setRows] = useState(1);
  const [cols, setCols] = useState(1);
  const [isDimensionsOpen, setIsDimensionsOpen] = useState(false);
  
  const handleInsertTable = () => {
    if (rows < 1 || rows > 63 || cols < 1 || cols > 63) {
      alert('Invalid table dimensions');
      return;
    }
    CustomEditor.insertTable(editor, rows, cols);
    setIsDimensionsOpen(false);
  };

  return (
    <>
      <CustomIconButton 
        button={{
          title: "Insert table",
          onClick: () => setIsDimensionsOpen(true),
          icon: <TableChart />
        }}
      />
      <Dialog open={isDimensionsOpen} onClose={() => setIsDimensionsOpen(false)}>
        <DialogTitle>Insert Table</DialogTitle>
        <DialogContent>
        <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin='dense'
                id='cols'
                label="Number of columns"
                type='number'
                value={cols}
                onChange={(e) => setCols(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin='dense'
                id='rows'
                label="Number of rows"
                type='number'
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDimensionsOpen(false)}>Cancel</Button>
          <Button onClick={handleInsertTable}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InsertTable;