import React, { useCallback, useMemo } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';

import '../../App.css';
import './MyEditor.css';
import CustomEditor from './CustomEditor.js';
import MyToolbar from '../Toolbar/Toolbar.js';
import Leaf from '../renderers/Leaf.js';
import DefaultElement from '../renderers/DefaultElement.js';
import CodeElement from '../renderers/CodeElement.js';
import QuoteElement from '../renderers/QuoteElement.js';
import H1Element from '../renderers/H1Element.js';
import H2Element from '../renderers/H2Element.js';
import ImageElement from '../renderers/ImageElement.js';
import BulletedListElement from '../renderers/BulletedListElement.js';
import NumberedListElement from '../renderers/NumberedListElement.js';
import TableElement from '../renderers/TableElement.js';
import TableRow from '../renderers/TableRow.js';
import TableCell from '../renderers/TableCell.js';
import ListItemElement from '../renderers/ListItemElement.js';

const MyEditor = () => {
    const editor = useMemo(() => withReact(withHistory(createEditor())), []);
    const initialValue = useMemo(
        () => 
        JSON.parse(localStorage.getItem('content')) || [
        {
          type: 'paragraph',
          fontSize: 16,
          children: [
            { 
              text: 'A line of text in a paragraph.',
            },
          ],
        },
      ], 
      []
    );

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
            case 'bulleted-list':
                return <BulletedListElement {...props} />
            case 'numbered-list':
                return <NumberedListElement {...props} />
            case 'list-item':
                return <ListItemElement {...props} />
            case 'table':
                return <TableElement {...props} />
            case 'table-row':
                return <TableRow {...props} />
            case 'table-cell':
                return <TableCell {...props} />
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
                CustomEditor.toggleBlock(editor, 'code');
                break;
            }
            // Bold mark
            case 'b': {
                e.preventDefault();
                CustomEditor.toggleMark(editor, 'bold');
                break;
            }
            // Italic mark
            case 'i': {
                e.preventDefault();
                CustomEditor.toggleMark(editor, 'italic');
                break;
            }
            // Underline mark
            case 'u': {
                e.preventDefault();
                CustomEditor.toggleMark(editor, 'underline');
                break;
            }

            // Redo
            case 'y': {
                e.preventDefault();
                HistoryEditor.redo(editor);
                break;
            }
            // Undo
            case 'z': {
                e.preventDefault();
                HistoryEditor.undo(editor);
                break;
            }
            default:
                break;
        }
    };

    return (
        <Slate 
            editor={editor} 
            initialValue={initialValue}
            onChange={value => {
                const isAstChange = editor.operations.some(
                    op => 'set_selection' !== op.type
                )
                if (isAstChange) {
                    const content = JSON.stringify(value);
                    localStorage.setItem('content', content);
                }
            }}
        >
            <MyToolbar editor={editor} historyEditor={HistoryEditor}/>
            <div className='editor-container'>
                <Editable 
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={e => executeCommand(e)}
                    spellCheck
                    autoFocus
                    style={{
                        outline: 'none'
                    }}
                />
            </div>
        </Slate>
    )
};

export default MyEditor;