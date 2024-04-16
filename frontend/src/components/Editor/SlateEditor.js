import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Slate, Editable, withReact } from 'slate-react';
import { Editor, createEditor, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { withYjs, withCursors, YjsEditor } from '@slate-yjs/core'
import isHotkey from 'is-hotkey';

import '../../App.css';
import './SlateEditor.css';
import { useAuth } from '../Auth/AuthContext.js';
import useDocuments from '../CustomHooks/useDocumentFunctions.js';
import Loader from '../Common/Loader/Loader.js';
import CustomEditor from './CustomEditor.js';
import MyToolbar from '../Toolbar/Toolbar.js';
import MenuBar from '../MenuBar/MenuBar.js';
import Renderer from '../SlateElements/Renderer.js';
import { Cursors } from './Cursors/Cursors.js';

const HOTKEYS = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+y': 'redo',
    'mod+z': 'undo',
    'mod+`': 'code',
    'mod+shift+l': 'left',
    'mod+shift+r': 'right',
    'mod+shift+e': 'center'
};

const SlateEditor = ({ sharedType, provider }) => {
  const { user } = useAuth();
  const editorRef = useRef(null);
  const location = useLocation();
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [mode, setMode] = useState('Editor');
  const { saveDocument, fetchDocument } = useDocuments();
  
  const hasEditorPermission = doc?.permission === 'Editor';
  const canEdit = doc?.createdBy === user?.uid || hasEditorPermission;

  const cursorColors = useCallback(() => [
    '#ff0000', '#00ff00', '#0000ff', '#ff00ff', 
    '#00ffff', '#ff9900', '#9900ff', '#0099ff',  
    '#ff0099', '#99ff00', '#00ff99', '#ff6600', 
    '#6600ff'
  ], []);

  const getRandomColor = useCallback(() => {
    const index = Math.floor(Math.random() * cursorColors.length);
    return cursorColors[index];
  }, [cursorColors]);

  useEffect(() => {
    const getDoc = async () => {
      try {
        const fetchedDoc = await fetchDocument(id);
        setDoc(fetchedDoc);
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };
    location.state ? setDoc(location.state.doc) : getDoc();
  }, [location.state, fetchDocument, id]);

  const editor = useMemo(() => { 
    if (!doc) return null;

    const e = withReact(withHistory(withCursors(withYjs(createEditor(), sharedType), 
    provider.awareness, {
      data: {
        name: user?.displayName || user?.email,
        color: getRandomColor(),
      }
    })));

    const { normalizeNode } = e;

    e.normalizeNode = entry => {
      const [node] = entry;

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry);
      }
      Transforms.insertNodes(e, doc.content, { at: [0] });
    }
    return e;
  }, [doc]);
  
  useEffect(() => {
    if (editor) {
      YjsEditor.connect(editor);
      return () => YjsEditor.disconnect(editor)
    }
  }, [editor]);   

  const handleHotkeyAction = useCallback((e, hotkey) => {
    if (hotkey === 'mod+y') {
      HistoryEditor.redo(editor);
    } else if (hotkey === 'mod+z') {
      HistoryEditor.undo(editor);
    } else {
      const mark = HOTKEYS[hotkey];
      CustomEditor.alignText(editor, e.shiftKey ? 
                              mark : CustomEditor.toggleMark(editor, mark));
    }
  }, [editor]);
    
  const handleKeyDown = useCallback(async (e) => {
    if (!canEdit) {
      return;
    }
    if (e.ctrlKey && e.key === 's') {
      // Save document
      e.preventDefault();
      const response = await saveDocument(doc, editorRef, true);
      setDoc(response);
    } else if (e.ctrlKey) {
      // Check if hotkey is pressed
      const hotkey = Object.keys(HOTKEYS).find(key => isHotkey(key, e));
      if (hotkey) {
        e.preventDefault();
        handleHotkeyAction(e, hotkey);
      }
    }
  }, [canEdit, handleHotkeyAction]);

  if (!doc) {
    return <Loader />;
  }

  return (
    <Slate
      editor={editor}
      initialValue={doc.content}
    >
      <>
        {(canEdit || doc.permission === 'Editor') && (
          <>
            <MenuBar 
              doc={doc} 
              editorRef={editorRef}
              sx={{ width: '100vw' }}
            />
            <MyToolbar 
              editor={editor} 
              historyEditor={HistoryEditor} 
              mode={mode}
              setMode={setMode}
              sx={{ width: '80vw' , margin: '0 auto' }} 
            />
          </>
        )}
          <div ref={editorRef}>
            <Cursors>
              <Editable
                readOnly={!canEdit || mode !== 'Editor'}
                renderElement={Renderer.renderElement}
                renderLeaf={Renderer.renderLeaf}
                spellCheck
                autoFocus
                onKeyDown={e => handleKeyDown(e)}
                className='editor-container'
              />
            </Cursors>
          </div>
      </>
    </Slate>
  );
};

export default SlateEditor;

