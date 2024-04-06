import { Editor, Transforms, Element, Range, Point, Path } from 'slate';

const LIST_TYPES = ['bulleted-list', 'numbered-list'];

const CustomEditor = {
  isMarkActive(editor, mark)  {
    const marks = Editor.marks(editor);
    return marks ? marks[mark] === true : false;
  },

  isBlockActive(editor, type) {
    const { selection } = editor;
    if (!selection) return false;

    const [match] = Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => 
        Element.isElement(n) &&
        n.type === type,
    });
    
    return !!match;
  },

  toggleMark(editor, mark)  {
    const isActive = this.isMarkActive(editor, mark);
    isActive ? Editor.removeMark(editor, mark) : 
               Editor.addMark(editor, mark, true);
  },

  toggleBlock(editor, type) {
    const isActive = this.isBlockActive(editor, type);
    const isList = LIST_TYPES.includes(type);
    
    Transforms.unwrapNodes(editor, {
      match: n => 
        Element.isElement(n) &&
        LIST_TYPES.includes(n.type),
      split: true,
    });

    const properties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : type,
    };

    Transforms.setNodes(editor, properties);

    if (!isActive && isList) {
      const block = { type, children: [] };
      Transforms.wrapNodes(editor, block);
    }
  },

  alignText(editor, value) {
    Transforms.setNodes(
      editor, 
      { textAlign: value },
      { match: n => Element.isElement(n) && 
                    Editor.isBlock(editor, n) }
    )
  },

  addMark(editor, mark, value) {
    Editor.addMark(editor, mark, value);
  },

  setFontSize(editor, fontSize) {
    Editor.addMark(editor, 'fontSize', fontSize);
  },

  insertParagraph(editor) {
    const marks = Editor.marks(editor);
    const fontSize = marks ? marks.fontSize : 16;
    Transforms.insertNodes(editor, {
      type: 'paragraph',
      children: [{ text: '' }],
      fontSize: fontSize,
    });
  },

  insertImage(editor, src)  {
    Transforms.insertNodes(editor, {
      type: 'image',
      data: { src: src },
      children: [{ text: '' }],
    });

    this.insertParagraph(editor);
  },

  insertTable(editor, rows, cols) {
    const { deleteBackward, deleteForward, insertBreak } = editor;

    editor.deleteBackward = unit => {
      const { selection } = editor;
      
      if (selection && Range.isCollapsed(selection)) {
        const [cell] = Editor.nodes(editor, {
          match: n => !Editor.isEditor(n) && 
                      Element.isElement(n) && 
                      n.type === 'table-cell'
        });
    
        if (cell) {
          const [, cellPath] = cell;
          const start = Editor.start(editor, cellPath);
    
          if (Point.equals(selection.anchor, start)) {
            return;
          }
        } else {
          // Check if the cursor is at the start of the table
          const [table] = Editor.nodes(editor, {
            match: n => !Editor.isEditor(n) && 
                        Element.isElement(n) && 
                        n.type === 'table',
          });
    
          if (table && Point.equals(selection.anchor, Editor.start(editor, []))) {
            return;
          }
          
          // Check if the cursor is at the start of a block node below the table
          const [blockNodeBelowTable] = Editor.nodes(editor, {
            match: n => Element.isElement(n) && 
                        Editor.isBlock(editor, n) &&
                        !Editor.isEditor(n) && 
                        !Path.isParent(Path.common(selection.anchor.path, []), selection.anchor.path) // Ensure it's not inside the table
          });
    
          if (blockNodeBelowTable && Point.equals(selection.anchor, Editor.start(editor, blockNodeBelowTable[1]))) {
            return;
          }
        }
      }
      deleteBackward(unit);
    };
    

    editor.deleteForward = unit => {
      const { selection } = editor;
    
      if (selection && Range.isCollapsed(selection)) {
        const [cell] = Editor.nodes(editor, {
          match: n => !Editor.isEditor(n) && 
                      Element.isElement(n) && 
                      n.type === 'table-cell',
        });
    
        if (cell) {
          const [, cellPath] = cell;
          const end = Editor.end(editor, cellPath);
    
          if (Point.equals(selection.anchor, end))  {
            return;
          }
        } else {
          // Check if the cursor is at the end of the table
          const [table] = Editor.nodes(editor, {
            match: n => !Editor.isEditor(n) && 
                        Element.isElement(n) && 
                        n.type === 'table',
          });
    
          if (table && Point.equals(selection.anchor, Editor.end(editor, []))) {
            return;
          }
          
          // Check if the cursor is at the end of a block node above the table
          const [blockNodeAboveTable] = Editor.nodes(editor, {
            match: n => Element.isElement(n) && 
                        Editor.isBlock(editor, n) &&
                        !Editor.isEditor(n) && 
                        !Path.isAncestor(Editor.path(editor, []), [])
          });
    
          if (blockNodeAboveTable && Point.equals(selection.anchor, Editor.end(editor, blockNodeAboveTable[1]))) {
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
          match: n => !Editor.isEditor(n) && 
                      Element.isElement(n) && 
                      n.type === 'table',
        });
        if (table) return;
      }
      insertBreak();
    };

    if (this.isBlockActive(editor, 'table'))  {
      return;
    }

    const tableCells = [];

    for (let i = 0; i < rows; i++) {
      const tableRow = [];
      for (let j = 0; j < cols; j++)  {
        tableRow.push({
          type: 'table-cell',
          children: [{ text: '' }],
        });
      }
      tableCells.push(tableRow);
    }

    const tableRows = tableCells.map((row) => ({
      type: 'table-row',
      children: row,
    }));

    const paragraph = { type: 'paragraph', children: [{ text: '' }] }
    const table = { type: 'table', children: tableRows };
    Transforms.insertNodes(editor, [table, paragraph]);
  },
};

export default CustomEditor;