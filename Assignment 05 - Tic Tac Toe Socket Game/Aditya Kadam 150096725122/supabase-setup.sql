-- ============================================
-- Supabase Database Setup for Tic Tac Toe
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Go to: Supabase Dashboard > SQL Editor > New Query
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create game_history table
CREATE TABLE game_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  player_x VARCHAR(50) NOT NULL,
  player_o VARCHAR(50) NOT NULL,
  winner VARCHAR(50) NOT NULL,
  total_moves INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE game_history IS 'Stores game history for Tic Tac Toe multiplayer game';

-- Enable Row Level Security (recommended for security)
ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
-- In production, you may want to restrict this
CREATE POLICY "Allow all operations on game_history" ON game_history
  FOR ALL USING (true) WITH CHECK (true);

-- Create index for faster queries (ordering by created_at DESC)
CREATE INDEX idx_game_history_created_at ON game_history(created_at DESC);

-- Create index for faster winner queries
CREATE INDEX idx_game_history_winner ON game_history(winner);

-- Optional: Create a view for recent games (last 10)
CREATE OR REPLACE VIEW recent_games AS
SELECT 
  id,
  player_x,
  player_o,
  winner,
  total_moves,
  created_at
FROM game_history
ORDER BY created_at DESC
LIMIT 10;

-- Verify table creation
SELECT * FROM game_history LIMIT 5;

-- ============================================
-- How to get your Supabase credentials
-- ============================================
-- 1. Go to your Supabase dashboard
-- 2. Navigate to Settings → API
-- 3. Copy "Project URL" → This is your SUPABASE_URL
-- 4. Copy "anon public" key → This is your SUPABASE_ANON_KEY
-- 5. Update your .env file with these values
-- ============================================

-- ============================================
-- Test the table with sample data (optional)
-- ============================================
-- Uncomment to insert test data
/*
INSERT INTO game_history (player_x, player_o, winner, total_moves)
VALUES 
  ('Player1', 'Player2', 'Player1', 5),
  ('Alice', 'Bob', 'Draw', 9),
  ('John', 'Jane', 'Jane', 7);
*/

-- ============================================
-- Clear all game history (optional - use with caution)
-- ============================================
-- Uncomment to clear all records
-- TRUNCATE TABLE game_history;
