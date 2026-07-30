"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TodoItemProps } from "@/types/todo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TodoItem({
    todo,
    onToggle,
    onDelete,
    currentUserId,
}: TodoItemProps & { currentUserId: string }) {
    const isMe = todo.created_by === currentUserId;

    return (
        <div
            className={cn(
                "group flex items-center gap-3 px-1 py-2 border-b-0 rounded-lg transition-all",
                todo.is_optimistic && "opacity-50",
            )}
        >
            <Checkbox
                checked={todo.is_completed}
                onCheckedChange={(checked) =>
                    onToggle(todo.id, checked as boolean)
                }
                disabled={todo.is_optimistic}
                className="shrink-0"
            />

            <span
                className={cn(
                    "flex-1 text-sm transition-all",
                    todo.is_completed && "line-through text-muted-foreground",
                )}
            >
                {todo.title}
            </span>

            {todo.created_by && (
                <div
                    className="flex justify-center items-center mr-2 shrink-0"
                    title={isMe ? "Přidal/a jsi ty: " : "Přidal(a) partner/ka"}
                >
                    <Avatar className="border border-muted/50 size-5 md:size-6">
                        <AvatarImage
                            src={todo.creator_avatar ?? undefined}
                            alt="Avatar tvůrce"
                        />
                        <AvatarFallback className="bg-muted/80 text-sm">
                            {isMe ? "Já" : "P"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}

            <button
                onClick={() => onDelete(todo.id)}
                disabled={todo.is_optimistic}
                className="opacity-100 md:group-hover:opacity-100 md:opacity-0 p-1 hover:text-destructive transition-all disabled:pointer-events-none"
                title="Smazat úkol"
            >
                <Trash2 className="size-3.5" />
            </button>
        </div>
    );
}
