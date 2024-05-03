"use client";

import LiveblocksProvider from "@liveblocks/yjs";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { useRoom } from "../../liveblocks.config";

import EditorWrapper from "./EditorWrapper.js";
import Loader from '../Common/Loader/Loader.js';

export function CollaborativeEditor() {
  const room = useRoom();
  const [connected, setConnected] = useState(false);
  const [sharedType, setSharedType] = useState();
  const [provider, setProvider] = useState();
  
  useEffect(() => {
    const yDoc = new Y.Doc();
    const sharedDoc = yDoc.get("slate", Y.XmlText);
    const yProvider = new LiveblocksProvider(room, yDoc);
    
    yProvider.on("sync", setConnected);
    setSharedType(sharedDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.off("sync", setConnected);
      yProvider?.destroy();
    };
  }, [room]);

  if (!connected || !sharedType || !provider) {
    return <Loader />;
  }

  return <EditorWrapper sharedType={sharedType} provider={provider} />;
};