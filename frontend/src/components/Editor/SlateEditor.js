import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { Editor, createEditor, Transforms } from 'slate';
import { HistoryEditor, withHistory } from 'slate-history';
import { withYjs, withCursors, YjsEditor } from '@slate-yjs/core';
import isHotkey from 'is-hotkey';

import '../../App.css';
import './SlateEditor.css';
import { useAuth } from '../../AuthContext';
import useDocumentFunctions from '../../hooks/useDocumentFunctions';
import useCustomEditor from '../../hooks/useCustomEditor';
import MyToolbar from '../Toolbar/Toolbar';
import MenuBar from '../MenuBar/MenuBar.js';
import DocumentDetails from '../DocumentDetails/DocumentDetails.js';
import Renderer from '../SlateElements/Renderer.js';
import { Cursors } from './Cursors/Cursors.js';
import {
  HOTKEYS,
  CURSOR_COLORS,
  TEXT_ALIGN_TYPES,
} from '../../constants/constants.js';
import MentionList from './Mentions/MentionList.js';
import MentionLogic from './Mentions/MentionLogic.js';

const SlateEditor = ({ sharedType, provider, doc, setDoc }) => {
  const { user } = useAuth();
  const editorRef = useRef(null);
  const [mode, setMode] = useState('Editor');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { saveDocument } = useDocumentFunctions();
  const {
    withMentions,
    withTables,
    withChecklist,
    withImages,
    withEmbeds,
    toggleMark,
    toggleBlock,
  } = useCustomEditor();

  /* Mentions */
  const mentionRef = useRef(null);
  const [target, setTarget] = useState(null);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');

  const hasEditorPermission = doc.permission === 'Editor';
  const canEdit = doc.createdBy.uid === user?.uid || hasEditorPermission;

  const allCollabs = [...doc.collaborators, doc.createdBy];
  const collabs = allCollabs.filter((collab) => {
    return collab.displayName.toLowerCase().startsWith(search.toLowerCase());
  });

  const getRandomColor = () => {
    const index = Math.floor(Math.random() * CURSOR_COLORS.length);
    return CURSOR_COLORS[index];
  };

  const editor = useMemo(() => {
    const e = withMentions(
      withChecklist(
        withTables(
          withEmbeds(
            withImages(
              withReact(
                withHistory(
                  withCursors(
                    withYjs(createEditor(), sharedType),
                    provider.awareness,
                    {
                      data: {
                        name: user?.displayName || user?.email,
                        color: getRandomColor(),
                      },
                    }
                  )
                )
              )
            )
          )
        )
      )
    );

    const { normalizeNode } = e;

    e.normalizeNode = (entry) => {
      const [node] = entry;

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry);
      }

      Transforms.insertNodes(e, doc.content, { at: [0] });
    };
    return e;
  }, []);

  useEffect(() => {
    YjsEditor.connect(editor);
    return () => YjsEditor.disconnect(editor);
  }, [editor]);

  const handleHotkeyAction = useCallback(
    (e, hotkey) => {
      if (hotkey === 'mod+y') {
        HistoryEditor.redo(editor);
      } else if (hotkey === 'mod+z') {
        HistoryEditor.undo(editor);
      } else {
        const mark = HOTKEYS[hotkey];
        TEXT_ALIGN_TYPES.includes(mark)
          ? toggleBlock(editor, mark)
          : toggleMark(editor, mark);
      }
    },
    [editor]
  );

  const handleSaveDocument = async (isAutosave) => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const response = await saveDocument(
        { id: doc.id, content: editor.children },
        editorRef,
        isAutosave
      );
      setDoc(response);
      return response;
    } catch (error) {
      console.error('Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = useCallback(
    async (e) => {
      if (!canEdit) {
        return;
      }
      if (e.ctrlKey && e.key === 's') {
        // Save document
        e.preventDefault();
        await handleSaveDocument(false);
      } else if (e.ctrlKey) {
        // Check if hotkey is pressed
        const hotkey = Object.keys(HOTKEYS).find((key) => isHotkey(key, e));
        if (hotkey) {
          e.preventDefault();
          handleHotkeyAction(e, hotkey);
        }
      } else if (target && collabs.length > 0) {
        handleMentionAction(e);
      }
    },
    [collabs, editor, index, target]
  );

  useEffect(() => {
    if (target && collabs && collabs.length > 0 && mentionRef) {
      const el = mentionRef.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      el.style.top = `${rect.top + window.scrollY + 24}px`;
      el.style.left = `${rect.left + window.scrollX}px`;
    }
  }, [collabs.length, editor, index, search, target]);

  const renderElement = useCallback(
    (props) => <Renderer.renderElement {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props) => <Renderer.renderLeaf {...props} />,
    []
  );

  const { handleMentionChange, handleMentionAction } = MentionLogic({
    editor,
    collabs,
    index,
    target,
    setIndex,
    setTarget,
    setSearch,
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
              handleSaveDocument={handleSaveDocument}
              setIsDetailsOpen={setIsDetailsOpen}
              isSaving={isSaving}
              setIsSaving={setIsSaving}
              sx={{ width: '100vw' }}
            />
            <MyToolbar
              historyEditor={HistoryEditor}
              mode={mode}
              setMode={setMode}
              sx={{ width: '80vw', margin: '0 auto' }}
            />
          </>
        )}
        <Cursors>
          <div ref={editorRef}>
            <Editable
              readOnly={!canEdit || mode !== 'Editor'}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              autoFocus
              spellCheck={false}
              onKeyDown={(e) => handleKeyDown(e)}
              className="editor-container"
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
        {isDetailsOpen && (
          <DocumentDetails doc={doc} setIsDetailsOpen={setIsDetailsOpen} />
        )}
      </>
    </Slate>
  );
};

export default SlateEditor;
