export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  other_participant: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  last_message: {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    message_type: string;
    created_at: string;
    updated_at: string;
  } | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  created_at: string;
  updated_at: string;
  sender: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
}
