import React, { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';
import html2canvas from 'html2canvas';
import debounce from 'lodash/debounce';

import '../../App.css';
import './MyEditor.css';
import CustomEditor from './CustomEditor.js';
import { putData } from '../../apiService';
import MenuBar from '../MenuBar/MenuBar.js';
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

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+y': 'redo',
    'mod+z': 'undo',
    'mod+`': 'code',
}

const MyEditor = () => {
    const editor = useMemo(() => withReact(withHistory(createEditor())), []);
    const location = useLocation();
    const doc = location.state && location.state.document;

    const initialValue = useMemo(() => {
        if (doc !== null && doc !== undefined) {
            try {
                return doc.content;
            } catch (error) {
                console.error('Error fetching document content:', error);
            }
        }
        return [
            {
              type: 'paragraph',
              fontSize: 16,
              children: [{ text: 'A line of text in a paragraph.' }],
            },
          ];
    }, [doc]);

    const [content, setContent] = useState(initialValue);

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

    const saveDocument = async (e) => {
        e.preventDefault();
        try {
            const previewUrl = await captureDocumentPreview(e);
            console.log(previewUrl);
            const data = {
                title: "Title",
                content: content,
                previewUrl: previewUrl,
            };

            const response = await putData('documents', doc.id, data);
            console.log('Document saved successfully.', response);
        } catch (error) {
            console.log('Error saving document:', error);
        }
    }

    const captureDocumentPreview = useCallback(async (e) => {
        try {
            // Wait for the DOM to update
            await new Promise(resolve => setTimeout(resolve, 100));

            // Capture document content
            const documentContent = document.querySelector('.editor-container');
            const canvas = await html2canvas(documentContent)

            return canvas.toDataURL('image/jpeg');

        } catch (error) {
          console.error('Error capturing preview:', error);
          return null;
        }
      }, []);

      const debouncedUpdateContent = useMemo(
        () => debounce((value) => {
            setContent(value);
        }, 500),
        [setContent]
    );
     
    return (
        <Slate 
            editor={editor} 
            initialValue={initialValue}
            onChange={value => {
                const isAstChange = editor.operations.some(
                    op => 'set_selection' !== op.type
                )
                if (isAstChange) {                    
                    debouncedUpdateContent(value);
                }
            }}
        >
            <MenuBar />
            <MyToolbar editor={editor} historyEditor={HistoryEditor}/>
            <div className='editor-container'>
                <Editable 
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    onKeyDown={e => {
                        for (const hotkey in HOTKEYS) {
                            if (isHotkey(hotkey, e)) {
                                e.preventDefault();
                                const mark = HOTKEYS[hotkey];
                                CustomEditor.toggleMark(editor, mark);
                            }
                        }
                        if (e.ctrlKey && e.key === 's') {
                           saveDocument(e);
                        }
                    }}
                    spellCheck
                    autoFocus
                />
            </div>
        </Slate>
    )
};

export default MyEditor;

/*
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
*/