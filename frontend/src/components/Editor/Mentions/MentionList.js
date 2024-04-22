import { Transforms } from 'slate';
import { useSlate } from 'slate-react'

import useCustomEditor from '../../Hooks/useCustomEditor.js';

const MentionList = ({ mentionRef, collabs, index, target, setTarget }) => {
  const { insertMention } = useCustomEditor();
  const editor = useSlate();

  return (
    <div
      ref={mentionRef}
      style={{
        top: '-9999px',
        left: '-9999px',
        position: 'absolute',
        zIndex: 1,
        padding: '3px',
        background: 'white',
        borderRadius: '4px',
        boxShadow: '0 1px 5px rgba(0,0,0,.2)',
      }}
    >
      {collabs.map((collab, i) => (
        <div
          key={collab.uid}
          onClick={() => {
            Transforms.select(editor, target);
            insertMention(editor, collab.displayName);
            setTarget(null);
          }}
          style={{
            padding: '1px 3px',
            borderRadius: '3px',
            background: i === index ? '#B4D5FF' : 'transparent',
          }}
        >
          {collab.displayName}
        </div>
      ))}
    </div>
  );
};

export default MentionList;