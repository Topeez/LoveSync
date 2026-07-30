"use client";

import { useOptimistic, startTransition, useEffect, useMemo } from "react";
import { createTodo, toggleTodo, deleteTodo } from "@/app/actions/todos";
import { toast } from "sonner";
import { Todo, OptimisticTodoAction, TodoRow } from "@/types/todo";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export function useTodos(todos: Todo[], coupleId: string, currentUserId: string, usersMap: Record<string, string | null>) {
  const initialTodosWithAvatars = useMemo(() => {
    return (todos ?? []).map(todo => ({
      ...todo,
      creator_avatar: todo.created_by ? (usersMap[todo.created_by] ?? null) : null
    }));
  }, [todos, usersMap]);

  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    initialTodosWithAvatars,
    (state: Todo[], action: OptimisticTodoAction): Todo[] => {
      switch (action.type) {
        case "ADD":
          // Kontrola duplicity todo item  
          if(state.some(t => t.id === action.todo.id || (t.title === action.todo.title && t.is_optimistic))) {
            const existingOptIdx = state.findIndex(t => t.title === action.todo.title && t.is_optimistic);

            if(existingOptIdx > -1) {
              const newState = [...state];
              
              newState[existingOptIdx] = { 
                  ...newState[existingOptIdx], 
                  ...action.todo, 
                  is_optimistic: false,
                  creator_avatar: action.todo.creator_avatar || newState[existingOptIdx].creator_avatar 
              };
              
              return newState;
            }
            return state;
          }

          return [...state, action.todo];
        case "TOGGLE":
          return state.map((t) =>
            t.id === action.id ? { ...t, is_completed: action.checked } : t,
          );
        case "DELETE":
          return state.filter((t) => t.id !== action.id);
      }
    },
  );

  useEffect(() => {
    if (!coupleId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`todos-${coupleId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
          filter: `couple_id=eq.${coupleId}`,
        },
        (payload: RealtimePostgresChangesPayload<TodoRow>) => {

          const newRow = (payload.new as TodoRow | null) ?? undefined;
          const oldRow = (payload.old as TodoRow | null) ?? undefined;

          startTransition(() => {
            switch (payload.eventType) {
              case "INSERT":
                if (!newRow) return;

                //Kontrola puvodniho pole todos jestli tam tento prvek nahodu neni
                if(todos.some(t => t.id === newRow.id)) return;

                const creatorAvatar = newRow.created_by ? usersMap[newRow.created_by]: undefined;

                updateOptimisticTodos({
                  type: "ADD",
                  todo: {
                    id: newRow.id,
                    title: newRow.title,
                    is_completed: newRow.is_completed,
                    created_by: newRow.created_by,
                    creator_avatar: creatorAvatar ?? null
                  },
                });
                break;
              case "UPDATE":
                if (!newRow) return;
                updateOptimisticTodos({
                  type: "TOGGLE",
                  id: newRow.id,
                  checked: newRow.is_completed,
                });
                break;
              case "DELETE":
                if (!oldRow) return;
                updateOptimisticTodos({
                  type: "DELETE",
                  id: oldRow.id,
                });
                break;
            }
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [coupleId, updateOptimisticTodos, todos, usersMap]);

  const handleAdd = async (formData: FormData) => {
    const title = (formData.get("title") as string)?.trim();
    if (!title) return;

    const optimisticTodo: Todo = {
      id: Math.random().toString(),
      title,
      is_completed: false,
      is_optimistic: true,
      created_by: currentUserId,
      creator_avatar: usersMap[currentUserId] ?? null
    };

    startTransition(() =>
      updateOptimisticTodos({ type: "ADD", todo: optimisticTodo }),
    );

    try {
      const result = await createTodo(formData);

      if (!result.success) {
        startTransition(() =>
          updateOptimisticTodos({ type: "DELETE", id: optimisticTodo.id }),
        );
        toast.error(result.error ?? "Nepodařilo se přidat úkol.");
      }
    } catch {
      startTransition(() =>
        updateOptimisticTodos({ type: "DELETE", id: optimisticTodo.id }),
      );
      toast.error("Nepodařilo se přidat úkol.");
    }
  };

  const handleToggle = async (id: string, checked: boolean) => {
    startTransition(() =>
      updateOptimisticTodos({ type: "TOGGLE", id, checked }),
    );

    try {
      const result = await toggleTodo(id, checked);

      if (!result.success) {
        startTransition(() =>
          updateOptimisticTodos({ type: "TOGGLE", id, checked: !checked }),
        );
        toast.error(result.error ?? "Nepodařilo se aktualizovat úkol.");
      }
    } catch {
      startTransition(() =>
        updateOptimisticTodos({ type: "TOGGLE", id, checked: !checked }),
      );
      toast.error("Nepodařilo se aktualizovat úkol.");
    }
  };

  const handleDelete = async (id: string) => {
    const previous = optimisticTodos.find((t) => t.id === id);

    startTransition(() =>
      updateOptimisticTodos({ type: "DELETE", id }),
    );

    try {
      const result = await deleteTodo(id);

      if (!result.success) {
        if (previous) {
          startTransition(() =>
            updateOptimisticTodos({ type: "ADD", todo: previous }),
          );
        }
        toast.error(result.error ?? "Nemáte oprávnění smazat tento úkol.");
      } else {
        toast.success("Úkol smazán.");
      }
    } catch {
      if (previous) {
        startTransition(() =>
          updateOptimisticTodos({ type: "ADD", todo: previous }),
        );
      }
      toast.error("Nepodařilo se smazat úkol.");
    }
  };

  const completedCount = optimisticTodos.filter((t) => t.is_completed).length;
  const totalCount = optimisticTodos.length;

  return {
    optimisticTodos,
    completedCount,
    totalCount,
    coupleId,
    handleAdd,
    handleToggle,
    handleDelete,
  };
}
