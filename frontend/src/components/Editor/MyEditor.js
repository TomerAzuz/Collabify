import React, { useCallback, useState } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';

import '../../App.css';
import DefaultElement from '../Renderers/DefaultElement.js';
import CodeElement from '../Renderers/CodeElement.js';
import QuoteElement from '../Renderers/QuoteElement.js';
import Leaf from '../Renderers/Leaf.js';
import H1Element from '../Renderers/H1Element.js';
import H2Element from '../Renderers/H2Element.js';
import CustomEditor from './CustomEditor.js';
import MyToolbar from '../Toolbar/Toolbar.js';
import ImageElement from '../Renderers/ImageElement.js';

const initialValue = [
    {
      type: 'paragraph',
      fontSize: 16,
      children: [
        { 
          text: 'A line of text in a paragraph.',
        },
      ],
    },
  ];

const MyEditor = () => {
    const [editor] = useState(() => withReact(withHistory(createEditor())));

    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props}/>
            case 'quote':
                return <QuoteElement {...props} />
            case 'h1':
                return <H1Element {...props} />
            case 'h2':
                return <H2Element {...props} />
            case 'image':
                return <ImageElement {...props} />
            default:
                return <DefaultElement {...props}/>
        }
    }, []);

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, []);

    const executeCommand = (e) => {
        if (!e.ctrlKey) {
            return;
        }
        if (e.shiftKey) {
            switch (e.code)  {
                // Align left
                case 'KeyL': {
                    e.preventDefault();
                    CustomEditor.alignText(editor, 'left');
                    break;
                }
                // Align center
                case 'KeyE': {
                    e.preventDefault();
                    CustomEditor.alignText(editor, 'center');
                    break;
                }
                // Align right
                case 'KeyR': {
                    e.preventDefault();
                    CustomEditor.alignText(editor, 'right');
                    break;
                }
                // Increment font size
                case 'Period': {
                    e.preventDefault();
                    CustomEditor.adjustFontSize(editor, 1);
                    break;
                }
                // Decrement font size
                case 'Comma': {
                    e.preventDefault();
                    CustomEditor.adjustFontSize(editor, -1);
                    break;
                }
                default:
                    break;
            }
        }
        
        switch (e.key) {
            // Code block
            case '`': {
                e.preventDefault();
                CustomEditor.toggleCodeBlock(editor);
                break;
            }
            // Bold mark
            case 'b': {
                e.preventDefault();
                CustomEditor.toggleBoldMark(editor);
                break;
            }
            // Italic mark
            case 'i': {
                e.preventDefault();
                CustomEditor.toggleItalicMark(editor);
                break;
            }
            // Underline mark
            case 'u': {
                e.preventDefault();
                CustomEditor.toggleUnderlineMark(editor);
                break;
            }
            // Redo
            case 'y': {
                e.preventDefault();
                CustomEditor.redo(editor, HistoryEditor);
                break;
            }
            // Undo
            case 'z': {
                e.preventDefault();
                CustomEditor.undo(editor, HistoryEditor);
                break;
            }
            default:
                break;
        }
    };

    return (
            <Slate editor={editor} initialValue={initialValue}>
                <MyToolbar editor={editor} historyEditor={HistoryEditor}/>
                <Editable 
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={e => executeCommand(e)}
                />
            </Slate>
    )
};

export default MyEditor;