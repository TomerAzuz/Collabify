import React from 'react'
import { Transforms } from 'slate';
import { useSlateStatic, useReadOnly, ReactEditor } from 'slate-react';

const CheckListItem = props => {
  const editor = useSlateStatic();
  const readOnly = useReadOnly();
  const { checked } = props.element;
  
  return (
    <div
      {...props.attributes}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        '& + &': {
          marginTop: 0,
        }
      }}
    >
      <span
        contentEditable={false}
        style={{
          marginRight: '0.75em',
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={e => {
            const path = ReactEditor.findPath(editor, props.element);
            const newProps = {
              checked: e.target.checked,
            };
            Transforms.setNodes(editor, newProps, { at : path });
          }}  
        />
      </span>
      <span
        contentEditable={!readOnly}
        suppressContentEditableWarning
        style={{
          flex: 1,
          opacity: checked ? 0.666 : 1,
          textDecoration: !checked ? 'none' : 'line-through',
          '&:focus': {
            outline: 'none'
          }
        }}
      >
        {props.children}
      </span>

    </div>
  );
};

export default CheckListItem;