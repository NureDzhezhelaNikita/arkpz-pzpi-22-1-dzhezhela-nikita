export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      roles: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          average_speed: number
          created_at: string
          ended_at: string
          fuel_spent: number
          id: string
          mileage: number
          started_at: string
          status: Database["public"]["Enums"]["TripStatus"]
          updated_at: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          average_speed?: number
          created_at?: string
          ended_at?: string
          fuel_spent?: number
          id?: string
          mileage?: number
          started_at?: string
          status?: Database["public"]["Enums"]["TripStatus"]
          updated_at?: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          average_speed?: number
          created_at?: string
          ended_at?: string
          fuel_spent?: number
          id?: string
          mileage?: number
          started_at?: string
          status?: Database["public"]["Enums"]["TripStatus"]
          updated_at?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          password: string
          role_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          password: string
          role_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          password?: string
          role_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      users_vehicles: {
        Row: {
          assigned_at: string
          description: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          assigned_at?: string
          description: string
          user_id?: string
          vehicle_id?: string
        }
        Update: {
          assigned_at?: string
          description?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_vehicles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_vehicles_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_statuses: {
        Row: {
          created_at: string
          fuel: number
          id: string
          is_locked: boolean
          is_started: boolean
          latitude: number
          longitude: number
          mileage: number
          speed: number
          status: Database["public"]["Enums"]["VehicleStatus"]
          trip_id: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          fuel: number
          id?: string
          is_locked: boolean
          is_started: boolean
          latitude: number
          longitude: number
          mileage?: number
          speed?: number
          status?: Database["public"]["Enums"]["VehicleStatus"]
          trip_id?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          fuel?: number
          id?: string
          is_locked?: boolean
          is_started?: boolean
          latitude?: number
          longitude?: number
          mileage?: number
          speed?: number
          status?: Database["public"]["Enums"]["VehicleStatus"]
          trip_id?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_statuses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_statuses_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_types: {
        Row: {
          created_at: string
          engine: string
          id: string
          make: string
          model: string
          transmission: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          engine: string
          id?: string
          make: string
          model: string
          transmission: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          engine?: string
          id?: string
          make?: string
          model?: string
          transmission?: string
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          auth_token: string | null
          created_at: string
          id: string
          mileage_start: number
          production_year: number
          updated_at: string
          vehicle_type_id: string
          vin: string
        }
        Insert: {
          auth_token?: string | null
          created_at?: string
          id?: string
          mileage_start?: number
          production_year?: number
          updated_at?: string
          vehicle_type_id?: string
          vin: string
        }
        Update: {
          auth_token?: string | null
          created_at?: string
          id?: string
          mileage_start?: number
          production_year?: number
          updated_at?: string
          vehicle_type_id?: string
          vin?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_vehicle_type_id_fkey"
            columns: ["vehicle_type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      TripStatus: "ACTIVE" | "PAUSED" | "DONE"
      VehicleStatus:
        | "IN_USE"
        | "PAUSED"
        | "AVAILABLE"
        | "UNAVAILABLE"
        | "SERVICE"
        | "RESERVED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
