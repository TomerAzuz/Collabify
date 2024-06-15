import { Editor, Transforms, Range } from 'slate';

import useCustomEditor from '../../../hooks/useCustomEditor';

const MentionLogic = ({
  editor,
  collabs,
  index,
  target,
  setIndex,
  setTarget,
  setSearch,
}) => {
  const { insertMention } = useCustomEditor();

  const handleMentionAction = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const prevIndex = index >= collabs?.length - 1 ? 0 : index + 1;
        setIndex(prevIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const nextIndex = index <= 0 ? collabs?.length - 1 : index - 1;
        setIndex(nextIndex);
        break;
      case 'Tab':
      case 'Enter':
        e.preventDefault();
        Transforms.select(editor, target);
        insertMention(editor, collabs[index].displayName);
        setTarget(null);
        break;
      case 'Escape':
        e.preventDefault();
        setTarget(null);
        break;
    }
  };

  const handleMentionChange = () => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection);
      const wordBefore = Editor.before(editor, start, { unit: 'word' });
      const before = wordBefore && Editor.before(editor, wordBefore);
      const beforeRange = before && Editor.range(editor, before, start);
      const beforeText = beforeRange && Editor.string(editor, beforeRange);
      const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
      const after = Editor.after(editor, start);
      const afterRange = Editor.range(editor, start, after);
      const afterText = Editor.string(editor, afterRange);
      const afterMatch = afterText.match(/^(\s|$)/);

      if (beforeMatch && afterMatch) {
        setTarget(beforeRange);
        setSearch(beforeMatch[1]);
        setIndex(0);
        return;
      }
    }
    setTarget(null);
  };

  return { handleMentionChange, handleMentionAction };
};

export default MentionLogic;
