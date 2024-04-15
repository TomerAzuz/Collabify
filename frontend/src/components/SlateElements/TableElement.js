import { Transforms } from 'slate';
import { useSlateStatic, ReactEditor, useSelected } from 'slate-react';
import { IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';

const TableElement = (props) => {
  const styles = {
    width: '80%',
    border: '1px solid black',
    borderCollapse: 'collapse',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, props.element);
  const isSelected = useSelected();

  const handleDelete = (e) => {
    e.preventDefault();
    Transforms.removeNodes(editor, { at: path });
  };

  return (
    <div style={{ position: 'relative' }}>
      <table style={styles}>
        <tbody {...props.attributes}>{props.children}</tbody>
      </table>
      {isSelected && (
        <Tooltip title="Delete Table">
          <IconButton
            onClick={(e) => handleDelete(e)}
            size="small"
            style={{
              position: 'absolute',
              top: '-30px',
              right: '5px',
              backgroundColor: '#f44336',
              color: '#ffffff',
            }}
          >
            <Delete fontSize='small' />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default TableElement;
