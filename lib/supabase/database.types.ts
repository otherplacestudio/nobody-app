export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          persona_id: string
          persona_name: string
          persona_emoji: string
          persona_bio: string
          city: 'sf' | 'nyc' | 'austin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          persona_id: string
          persona_name: string
          persona_emoji: string
          persona_bio: string
          city: 'sf' | 'nyc' | 'austin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          persona_id?: string
          persona_name?: string
          persona_emoji?: string
          persona_bio?: string
          city?: 'sf' | 'nyc' | 'austin'
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          city: 'sf' | 'nyc' | 'austin'
          created_at: string
          expires_at: string
          parent_id: string | null
          likes_count: number
          replies_count: number
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          city: 'sf' | 'nyc' | 'austin'
          created_at?: string
          expires_at?: string
          parent_id?: string | null
          likes_count?: number
          replies_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          city?: 'sf' | 'nyc' | 'austin'
          created_at?: string
          expires_at?: string
          parent_id?: string | null
          likes_count?: number
          replies_count?: number
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          content: string
          created_at: string
          expires_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          content: string
          created_at?: string
          expires_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          created_at?: string
          expires_at?: string
          is_read?: boolean
        }
      }
      conversations: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          last_message_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          last_message_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          last_message_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_content: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}