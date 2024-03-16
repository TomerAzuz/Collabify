"use client";
import { useParams } from 'react-router-dom'; 
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "../../liveblocks.config";
import { CollaborativeEditor } from './CollaborativeEditor';

export default function Page() {
  const { id } = useParams();

  return (
    <RoomProvider id={id} initialPresence={{}}>
      <ClientSideSuspense fallback="Loading...">
        {() => <CollaborativeEditor />}
      </ClientSideSuspense>
    </RoomProvider>
  );
};