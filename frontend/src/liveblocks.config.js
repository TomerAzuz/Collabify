import { createClient } from '@liveblocks/client';
import axios from 'axios';
import { createRoomContext, createLiveblocksContext } from '@liveblocks/react';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const client = createClient({
  throttle: 16,
  authEndpoint: async (room) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error('No user signed in');
      }
      const firebaseToken = await user.getIdToken();

      const response = await axios.post(
        '/api/liveblocks-auth',
        {
          room: room,
        },
        {
          headers: {
            Authorization: `Bearer ${firebaseToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data) {
        throw new Error('Failed to fetch Liveblocks auth token');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching Liveblocks access token:', error);
      throw new Error('Error fetching Liveblocks access token');
    }
  },
});

// Room-level hooks, use inside `RoomProvider`
export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useUpdateMyPresence,
  useSelf,
  useOthers,
  useOthersMapped,
  useOthersListener,
  useOthersConnectionIds,
  useOther,
  useBroadcastEvent,
  useEventListener,
  useErrorListener,
  useStorage,
  useBatch,
  useHistory,
  useUndo,
  useRedo,
  useCanUndo,
  useCanRedo,
  useMutation,
  useStatus,
  useLostConnectionListener,
  useThreads,
  useCreateThread,
  useEditThreadMetadata,
  useCreateComment,
  useEditComment,
  useDeleteComment,
  useAddReaction,
  useRemoveReaction,
  useThreadSubscription,
  useMarkThreadAsRead,
  useRoomNotificationSettings,
  useUpdateRoomNotificationSettings,
} = createRoomContext(client);

// Project-level hooks, use inside `LiveblocksProvider`
export const {
  LiveblocksProvider,
  useMarkInboxNotificationAsRead,
  useMarkAllInboxNotificationsAsRead,
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
  useUser,
  useRoomInfo,
} = createLiveblocksContext(client);
