import { Editor, Transforms, Element } from 'slate';

const CustomEditor = {

  isMarkActive(editor, mark)  {
    const marks = Editor.marks(editor);
    return marks ? marks[mark] === true : false;
  },

  isBlockActive(editor, type) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === type,
    });
    return !!match;
  },

  toggleMark(editor, mark)  {
    const isActive = this.isMarkActive(editor, mark);
    isActive ? Editor.removeMark(editor, mark) : 
    Editor.addMark(editor, mark, true);
  },

  alignText(editor, value) {
    Transforms.setNodes(
      editor, 
      { textAlign: value },
      { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
    )
  },

  toggleBlock(editor, type) {
    const isActive = this.isBlockActive(editor, type);
    Transforms.setNodes(
      editor,
      { type: isActive ? 'paragraph' : type },
      { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
    );
  },

  setFontSize(editor, fontSize) {
    Editor.addMark(editor, 'fontSize', fontSize);
  },

  setFontFamily(editor, fontFamily) {
    Editor.addMark(editor, 'fontFamily', fontFamily);
  },

  setTextColor(editor, color) {
    Editor.addMark(editor, 'color', color);
  },

  adjustFontSize(editor, increment) {
    const marks = Editor.marks(editor);
    const fontSize = marks ? Math.min(Math.max(marks.fontSize + increment, 1), 400) : 16;
    this.setFontSize(editor, fontSize);
  },

  insertImage(editor, src)  {
    const marks = Editor.marks(editor);
    const fontSize = marks ? marks.fontSize : 16;
    Transforms.insertNodes(editor, {
      type: 'image',
      data: { src: src },
      children: [{ text: '' }],
      isVoid: true,
    });
    Transforms.insertNodes(editor, {
      type: 'paragraph',
      children: [{ text: '' }],
      fontSize: fontSize,
    });
  },
}

export default CustomEditor;