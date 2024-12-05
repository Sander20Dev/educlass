export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      classes: {
        Row: {
          course_id: number
          created_at: string
          date: string
          content: string
          grade_id: number
          id: number
          teacher_id: string
          title: string
        }
        Insert: {
          course_id: number
          created_at?: string
          date: string
          content: string
          grade_id: number
          id?: number
          teacher_id: string
          title: string
        }
        Update: {
          course_id?: number
          created_at?: string
          date?: string
          description?: string
          grade_id?: number
          id?: number
          teacher_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: 'classes_course_id_fkey'
            columns: ['course_id']
            isOneToOne: false
            referencedRelation: 'courses'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'classes_grade_id_fkey'
            columns: ['grade_id']
            isOneToOne: false
            referencedRelation: 'grades'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'classes_teacher_id_fkey'
            columns: ['teacher_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      courses: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      files: {
        Row: {
          class_id: number
          created_at: string
          id: number
          url: string
        }
        Insert: {
          class_id: number
          created_at?: string
          id?: number
          url: string
        }
        Update: {
          class_id?: number
          created_at?: string
          id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: 'files_class_id_fkey'
            columns: ['class_id']
            isOneToOne: false
            referencedRelation: 'classes'
            referencedColumns: ['id']
          }
        ]
      }
      grades: {
        Row: {
          created_at: string
          content: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          content: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      students_grade: {
        Row: {
          grade_id: number
          student_id: string
        }
        Insert: {
          grade_id: number
          student_id: string
        }
        Update: {
          grade_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'students_grade_grade_id_fkey'
            columns: ['grade_id']
            isOneToOne: false
            referencedRelation: 'grades'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'students_grade_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      teachers_course: {
        Row: {
          course_id: number
          teacher_id: string
        }
        Insert: {
          course_id: number
          teacher_id: string
        }
        Update: {
          course_id?: number
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'teachers_course_course_id_fkey'
            columns: ['course_id']
            isOneToOne: false
            referencedRelation: 'courses'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'teachers_course_teacher_id_fkey'
            columns: ['teacher_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      teachers_grade: {
        Row: {
          grade_id: number
          teacher_id: string
        }
        Insert: {
          grade_id: number
          teacher_id: string
        }
        Update: {
          grade_id?: number
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'teachers_grade_grade_id_fkey'
            columns: ['grade_id']
            isOneToOne: false
            referencedRelation: 'grades'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'teachers_grade_teacher_id_fkey'
            columns: ['teacher_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          is_teacher: boolean
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name: string
          id: string
          is_teacher: boolean
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_teacher?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
  ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never
