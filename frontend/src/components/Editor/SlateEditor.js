import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { Editor, createEditor, Transforms, Range } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { withYjs, withCursors, YjsEditor } from '@slate-yjs/core';
import isHotkey from 'is-hotkey';

import '../../App.css';
import './SlateEditor.css';
import { useAuth } from '../Auth/AuthContext.js';
import useDocumentFunctions from '../Hooks/useDocumentFunctions.js';
import useCustomEditor from '../Hooks/useCustomEditor.js';
import MyToolbar from '../Toolbar/Toolbar.js';
import MenuBar from '../MenuBar/MenuBar.js';
import DocumentDetails from '../MenuBar/DocumentDetails/DocumentDetails.js';
import Renderer from '../SlateElements/Renderer.js';
import { Cursors } from './Cursors/Cursors.js';
import { HOTKEYS, CURSOR_COLORS } from '../Common/Utils/constants.js';
import Loader from '../Common/Loader/Loader.js';
import MentionList from './Mentions/MentionList.js';
import MentionLogic from './Mentions/MentionLogic.js';

const SlateEditor = ({ sharedType, provider, doc, setDoc }) => {
  const { user } = useAuth();
  const editorRef = useRef(null);
  const [mode, setMode] = useState('Editor');
  const [loading, setLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { saveDocument } = useDocumentFunctions();
  const { withMentions, withTables, withChecklist, 
          alignText, toggleMark } = useCustomEditor();

  /* Mentions */
  const mentionRef = useRef(null);
  const [target, setTarget] = useState(null);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');

  const hasEditorPermission = doc.permission === 'Editor';
  const canEdit = doc.createdBy.uid === user?.uid || hasEditorPermission;

  const allCollabs = [... doc.collaborators, doc.createdBy];
  const collabs = allCollabs.filter(collab => {
                                      return collab.displayName.toLowerCase()
                                              .startsWith(search.toLowerCase()) && 
                                              collab.uid !== user.uid;
                                    });

  const getRandomColor = () => {
    const index = Math.floor(Math.random() * CURSOR_COLORS.length);
    return CURSOR_COLORS[index];
  };

  const editor = useMemo(() => { 
    const e = withMentions(
                withChecklist(
                  withTables(
                    withReact(
                      withHistory(
                        withCursors(
                          withYjs(createEditor(), sharedType),
                            provider.awareness,
                            {
                              data: {
                                name: user?.displayName || user?.email,
                                color: getRandomColor(),
                              }
                            }
                          ))))));
    
    const { normalizeNode } = e;

    e.normalizeNode = entry => {
      const [node] = entry;

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry);
      }

      Transforms.insertNodes(e, doc.content, { at: [0] });
    }
    return e;
  }, []);
  
  useEffect(() => {
    YjsEditor.connect(editor);
    return () => YjsEditor.disconnect(editor)
  }, [editor]);   

  const handleHotkeyAction = useCallback((e, hotkey) => {
    if (hotkey === 'mod+y') {
      HistoryEditor.redo(editor);
    } else if (hotkey === 'mod+z') {
      HistoryEditor.undo(editor);
    } else {
      const mark = HOTKEYS[hotkey];
      alignText(editor, e.shiftKey ? mark : toggleMark(editor, mark));
    }
  }, [editor]);
    
  const handleKeyDown = useCallback(async (e) => {
    if (!canEdit) {
      return;
    }
    if (e.ctrlKey && e.key === 's') {
      // Save document
      e.preventDefault();
      try {
        setLoading(true);
        const response = await saveDocument(doc, editorRef, false);
        setDoc(response);
      } catch (error) {
        console.error('Failed to save document');
      } finally {
        setLoading(false);
      }
    } else if (e.ctrlKey) {
      // Check if hotkey is pressed
      const hotkey = Object.keys(HOTKEYS).find(key => isHotkey(key, e));
      if (hotkey) {
        e.preventDefault();
        handleHotkeyAction(e, hotkey);
      }
    } else if (target && collabs.length > 0) {
        handleMentionAction(e);
      } 
    }, [collabs, editor, index, target]);

  useEffect(() => {
    if (target && collabs && collabs.length > 0 && mentionRef) {
      const el = mentionRef.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.scrollY + 24}px`;
      el.style.left = `${rect.left + window.scrollX}px`;
    }
  }, [collabs.length, editor, index, search, target]);

  const renderElement = useCallback(props => <Renderer.renderElement {...props} />, []);
  const renderLeaf = useCallback(props => <Renderer.renderLeaf {...props} />, []);

  const { handleMentionChange, handleMentionAction } = MentionLogic(
    { editor,
      collabs,
      index,
      target,
      setIndex,
      setTarget,
      setSearch
    });

  return (
    <Slate 
      editor={editor}
      initialValue={doc.content}
      onChange={handleMentionChange}
    >
      <>
        {(canEdit || doc.permission === 'Editor') && (
          <>
            <MenuBar 
              doc={doc} 
              setDoc={setDoc}
              editorRef={editorRef}
              setIsDetailsOpen={setIsDetailsOpen}
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
        <Cursors>
          <div ref={editorRef}>
            <Editable
              readOnly={!canEdit || mode !== 'Editor'}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              spellCheck
              autoFocus
              onKeyDown={e => handleKeyDown(e)}
              className='editor-container'
            />
          </div>
        </Cursors>
        {target && collabs.length > 0 && (
          <MentionList 
            mentionRef={mentionRef}
            collabs={collabs}
            index={index}
            target={target}
            setTarget={setTarget}
          />
        )}
        {isDetailsOpen && 
          <DocumentDetails 
            doc={doc} 
            setIsDetailsOpen={setIsDetailsOpen} 
          />
        }
        {loading && <Loader />}
      </>
    </Slate>
  );
};

export default SlateEditor;

