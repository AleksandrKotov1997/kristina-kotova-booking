type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
export interface AuthDatabase {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: {
      is_studio_owner: { Args: Record<string, never>; Returns: boolean };
      get_admin_bookings: {
        Args: {
          selected_page: number;
          selected_status: string | null;
          selected_date: string | null;
          search_text: string;
        };
        Returns: Json;
      };
      get_admin_dashboard: { Args: Record<string, never>; Returns: Json };
      change_booking_status: {
        Args: {
          selected_booking_id: string;
          expected_status: string;
          next_status: string;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
