import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Slate, Editable, withReact } from 'slate-react';
import { Editor, createEditor, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';
import html2canvas from 'html2canvas';
import debounce from 'lodash/debounce';
import { withYjs, withCursors, YjsEditor } from '@slate-yjs/core'

import '../../App.css';
import './MyEditor.css';

import { fetchDataById, putData } from '../../apiService';
import CustomEditor from './CustomEditor';
import blankTemplate from '../Templates/blankTemplate';
import MyToolbar from '../Toolbar/Toolbar';
import MenuBar from '../MenuBar/MenuBar';
import Leaf from '../Renderers/Leaf';
import DefaultElement from '../Renderers/DefaultElement';
import CodeElement from '../Renderers/CodeElement';
import QuoteElement from '../Renderers/QuoteElement';
import H1Element from '../Renderers/H1Element';
import H2Element from '../Renderers/H2Element';
import ImageElement from '../Renderers/ImageElement';
import BulletedListElement from '../Renderers/BulletedListElement';
import NumberedListElement from '../Renderers/NumberedListElement';
import TableElement from '../Renderers/TableElement';
import TableRow from '../Renderers/TableRow';
import TableCell from '../Renderers/TableCell';
import ListItemElement from '../Renderers/ListItemElement';
import { Cursors } from './Cursors';
import { useAuth } from '../Auth/AuthContext';

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+y': 'redo',
    'mod+z': 'undo',
    'mod+`': 'code',
};

const MyEditor = ({ sharedType, provider }) => {
    const { user } = useAuth();
    const { id } = useParams();
    const [doc, setDoc] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetchDataById('documents', id);
                setDoc(response);
            } catch (error) {
                console.log('Failed to fetch document with id ', id, ": ", error);
            } 
        };
        fetchDocument();
    }, [id]);

    const initialValue = useMemo(() => {
        return doc?.content || blankTemplate();
    }, []);

    let cursorColors = [
        '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', 
        '#00ffff', '#ff9900', '#9900ff', '#0099ff', '#ff0099', 
        '#99ff00', '#00ff99', '#ff6600', '#6600ff'
      ];

    const getRandomColor = () => {
        const index = Math.floor(Math.random() * cursorColors.length);
        const color = cursorColors[index];
        cursorColors.splice(index, 1);
        return color;
    };

    const editor = useMemo(() => {
        const e = withReact(withHistory(withCursors(withYjs(createEditor(), sharedType), 
        provider.awareness, {
            data: {
                name: user.displayName || user.email,
                color: getRandomColor(),
            },
        })));
    
        // Ensure editor always has at least 1 valid child
        const { normalizeNode } = e;
        e.normalizeNode = entry => {
          const [node] = entry;
    
          if (!Editor.isEditor(node) || node.children.length > 0) {
            return normalizeNode(entry);
          }
          Transforms.insertNodes(editor, initialValue, { at: [0] });
        }
    
        return e;
      }, [sharedType, initialValue, provider.awareness]);

    useEffect(() => {
        YjsEditor.connect(editor);
        return () => YjsEditor.disconnect(editor)
      }, [editor]);

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
                return <DefaultElement {...props} />
        }
    }, []);

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, []);    

    const saveDocument = async (e) => {
        e.preventDefault();
        try {
            const previewUrl = await captureDocumentPreview(e);            
            const document = {
                title: doc.title,
                content: doc.content,
                previewUrl: previewUrl,
            };
            const response = await putData('documents', doc.id, document);
            console.log('Document saved successfully.', response);
        } catch (error) {
            console.log('Error saving document:', error);
        }
    };

    const captureDocumentPreview = useCallback(async () => {
        try {
          console.log('Waiting for DOM updates...');
          await new Promise(resolve => setTimeout(resolve, 100));
      
          const documentContent = document.querySelector('.editor-container');
          if (!documentContent) {
            console.warn('Document container not found. Returning null.');
            return null;
          }
          console.log('Found document content element.');
      
          const canvas = await html2canvas(documentContent);
          return canvas.toDataURL('image/jpeg');
      
        } catch (error) {
          console.error('Error capturing preview:', error);
          return null;
        }
      }, []);

      const updateContent = (newValue) => {
        setDoc(prevDoc => ({
            ...prevDoc,
            content: newValue
        }));
    };

    const debouncedUpdateContent = useMemo(
        () => debounce((value) => {
            updateContent(value);
        }, 500),
        []);
     
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
            <MenuBar doc={doc} user={user} />
            <MyToolbar editor={editor} historyEditor={HistoryEditor}/>
            <div className='editor-container'>
                <Cursors>
                    <Editable 
                        readOnly={doc && doc.createdBy && doc.createdBy !== user.uid && doc.role === 'Viewer'}
                        placeholder='Start typing here...'
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        spellCheck
                        autoFocus
                        onKeyDown={e => {
                            for (const hotkey in HOTKEYS) {
                                if (isHotkey(hotkey, e)) {
                                    e.preventDefault();
                                    const mark = HOTKEYS[hotkey];
                                    CustomEditor.toggleMark(editor, mark);
                                }
                            }
                            if (e.ctrlKey && e.key === 's') {
                                e.preventDefault();
                                saveDocument(e);
                            }
                        }}
                    />
                </Cursors>
            </div>
        </Slate>
    );
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