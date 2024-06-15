import { Transforms } from 'slate';
import { useSlate } from 'slate-react';

import './MentionList.css';
import useCustomEditor from '../../../hooks/useCustomEditor';

const MentionList = ({ mentionRef, collabs, index, target, setTarget }) => {
  const { insertMention } = useCustomEditor();
  const editor = useSlate();

  const handleInsertMention = (collab) => {
    Transforms.select(editor, target);
    insertMention(editor, collab.displayName);
    setTarget(null);
  };

  return (
    <div ref={mentionRef} className="mention-list">
      {collabs.map((collab, i) => (
        <div
          key={collab.uid}
          onClick={() => handleInsertMention(collab)}
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
