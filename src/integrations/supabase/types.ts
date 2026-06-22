export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      affiliate_commissions: {
        Row: {
          affiliate_id: string
          approved_at: string | null
          commission_amount: number
          commission_rate: number
          created_at: string
          earned_at: string
          id: string
          paid_at: string | null
          payment_id: string | null
          payout_id: string | null
          referral_id: string | null
          status: string
          subscription_amount: number
          subscription_id: string | null
        }
        Insert: {
          affiliate_id: string
          approved_at?: string | null
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          earned_at?: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payout_id?: string | null
          referral_id?: string | null
          status?: string
          subscription_amount?: number
          subscription_id?: string | null
        }
        Update: {
          affiliate_id?: string
          approved_at?: string | null
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          earned_at?: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payout_id?: string | null
          referral_id?: string | null
          status?: string
          subscription_amount?: number
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_commissions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "affiliate_referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          method: string | null
          notes: string | null
          paid_at: string
          reference: string | null
        }
        Insert: {
          affiliate_id: string
          amount?: number
          created_at?: string
          id?: string
          method?: string | null
          notes?: string | null
          paid_at?: string
          reference?: string | null
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          method?: string | null
          notes?: string | null
          paid_at?: string
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          id: string
          referred_at: string
          referred_user_id: string
          status: string
          updated_at: string
        }
        Insert: {
          affiliate_id: string
          id?: string
          referred_at?: string
          referred_user_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          affiliate_id?: string
          id?: string
          referred_at?: string
          referred_user_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          code: string
          commission_rate: number
          country: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          payment_method: string | null
          payout_details: Json | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          code: string
          commission_rate?: number
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          payment_method?: string | null
          payout_details?: Json | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          code?: string
          commission_rate?: number
          country?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          payment_method?: string | null
          payout_details?: Json | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_read_receipts: {
        Row: {
          conversation_id: string
          conversation_type: string
          id: string
          last_read_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          conversation_type: string
          id?: string
          last_read_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          conversation_type?: string
          id?: string
          last_read_at?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_test_questions: {
        Row: {
          correct_answer: number
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          options: Json
          question_text: string
          test_id: string
        }
        Insert: {
          correct_answer?: number
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          options?: Json
          question_text: string
          test_id: string
        }
        Update: {
          correct_answer?: number
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          options?: Json
          question_text?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "custom_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_tests: {
        Row: {
          created_at: string
          description: string | null
          id: string
          status: string
          subject: string | null
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          subject?: string | null
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          subject?: string | null
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      live_class_assignments: {
        Row: {
          attended: boolean
          class_id: string
          created_at: string
          id: string
          joined_at: string | null
          student_id: string
        }
        Insert: {
          attended?: boolean
          class_id: string
          created_at?: string
          id?: string
          joined_at?: string | null
          student_id: string
        }
        Update: {
          attended?: boolean
          class_id?: string
          created_at?: string
          id?: string
          joined_at?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_class_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "live_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      live_class_resources: {
        Row: {
          class_id: string
          content: string | null
          created_at: string
          id: string
          title: string
          type: Database["public"]["Enums"]["live_resource_type"]
          url: string | null
        }
        Insert: {
          class_id: string
          content?: string | null
          created_at?: string
          id?: string
          title: string
          type?: Database["public"]["Enums"]["live_resource_type"]
          url?: string | null
        }
        Update: {
          class_id?: string
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          type?: Database["public"]["Enums"]["live_resource_type"]
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_class_resources_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "live_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      live_classes: {
        Row: {
          class_type: Database["public"]["Enums"]["live_class_type"]
          created_at: string
          description: string | null
          duration_minutes: number
          end_time: string
          grade: string | null
          id: string
          recording_url: string | null
          room_name: string
          scheduled_date: string
          start_time: string
          status: Database["public"]["Enums"]["live_class_status"]
          subject: string | null
          teacher_id: string
          title: string
          topic: string | null
          updated_at: string
        }
        Insert: {
          class_type?: Database["public"]["Enums"]["live_class_type"]
          created_at?: string
          description?: string | null
          duration_minutes?: number
          end_time: string
          grade?: string | null
          id?: string
          recording_url?: string | null
          room_name?: string
          scheduled_date: string
          start_time: string
          status?: Database["public"]["Enums"]["live_class_status"]
          subject?: string | null
          teacher_id: string
          title: string
          topic?: string | null
          updated_at?: string
        }
        Update: {
          class_type?: Database["public"]["Enums"]["live_class_type"]
          created_at?: string
          description?: string | null
          duration_minutes?: number
          end_time?: string
          grade?: string | null
          id?: string
          recording_url?: string | null
          room_name?: string
          scheduled_date?: string
          start_time?: string
          status?: Database["public"]["Enums"]["live_class_status"]
          subject?: string | null
          teacher_id?: string
          title?: string
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          company_ref: string
          created_at: string
          currency: string
          dpo_result_code: string | null
          dpo_result_explanation: string | null
          dpo_transaction_token: string | null
          id: string
          payment_type: string
          raw_create_token_response: string | null
          raw_verify_token_response: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          company_ref: string
          created_at?: string
          currency?: string
          dpo_result_code?: string | null
          dpo_result_explanation?: string | null
          dpo_transaction_token?: string | null
          id?: string
          payment_type?: string
          raw_create_token_response?: string | null
          raw_verify_token_response?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          company_ref?: string
          created_at?: string
          currency?: string
          dpo_result_code?: string | null
          dpo_result_explanation?: string | null
          dpo_transaction_token?: string | null
          id?: string
          payment_type?: string
          raw_create_token_response?: string | null
          raw_verify_token_response?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      phone_otps: {
        Row: {
          attempts: number
          code_hash: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: string
          last_sent_at: string
          phone: string
          purpose: string
          resend_count: number
        }
        Insert: {
          attempts?: number
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          last_sent_at?: string
          phone: string
          purpose: string
          resend_count?: number
        }
        Update: {
          attempts?: number
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          last_sent_at?: string
          phone?: string
          purpose?: string
          resend_count?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          grade: string | null
          id: string
          mobile_number: string | null
          school: string | null
          signup_attribution: Json | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          grade?: string | null
          id?: string
          mobile_number?: string | null
          school?: string | null
          signup_attribution?: Json | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          grade?: string | null
          id?: string
          mobile_number?: string | null
          school?: string | null
          signup_attribution?: Json | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      question_attempts: {
        Row: {
          attempts: number
          created_at: string
          exam_number: number
          final_correct: boolean
          first_attempt_correct: boolean
          id: string
          question_id: string
          selected_answer: number | null
          subject: string
          user_id: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          exam_number?: number
          final_correct: boolean
          first_attempt_correct: boolean
          id?: string
          question_id: string
          selected_answer?: number | null
          subject: string
          user_id: string
        }
        Update: {
          attempts?: number
          created_at?: string
          exam_number?: number
          final_correct?: boolean
          first_attempt_correct?: boolean
          id?: string
          question_id?: string
          selected_answer?: number | null
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_history: {
        Row: {
          completed_at: string
          exam_number: number
          id: string
          percentage: number
          score: number
          subject: string
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          exam_number?: number
          id?: string
          percentage: number
          score: number
          subject: string
          total_questions: number
          user_id: string
        }
        Update: {
          completed_at?: string
          exam_number?: number
          id?: string
          percentage?: number
          score?: number
          subject?: string
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      quiz_progress: {
        Row: {
          answers: Json
          created_at: string
          current_index: number
          exam_number: number
          id: string
          question_order: Json
          score: number
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          current_index?: number
          exam_number?: number
          id?: string
          question_order?: Json
          score?: number
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          current_index?: number
          exam_number?: number
          id?: string
          question_order?: Json
          score?: number
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          payment_id: string | null
          payment_method: string | null
          phone_number: string | null
          plan_name: string | null
          started_at: string | null
          status: string
          transaction_ref: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          phone_number?: string | null
          plan_name?: string | null
          started_at?: string | null
          status?: string
          transaction_ref?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          phone_number?: string | null
          plan_name?: string | null
          started_at?: string | null
          status?: string
          transaction_ref?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      teacher_student_links: {
        Row: {
          created_at: string
          id: string
          status: string
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      test_assignments: {
        Row: {
          assigned_at: string
          due_date: string | null
          id: string
          status: string
          student_id: string
          test_id: string
        }
        Insert: {
          assigned_at?: string
          due_date?: string | null
          id?: string
          status?: string
          student_id: string
          test_id: string
        }
        Update: {
          assigned_at?: string
          due_date?: string | null
          id?: string
          status?: string
          student_id?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_assignments_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "custom_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      test_submission_answers: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
          selected_answer: number
          submission_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id: string
          selected_answer: number
          submission_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_answer?: number
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_submission_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "custom_test_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_submission_answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "test_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      test_submissions: {
        Row: {
          assignment_id: string
          id: string
          percentage: number
          score: number
          student_id: string
          submitted_at: string
          test_id: string
          total_questions: number
        }
        Insert: {
          assignment_id: string
          id?: string
          percentage?: number
          score?: number
          student_id: string
          submitted_at?: string
          test_id: string
          total_questions?: number
        }
        Update: {
          assignment_id?: string
          id?: string
          percentage?: number
          score?: number
          student_id?: string
          submitted_at?: string
          test_id?: string
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "test_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "test_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_submissions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "custom_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          earned_at: string
          id: string
          metadata: Json | null
          reward_id: string
          reward_name: string
          reward_type: string
          user_id: string
        }
        Insert: {
          earned_at?: string
          id?: string
          metadata?: Json | null
          reward_id: string
          reward_name: string
          reward_type: string
          user_id: string
        }
        Update: {
          earned_at?: string
          id?: string
          metadata?: Json | null
          reward_id?: string
          reward_name?: string
          reward_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          longest_streak: number
          streak_freeze_available: boolean
          streak_freeze_used_date: string | null
          total_correct_answers: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          streak_freeze_available?: boolean
          streak_freeze_used_date?: string | null
          total_correct_answers?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          streak_freeze_available?: boolean
          streak_freeze_used_date?: string | null
          total_correct_answers?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_list_subscriptions: {
        Args: never
        Returns: {
          amount: number
          created_at: string
          currency: string
          email: string
          expires_at: string
          full_name: string
          id: string
          mobile_number: string
          plan_name: string
          started_at: string
          status: string
          user_id: string
        }[]
      }
      are_teacher_student_linked: {
        Args: { _user1: string; _user2: string }
        Returns: boolean
      }
      current_affiliate_id: { Args: never; Returns: string }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      delete_user_account: { Args: { _user_id: string }; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      find_email_by_username: { Args: { _username: string }; Returns: string }
      find_teacher_by_email: { Args: { _email: string }; Returns: string }
      get_assigned_test_questions: {
        Args: { _test_id: string }
        Returns: {
          display_order: number
          id: string
          image_url: string
          options: Json
          question_text: string
          test_id: string
        }[]
      }
      get_student_emails_for_teacher: {
        Args: { _teacher_id: string }
        Returns: {
          email: string
          student_id: string
        }[]
      }
      get_teacher_emails_for_student: {
        Args: { _student_id: string }
        Returns: {
          email: string
          teacher_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_affiliate_admin: { Args: { _user_id: string }; Returns: boolean }
      is_assigned_to_live_class: {
        Args: { _class_id: string; _user_id: string }
        Returns: boolean
      }
      is_assigned_to_test: {
        Args: { _student_id: string; _test_id: string }
        Returns: boolean
      }
      is_assignment_participant: {
        Args: { _assignment_id: string; _user_id: string }
        Returns: boolean
      }
      is_invited_affiliate: { Args: { _email: string }; Returns: boolean }
      is_live_class_owner: {
        Args: { _class_id: string; _user_id: string }
        Returns: boolean
      }
      is_test_owner: {
        Args: { _test_id: string; _user_id: string }
        Returns: boolean
      }
      is_valid_internal_secret: {
        Args: { _secret_name: string; _secret_value: string }
        Returns: boolean
      }
      link_referral_by_code: { Args: { _code: string }; Returns: undefined }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      submit_custom_test: {
        Args: { _answers: Json; _assignment_id: string }
        Returns: {
          percentage: number
          score: number
          total: number
        }[]
      }
    }
    Enums: {
      app_role: "student" | "teacher" | "affiliate" | "affiliate_admin"
      live_class_status: "scheduled" | "live" | "completed" | "cancelled"
      live_class_type: "one_to_one" | "group"
      live_resource_type: "link" | "file" | "note" | "homework"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "teacher", "affiliate", "affiliate_admin"],
      live_class_status: ["scheduled", "live", "completed", "cancelled"],
      live_class_type: ["one_to_one", "group"],
      live_resource_type: ["link", "file", "note", "homework"],
    },
  },
} as const
