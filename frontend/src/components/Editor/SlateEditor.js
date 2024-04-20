import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { Editor, createEditor, Transforms, Range } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { withYjs, withCursors, YjsEditor } from '@slate-yjs/core';
import { IconButton, Paper, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Close } from '@mui/icons-material';
import isHotkey from 'is-hotkey';

import '../../App.css';
import './SlateEditor.css';
import { useAuth } from '../Auth/AuthContext.js';
import useDocumentFunctions from '../CustomHooks/useDocumentFunctions.js';
import Loader from '../Common/Loader/Loader.js';
import useCustomEditor from '../CustomHooks/useCustomEditor.js';
import MyToolbar from '../Toolbar/Toolbar.js';
import MenuBar from '../MenuBar/MenuBar.js';
import Renderer from '../SlateElements/Renderer.js';
import { Cursors } from './Cursors/Cursors.js';
import { HOTKEYS, CURSOR_COLORS } from '../Common/Utils/constants.js';

const SlateEditor = ({ sharedType, provider, doc, setDoc }) => {
  const { user } = useAuth();
  const editorRef = useRef(null);
  const mentionRef = useRef(null);
  const [mode, setMode] = useState('Editor');
  const [target, setTarget] = useState(null);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { saveDocument } = useDocumentFunctions();
  const { withMentions, withTables, withChecklist, 
          insertMention, alignText, toggleMark } = useCustomEditor();

  const hasEditorPermission = doc.permission === 'Editor';
  const canEdit = doc.createdBy.uid === user?.uid || hasEditorPermission;

  const allCollabs = [... doc.collaborators, doc.createdBy];
  const collabs = allCollabs.filter(collab => {
                                      return collab.displayName.toLowerCase()
                                              .includes(search.toLowerCase()) && 
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
        const response = await saveDocument(doc, editorRef, true);
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
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            const prevIndex = index >= collabs?.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case 'ArrowUp':
            e.preventDefault();
            const nextIndex = index <= 0 ? collabs?.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case 'Tab':
          case 'Enter':
            e.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, collabs[index].displayName);
            setTarget(null);
            break;
          case 'Escape':
            e.preventDefault();
            setTarget(null);
            break;
        }
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

  return (
    <Slate 
      editor={editor}
      initialValue={doc.content}
      onChange={() => {
        const { selection } = editor;
        
        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: 'word' });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);

          if (beforeMatch && afterMatch) {
            setTarget(beforeRange);
            setSearch(beforeMatch[1]);
            setIndex(0);
            return;
          }
        }

        setTarget(null);
      }}
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
              renderElement={Renderer.renderElement}
              renderLeaf={Renderer.renderLeaf}
              spellCheck
              autoFocus
              onKeyDown={e => handleKeyDown(e)}
              className='editor-container'
            />
          </div>
        </Cursors>
        {target && collabs.length > 0 && (
          <div
            ref={mentionRef}
            style={{
              top: '-9999px',
              left: '-9999px',
              position: 'absolute',
              zIndex: 1,
              padding: '3px',
              background: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 5px rgba(0,0,0,.2)',
            }}
          >
            {collabs.map((collab, i) => (
              <div
                key={collab.uid}
                onClick={() => {
                  Transforms.select(editor, target);
                  insertMention(editor, collab.displayName);
                  setTarget(null);
                }}
                style={{
                  padding: '1px 3px',
                  borderRadius: '3px',
                  background: i === index ? '#B4D5FF' : 'transparent',
                }}
              >
                {collab.displayName}
              </div>
            ))}
          </div>
        )}
        {isDetailsOpen && (
          <Paper 
            elevation={3} 
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              width: '40%',
              maxWidth: 600, 
              padding: '24px',
              textAlign: 'center',
            }}
          >
            {/* Document Details Heading */}
            <Typography variant="h5" gutterBottom>
              Document Details
            </Typography>
            <List>
            {/* Owner */}
            <ListItem>
              <ListItemText primary={`Owner: ${doc.createdBy.displayName}`} />
            </ListItem>
            <Divider component="li" />

            {/* Modified Date */}
            <ListItem>
              <ListItemText
                primary={`Modified: ${new Date(doc.updatedAt).toLocaleString()}`}
            />
            </ListItem>
            <Divider component="li" />

            {/* Created Date */}
            <ListItem>
              <ListItemText
                primary={`Created: ${new Date(doc.createdAt).toLocaleString()}`}
              />
            </ListItem>
          </List>

          {/* Optional Close Button */}
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={() => setIsDetailsOpen(false)}
          >
            <Close />
          </IconButton>
        </Paper>
        )}
        {loading && <Loader />}
      </>
    </Slate>
  );
};

export default SlateEditor;

