import React from 'react';
import { Transforms } from 'slate';
import { useSlateStatic, useReadOnly, ReactEditor } from 'slate-react';

const CheckListItem = (props) => {
  const editor = useSlateStatic();
  const readOnly = useReadOnly();
  const { checked } = props.element;
  const isChecked = checked || false;

  const styles = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& + &': {
      marginTop: 0,
    },
    textAlign: props.element.align || '',
    fontSize: `${props.element.fontSize || '14'}pt`,
    fontFamily: props.element.fontFamily || '',
    lineHeight: props.element.lineHeight || 1.0,
    margin: `${props.element.margin || 1}em`,
    padding: 0,
  };

  return (
    <div {...props.attributes} style={styles}>
      <span
        contentEditable={false}
        style={{
          marginRight: '0.75em',
        }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => {
            const path = ReactEditor.findPath(editor, props.element);
            const newProps = {
              checked: e.target.checked,
            };
            Transforms.setNodes(editor, newProps, { at: path });
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
            outline: 'none',
          },
        }}
      >
        {props.children}
      </span>
    </div>
  );
};

export default CheckListItem;
