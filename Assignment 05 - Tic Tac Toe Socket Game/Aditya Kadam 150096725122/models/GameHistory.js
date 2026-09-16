/**
 * GameHistory Model
 * Manages game history operations with Supabase
 */

const supabase = require('../config/supabase');

class GameHistory {
  /**
   * Save game history to Supabase
   * @param {Object} gameData - Game data to save
   * @returns {Promise<Object>} - Result of operation
   */
  static async save(gameData) {
    if (!supabase) {
      return { success: false, error: new Error('Supabase is not configured') };
    }

    try {
      const { data, error } = await supabase
        .from('game_history')
        .insert([gameData]);
      
      if (error) {
        console.error('Error saving game history:', error);
        return { success: false, error };
      }
      
      console.log('Game history saved successfully');
      return { success: true, data };
    } catch (err) {
      console.error('Supabase error:', err);
      return { success: false, error: err };
    }
  }

  /**
   * Get game history from Supabase
   * @param {number} limit - Number of records to fetch
   * @returns {Promise<Array>} - Array of game history records
   */
  static async get(limit = 10) {
    if (!supabase) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('game_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching game history:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Supabase error:', err);
      return [];
    }
  }
}

module.exports = GameHistory;
