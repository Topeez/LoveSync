export type Todo = {
    id: string;
    title: string;
    is_completed: boolean;
    is_optimistic?: boolean;
    created_by: string | null;
    creator_avatar: string | null;
};

export type OptimisticTodoAction =
    | { type: "ADD"; todo: Todo }
    | { type: "TOGGLE"; id: string; checked: boolean }
    | { type: "DELETE"; id: string };

export interface SimpleUser {
  id: string;
  avatar_url: string | null;
}

export interface TodoListProps {
    todos?: Todo[];
    coupleId: string;
    user1: SimpleUser;
    user2: SimpleUser;
    currentUserId: string;
}

export interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string, checked: boolean) => void;
    onDelete: (id: string) => void;
    currentUserId: string;
}

export interface TodoRow {
  id: string;
  title: string;
  is_completed: boolean;
  couple_id: string;
  created_by: string | null;
  profiles?: {
    avatar_url: string | null
  } | null; 
}