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
      game_sessions: {
        Row: {
          id: string
          game_id: string
          host_player: string
          status: string
          created_at: string
          game_state: Json
          ended_at: string | null
        }
        Insert: {
          id?: string
          game_id: string
          host_player: string
          status?: string
          created_at?: string
          game_state?: Json
          ended_at?: string | null
        }
        Update: {
          id?: string
          game_id?: string
          host_player?: string
          status?: string
          created_at?: string
          game_state?: Json
          ended_at?: string | null
        }
      }
      game_players: {
        Row: {
          id: string
          game_id: string
          player_name: string
          color: string
          ready: boolean
          created_at: string
          role: string
        }
        Insert: {
          id?: string
          game_id: string
          player_name: string
          color: string
          ready?: boolean
          created_at?: string
          role?: string
        }
        Update: {
          id?: string
          game_id?: string
          player_name?: string
          color?: string
          ready?: boolean
          created_at?: string
          role?: string
        }
      }
      standard_maps: {
        Row: {
          id: string
          name: string
          planets: Json
          created_at: string
          version: number
          is_active: boolean
          planets_color: string
          number_troops: number
        }
        Insert: {
          id?: string
          name: string
          planets: Json
          created_at?: string
          version?: number
          is_active?: boolean
          planets_color?: string
          number_troops?: number
        }
        Update: {
          id?: string
          name?: string
          planets?: Json
          created_at?: string
          version?: number
          is_active?: boolean
          planets_color?: string
          number_troops?: number
        }
      }
    }
  }
}