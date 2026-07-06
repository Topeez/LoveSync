"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import ActionButton from "@/components/action-button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signUpWithEmail } from "@/app/actions/auth";
import { toast } from "sonner";

const formSchema = z
    .object({
        fullname: z
            .string()
            .min(2, { message: "Jméno musí mít alespoň 2 znaky." }),
        email: z.string().email({ message: "Neplatná emailová adresa." }),
        password: z
            .string()
            .min(8, { message: "Heslo musí mít alespoň 12 znaků." }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Hesla se neshodují.",
        path: ["confirmPassword"],
    });

export const SignUpForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });
    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setServerError(null);
        const result = await signUpWithEmail(
            values.email,
            values.password,
            values.fullname,
        );
        if (result?.success) {
            setSuccess(true);
        } else {
            setServerError(result.error ?? "Něco se pokazilo.");
        }
    }

    if (success) {
        toast.success("Zkontrolujte svůj email pro aktivaci.");
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-5">
                <Controller
                    control={form.control}
                    name="fullname"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Celé jméno</FieldLabel>
                            <Input
                                aria-invalid={fieldState.invalid}
                                placeholder="Zadejte své jméno"
                                type="text"
                                {...field}
                            />
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />
                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Email</FieldLabel>
                            <Input
                                aria-invalid={fieldState.invalid}
                                placeholder="Zadejte svůj email"
                                type="email"
                                {...field}
                            />

                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />

                <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Heslo</FieldLabel>
                            <div className="relative">
                                <Input
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Zadejte své heslo"
                                    type={showPassword ? "text" : "password"}
                                    className="pr-10"
                                    {...field}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="top-1/2 right-3 absolute text-muted-foreground hover:text-foreground -translate-y-1/2"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />
                <Controller
                    control={form.control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Potvrdit heslo</FieldLabel>
                            <div className="relative">
                                <Input
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Zadejte heslo znovu"
                                    type={showConfirm ? "text" : "password"}
                                    className="pr-10"
                                    {...field}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="top-1/2 right-3 absolute text-muted-foreground hover:text-foreground -translate-y-1/2"
                                    tabIndex={-1}
                                >
                                    {showConfirm ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>
                            <FieldError errors={[fieldState.error]} />
                        </Field>
                    )}
                />
            </div>

            {serverError && (
                <p className="mt-3 text-destructive text-sm">{serverError}</p>
            )}
            <ActionButton className="mt-6 w-full" size="lg" type="submit">
                {isSubmitting ? (
                    "Registrování..."
                ) : (
                    <>
                        <Mail className="mr-2" />
                        Pokračovat s emailem
                    </>
                )}
            </ActionButton>
        </form>
    );
};
