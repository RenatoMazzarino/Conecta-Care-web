import { RealtimeChannel } from '@supabase/supabase-js';
import { supabaseBrowserClient } from './supabaseClient';

export function subscribeToShiftPosts(shiftId: string, onEvent: (payload: any) => void): RealtimeChannel {
  const channel = supabaseBrowserClient
    .channel(`shift-posts:${shiftId}`, {
      config: {
        broadcast: { ack: true },
      },
    })
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shift_posts',
        filter: `shift_id=eq.${shiftId}`,
      },
      onEvent
    )
    .subscribe();

  return channel;
}

export function subscribeToPresence(shiftId: string, onEvent: (payload: any) => void): RealtimeChannel {
  const channel = supabaseBrowserClient
    .channel(`shift-presence:${shiftId}`, {
      config: {
        presence: { key: shiftId },
      },
    })
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shift_presence',
        filter: `shift_id=eq.${shiftId}`,
      },
      onEvent
    )
    .subscribe();

  return channel;
}
