"use client";

import { useMemo, useRef } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActionButton from "../../action-button";

import { TodoListProps } from "@/types/todo";
import { useTodos } from "@/hooks/todo/use-todos";
import { TodoItem } from "./todo-item";

export function TodoList({
    todos = [],
    coupleId,
    user1,
    user2,
    currentUserId,
}: TodoListProps) {
    const formRef = useRef<HTMLFormElement>(null);

    // Bezpečné vytvoření slovníku uživatelů
    const usersMap = useMemo<Record<string, string | null>>(() => {
        const map: Record<string, string | null> = {};
        if (user1?.id) map[user1.id] = user1.avatar_url;
        if (user2?.id) map[user2.id] = user2.avatar_url;
        return map;
    }, [user1, user2]);

    const {
        optimisticTodos,
        completedCount,
        totalCount,
        handleAdd,
        handleToggle,
        handleDelete,
    } = useTodos(todos, coupleId, currentUserId, usersMap);

    return (
        <Card className="inset-shadow-muted inset-shadow-xs col-span-12 md:col-span-6 lg:col-span-4 bg-card shadow-lg border-none rounded-xl h-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <ShoppingBag className="size-4 text-primary" />
                        Co zařídit
                    </CardTitle>
                    {totalCount > 0 && (
                        <span className="text-muted-foreground text-xs">
                            {completedCount}/{totalCount}
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
                {/* Seznam */}
                <div className="divide-y">
                    {optimisticTodos.length === 0 ? (
                        <div className="flex flex-col justify-center items-center bg-muted/50 py-8 border-2 border-dashed rounded-lg text-muted-foreground text-center">
                            <p className="text-sm">Zatím tu nic není.</p>
                            <p className="opacity-70 text-xs">
                                Co je potřeba zařídit?
                            </p>
                        </div>
                    ) : (
                        optimisticTodos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={handleToggle}
                                onDelete={handleDelete}
                                currentUserId={currentUserId}
                            />
                        ))
                    )}
                </div>
            </CardContent>
            <div className="flex items-center mt-auto p-4 sm:p-6 pt-0 w-full">
                <form
                    ref={formRef}
                    action={async (formData) => {
                        await handleAdd(formData);
                        formRef.current?.reset();
                    }}
                    className="flex gap-2 w-full"
                >
                    <input type="hidden" name="coupleId" value={coupleId} />
                    <Input
                        name="title"
                        placeholder="Přidat úkol..."
                        className="h-10 sm:h-8 text-sm"
                        autoComplete="off"
                    />
                    <ActionButton
                        type="submit"
                        size="sm"
                        className="px-3 h-10 sm:h-8 shrink-0"
                    >
                        <Plus className="size-4" />
                    </ActionButton>
                </form>
            </div>
        </Card>
    );
}
