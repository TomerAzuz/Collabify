import { Editor, Transforms, Element, Range, Point } from 'slate';
import { LIST_TYPES, TEXT_ALIGN_TYPES } from '../constants/constants';

const useCustomEditor = () => {
  const isMarkActive = (editor, mark) => {
    const marks = Editor.marks(editor);
    return marks ? marks[mark] === true : false;
  };

  const isBlockActive = (editor, type, blockType = 'type') => {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n[blockType] === type,
    });

    return !!match;
  };

  const toggleMark = (editor, mark) => {
    const isActive = isMarkActive(editor, mark);
    isActive
      ? Editor.removeMark(editor, mark)
      : Editor.addMark(editor, mark, true);
  };

  const toggleBlock = (editor, type) => {
    const isActive = isBlockActive(
      editor,
      type,
      TEXT_ALIGN_TYPES.includes(type) ? 'align' : 'type'
    );
    const isList = LIST_TYPES.includes(type);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        LIST_TYPES.includes(n.type) &&
        !TEXT_ALIGN_TYPES.includes(type),
      split: true,
    });

    let newProps;
    if (TEXT_ALIGN_TYPES.includes(type)) {
      newProps = {
        align: isActive ? undefined : type,
      };
    } else {
      newProps = {
        type: isActive ? 'paragraph' : isList ? 'list-item' : type,
      };
    }

    Transforms.setNodes(editor, newProps);

    if (!isActive && isList) {
      const block = { type, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  };

  const addMark = (editor, mark, value) => {
    Editor.addMark(editor, mark, value);
  };

  const setTextSize = (editor, fontSize) => {
    Editor.addMark(editor, 'fontSize', fontSize);
  };

  const insertParagraph = (editor) => {
    const marks = Editor.marks(editor);
    const fontSize = marks ? marks.fontSize : 16;
    Transforms.insertNodes(editor, {
      type: 'paragraph',
      children: [{ text: '' }],
      fontSize: fontSize,
    });
  };

  const insertImage = (editor, src) => {
    Transforms.insertNodes(editor, {
      type: 'image',
      data: { src: src },
      children: [{ text: '' }],
    });

    insertParagraph(editor);
  };

  const insertVideo = (editor, url) => {
    Transforms.insertNodes(editor, {
      type: 'video',
      url: url,
      children: [{ text: '' }],
    });

    insertParagraph(editor);
  };

  const insertTable = (editor, rows, cols) => {
    if (isBlockActive(editor, 'table')) {
      return;
    }

    const tableRows = Array.from({ length: rows }, () => ({
      type: 'table-row',
      children: Array.from({ length: cols }, () => ({
        type: 'table-cell',
        children: [{ text: '' }],
      })),
    }));

    const paragraph = { type: 'paragraph', children: [{ text: '' }] };
    const table = { type: 'table', children: tableRows };
    Transforms.insertNodes(editor, [table, paragraph]);
  };

  const insertMention = (editor, collab) => {
    const mention = {
      type: 'mention',
      collab: collab,
      children: [{ text: '' }],
    };

    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
  };

  const withMentions = (editor) => {
    const { isInline, isVoid, markableVoid } = editor;

    editor.isInline = (element) => {
      return element.type === 'mention' ? true : isInline(element);
    };

    editor.isVoid = (element) => {
      return element.type === 'mention' ? true : isVoid(element);
    };

    editor.markableVoid = (element) => {
      return element.type === 'mention' || markableVoid(element);
    };

    return editor;
  };

  const withTables = (editor) => {
    const { deleteBackward, deleteForward, insertBreak } = editor;

    editor.deleteBackward = (unit) => {
      const { selection } = editor;

      if (selection && Range.isCollapsed(selection)) {
        const [cell] = Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            Element.isElement(n) &&
            n.type === 'table-cell',
        });

        if (cell) {
          const [, cellPath] = cell;
          const start = Editor.start(editor, cellPath);

          if (Point.equals(selection.anchor, start)) {
            return;
          }
        }
      }

      deleteBackward(unit);
    };

    editor.deleteForward = (unit) => {
      const { selection } = editor;

      if (selection && Range.isCollapsed(selection)) {
        const [cell] = Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            Element.isElement(n) &&
            n.type === 'table-cell',
        });

        if (cell) {
          const [, cellPath] = cell;
          const end = Editor.end(editor, cellPath);

          if (Point.equals(selection.anchor, end)) {
            return;
          }
        }
      }

      deleteForward(unit);
    };

    editor.insertBreak = () => {
      const { selection } = editor;

      if (selection) {
        const [table] = Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
        });

        if (table) {
          return;
        }
      }

      insertBreak();
    };

    return editor;
  };

  const withImages = (editor) => {
    const { isVoid } = editor;

    editor.isVoid = (element) => {
      return element.type === 'image' ? true : isVoid(element);
    };

    return editor;
  };

  const withEmbeds = (editor) => {
    const { isVoid } = editor;

    editor.isVoid = (element) => {
      return element.type === 'video' ? true : isVoid(element);
    };

    return editor;
  };

  const withChecklist = (editor) => {
    const { deleteBackward } = editor;

    editor.deleteBackward = (...args) => {
      const { selection } = editor;

      if (selection && Range.isCollapsed(selection)) {
        const [match] = Editor.nodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            Element.isElement(n) &&
            n.type === 'check-list-item',
        });

        if (match) {
          const [, path] = match;
          const start = Editor.start(editor, path);

          if (Point.equals(selection.anchor, start)) {
            const newProps = {
              type: 'paragraph',
            };
            Transforms.setNodes(editor, newProps, { at: path });
          }
        }
      }
      deleteBackward(...args);
    };

    return editor;
  };

  return {
    isMarkActive,
    isBlockActive,
    toggleMark,
    toggleBlock,
    addMark,
    setTextSize,
    insertParagraph,
    insertImage,
    insertVideo,
    insertTable,
    insertMention,
    withImages,
    withMentions,
    withEmbeds,
    withTables,
    withChecklist,
  };
};

export default useCustomEditor;
