-- Drop existing posts-related tables if converting from feed style
DROP TABLE IF EXISTS public.likes CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;

-- Chat Rooms table (city-based public rooms or private conversations)
CREATE TABLE public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  city TEXT CHECK (city IN ('sf', 'nyc', 'austin', NULL)), -- NULL for private chats
  type TEXT NOT NULL CHECK (type IN ('public', 'private', 'ai')), -- ai for persona chats
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  participant_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Chat Participants (who's in which room)
CREATE TABLE public.chat_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  is_typing BOOLEAN DEFAULT false,
  typing_started_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(room_id, user_id)
);

-- Messages table (updated for chat)
DROP TABLE IF EXISTS public.messages CASCADE;
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW() + INTERVAL '24 hours'),
  edited_at TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN DEFAULT false,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL
);

-- Online Status
CREATE TABLE public.user_status (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('online', 'away', 'offline')),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  current_room_id UUID REFERENCES public.chat_rooms(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX chat_rooms_city_idx ON public.chat_rooms(city);
CREATE INDEX chat_rooms_type_idx ON public.chat_rooms(type);
CREATE INDEX chat_rooms_last_message_idx ON public.chat_rooms(last_message_at DESC);
CREATE INDEX chat_participants_room_idx ON public.chat_participants(room_id);
CREATE INDEX chat_participants_user_idx ON public.chat_participants(user_id);
CREATE INDEX messages_room_idx ON public.messages(room_id);
CREATE INDEX messages_created_at_idx ON public.messages(created_at DESC);
CREATE INDEX messages_expires_at_idx ON public.messages(expires_at);
CREATE INDEX user_status_status_idx ON public.user_status(status);

-- Enable RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_status ENABLE ROW LEVEL SECURITY;

-- Chat Rooms policies
CREATE POLICY "Public rooms viewable by everyone" ON public.chat_rooms
  FOR SELECT USING (type = 'public' OR 
    EXISTS (SELECT 1 FROM public.chat_participants WHERE room_id = chat_rooms.id AND user_id = auth.uid()));

CREATE POLICY "Users can create rooms" ON public.chat_rooms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Chat Participants policies
CREATE POLICY "Participants viewable by room members" ON public.chat_participants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.room_id = chat_participants.room_id AND cp.user_id = auth.uid())
  );

CREATE POLICY "Users can join rooms" ON public.chat_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON public.chat_participants
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their typing status" ON public.chat_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Messages viewable by room participants" ON public.messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.chat_participants WHERE room_id = messages.room_id AND user_id = auth.uid())
  );

CREATE POLICY "Participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (SELECT 1 FROM public.chat_participants WHERE room_id = messages.room_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can edit own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- User Status policies
CREATE POLICY "Status viewable by everyone" ON public.user_status
  FOR SELECT USING (true);

CREATE POLICY "Users update own status" ON public.user_status
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own status" ON public.user_status
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions for chat features
CREATE OR REPLACE FUNCTION public.update_room_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_rooms 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_sent
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_room_last_message();

-- Function to update participant count
CREATE OR REPLACE FUNCTION public.update_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.chat_rooms 
    SET participant_count = participant_count + 1
    WHERE id = NEW.room_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.chat_rooms 
    SET participant_count = participant_count - 1
    WHERE id = OLD.room_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_participant_change
  AFTER INSERT OR DELETE ON public.chat_participants
  FOR EACH ROW EXECUTE FUNCTION public.update_participant_count();

-- Create default city chat rooms
INSERT INTO public.chat_rooms (name, city, type, created_by, participant_count)
VALUES 
  ('SF General', 'sf', 'public', NULL, 0),
  ('NYC General', 'nyc', 'public', NULL, 0),
  ('Austin General', 'austin', 'public', NULL, 0);

-- Function to match users for anonymous chats
CREATE OR REPLACE FUNCTION public.find_or_create_chat_match(
  user_city TEXT
)
RETURNS UUID AS $$
DECLARE
  match_room_id UUID;
  waiting_user_id UUID;
BEGIN
  -- Find a waiting user in the same city
  SELECT cp.user_id INTO waiting_user_id
  FROM public.chat_participants cp
  JOIN public.chat_rooms cr ON cp.room_id = cr.id
  WHERE cr.city = user_city 
    AND cr.type = 'private'
    AND cr.participant_count = 1
    AND cp.user_id != auth.uid()
  ORDER BY RANDOM()
  LIMIT 1;

  IF waiting_user_id IS NOT NULL THEN
    -- Join existing room
    SELECT room_id INTO match_room_id
    FROM public.chat_participants
    WHERE user_id = waiting_user_id;
    
    INSERT INTO public.chat_participants (room_id, user_id)
    VALUES (match_room_id, auth.uid());
    
    RETURN match_room_id;
  ELSE
    -- Create new room and wait
    INSERT INTO public.chat_rooms (city, type, created_by)
    VALUES (user_city, 'private', auth.uid())
    RETURNING id INTO match_room_id;
    
    INSERT INTO public.chat_participants (room_id, user_id)
    VALUES (match_room_id, auth.uid());
    
    RETURN match_room_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;