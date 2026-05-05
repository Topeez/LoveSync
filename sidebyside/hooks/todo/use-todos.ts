"use client";

import { useOptimistic, startTransition } from "react";
import { createTodo, toggleTodo, deleteTodo } from "@/app/actions/todos";
import { toast } from "sonner";
import { Todo, OptimisticTodoAction } from "@/types/todo";

export function useTodos(todos: Todo[], coupleId: string) {
    const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
        todos ?? [],
        (state: Todo[], action: OptimisticTodoAction): Todo[] => {
            switch (action.type) {
                case "ADD":
                    return [...state, action.todo];
                case "TOGGLE":
                    return state.map((t) =>
                        t.id === action.id
                            ? { ...t, is_completed: action.checked }
                            : t,
                    );
                case "DELETE":
                    return state.filter((t) => t.id !== action.id);
            }
        },
    );

    const handleAdd = async (formData: FormData) => {
        const title = (formData.get("title") as string)?.trim();
        if (!title) return;

        const optimisticTodo: Todo = {
            id: Math.random().toString(),
            title,
            is_completed: false,
            is_optimistic: true,
        };

        startTransition(() =>
            updateOptimisticTodos({ type: "ADD", todo: optimisticTodo }),
        );

        try {
            await createTodo(formData);
        } catch {
            toast.error("Nepodařilo se přidat úkol.");
        }
    };

    const handleToggle = async (id: string, checked: boolean) => {
        startTransition(() =>
            updateOptimisticTodos({ type: "TOGGLE", id, checked }),
        );

        try {
            await toggleTodo(id, checked);
        } catch {
            toast.error("Nepodařilo se aktualizovat úkol.");
        }
    };

    const handleDelete = async (id: string) => {
      startTransition(() =>
          updateOptimisticTodos({ type: "DELETE", id }),
      );

      try {
          const result = await deleteTodo(id);
          if (!result?.success) {
              toast.error("Nemáte oprávnění smazat tento úkol.");
          } else {
              toast.success("Úkol smazán.");
          }
      } catch {
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
