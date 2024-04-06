import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Slate, Editable, withReact } from 'slate-react';
import { Editor, createEditor, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { withYjs, withCursors, YjsEditor } from '@slate-yjs/core'
import isHotkey from 'is-hotkey';
import html2canvas from 'html2canvas';
import debounce from 'lodash/debounce';

import '../../App.css';
import './SlateEditor.css';
import { getDocumentById, updateDocument } from '../Services/documentService';
import Loader from '../Common/Loader/Loader.js';
import Logo from '../Common/Logo/Logo.js';
import CustomEditor from './CustomEditor';
import blankTemplate from '../Templates/blankTemplate';
import MyToolbar from '../Toolbar/Toolbar';
import MenuBar from '../MenuBar/MenuBar';
import Renderer from '../Renderers/Renderer';
import { Cursors } from './Cursors/Cursors.js';
import { useAuth } from '../Auth/AuthContext';

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
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef(null);

  const hasEditorPermission = doc?.permission === 'Editor';
  const canEdit = doc?.createdBy === user?.uid || hasEditorPermission;
  const canSave = canEdit && !loading;    

  const captureDocumentPreview = async () => {
    const editorElement = editorRef.current;
    if (!editorElement) {
      console.warn('Document container not found. Returning null.');
      return null;
    }
    const canvas = await html2canvas(editorElement);
    return canvas.toDataURL('image/jpeg');
  };

  const saveDocument = useCallback(async () => {
    try {
      setLoading(true);
      const previewUrl = await captureDocumentPreview();            
      const document = {
        content: editor.children,
        previewUrl: previewUrl,
      };
      const response = await updateDocument(doc.id, document);
      console.log('Document saved successfully.', response);
    } catch (error) {
      console.error('Error saving document:', error.message);
    } finally {
      setLoading(false);
    }
  }, [doc, captureDocumentPreview]);


  const addCollaborator = async (document) => {
    try {
      const response = await updateDocument(document.id, {
        collaborators: [...document.collaborators, user.uid],
      });
      console.log("Collaborators updated successfully. ", response);
    } catch (error) {
      console.error('Failed to update collaborators: ', error.message);
    }
  };
  
  const fetchDocument = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDocumentById(id);
      setDoc(response);
      if (response.createdBy !== user.uid) {
        addCollaborator(response);
      }
    } catch (error) {
      console.error('Failed to fetch document with id ', id, ": ", error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchDocument();
  }, [fetchDocument]);

  const initialValue = useMemo(() => doc?.content || blankTemplate(), [doc]);

  const cursorColors = useMemo(() => [
    '#ff0000', '#00ff00', '#0000ff', '#ff00ff', 
    '#00ffff', '#ff9900', '#9900ff', '#0099ff',  
    '#ff0099', '#99ff00', '#00ff99', '#ff6600', 
    '#6600ff'
  ], []);

  const getRandomColor = useCallback(() => {
    const index = Math.floor(Math.random() * cursorColors.length);
    const color = cursorColors[index];
    return color;
  }, []);

  const editor = useMemo(() => {
    const e = withReact(withHistory(withCursors(withYjs(createEditor(), sharedType), 
              provider.awareness)));

    const { normalizeNode } = e;
    e.normalizeNode = entry => {
      const [node] = entry;

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry);
      }
      Transforms.insertNodes(e, initialValue, { at: [0] });
    }

    return e;
  }, []);
  
  useEffect(() => {
    if (user) {
      provider.awareness.setLocalStateField('data', {
        name: user.displayName || user.email,
        color: getRandomColor(),
      });
    }
  }, [user]);

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
      CustomEditor.alignText(editor, e.shiftKey ? mark : CustomEditor.toggleMark(editor, mark));
    }
  }, [editor]);
    
  const handleKeyDown = useCallback(e => {
    if (e.ctrlKey && e.key === 's' && canSave) {
      e.preventDefault();
      saveDocument();
    } else {
      const hotkey = Object.keys(HOTKEYS).find(key => isHotkey(key, e));
      if (hotkey) {
        e.preventDefault();
        handleHotkeyAction(e, hotkey);
      }
    }
  }, [canSave, saveDocument, handleHotkeyAction]);

  const handleEditorChange = useCallback(
    debounce(value => {
      setDoc(prevDoc => ({ ...prevDoc, content: value }));
    }, 500),
    [setDoc]
  );

  return (
    <Slate
      editor={editor}
      initialValue={doc?.content || initialValue}
      onChange={handleEditorChange}
    >
      {loading ? <Loader /> : (
      <>
        <Logo variant={'h3'} />
        {(doc?.createdBy === user?.uid || doc?.permission === 'Editor') && (
        <>
          <MenuBar 
            doc={doc} 
            user={user} 
            sx={{ width: '100vw'}}
          />
          <MyToolbar 
            editor={editor} 
            historyEditor={HistoryEditor} 
            sx={{ width: '80vw' , margin: '0 auto' }} 
          />
        </>)
        }
        <Cursors>
          <div ref={editorRef}>
            <Editable
              readOnly={!canEdit}
              renderElement={Renderer.renderElement}
              renderLeaf={Renderer.renderLeaf}
              spellCheck
              autoFocus
              onKeyDown={e => handleKeyDown(e)}
              className='editor-container'
            />
          </div>
        </Cursors>
      </>
      )}
    </Slate>
  );
};

export default SlateEditor;

