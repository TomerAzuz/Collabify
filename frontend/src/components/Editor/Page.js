'use client';
import { useParams } from 'react-router-dom';
import { ClientSideSuspense } from '@liveblocks/react';
import { RoomProvider } from '../../liveblocks.config';

import { CollaborativeEditor } from './CollaborativeEditor';
import Loader from '../Loader/Loader';

export default function Page() {
  const { id } = useParams();

  return (
    <RoomProvider id={id} initialPresence={{}}>
      <ClientSideSuspense fallback={<Loader />}>
        {() => <CollaborativeEditor />}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
