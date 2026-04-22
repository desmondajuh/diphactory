"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { client } from "@/lib/orpc";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().trim().min(1, { message: "Album title is required" }),
  visibility: z.enum(["public", "private"]),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  shootDate: z.string().optional(),
});

interface CreateAlbumFormProps {
  onCreated?: () => void;
}

export const CreateAlbumForm = ({ onCreated }: CreateAlbumFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      visibility: "private",
      description: "",
      shootDate: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      const result = await client.albums.create({
        title: values.title,
        visibility: values.visibility,
        description: values.description || undefined,
        shootDate: values.shootDate ? new Date(values.shootDate) : undefined,
      });

      toast.success(
        values.visibility === "private"
          ? `Album created. Private code: ${result.plainCode ?? "generated"}`
          : "Album created and ready to share.",
      );

      form.reset({
        title: "",
        visibility: "private",
        description: "",
        shootDate: "",
      });
      onCreated?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create album.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="space-y-5"
      id="create-album-form"
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-album-title">Album title</FieldLabel>
              <Input
                {...field}
                id="create-album-title"
                placeholder="Ada + Tobi wedding morning"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="visibility"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-album-visibility">
                Album access
              </FieldLabel>
              <select
                {...field}
                id="create-album-visibility"
                aria-invalid={fieldState.invalid}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="private">Private album</option>
                <option value="public">Public album</option>
              </select>
              {field.value === "private" ? (
                <p className="text-sm text-muted-foreground">
                  Private albums require the client email and the generated
                  access code.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Public albums request email first so you can capture leads.
                </p>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="shootDate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-album-date">Shoot date</FieldLabel>
              <Input
                {...field}
                id="create-album-date"
                type="date"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="create-album-description">
                Notes for the client
              </FieldLabel>
              <Textarea
                {...field}
                id="create-album-description"
                placeholder="Golden-hour portraits, ceremony highlights, and reception details."
                aria-invalid={fieldState.invalid}
                className="min-h-28"
              />
              <p className="text-right text-xs text-muted-foreground">
                {field.value?.length ?? 0}/500
              </p>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full justify-center"
      >
        {isSubmitting ? (
          <>
            <LoaderCircleIcon className="size-4 animate-spin" />
            Creating album
          </>
        ) : (
          "Create album"
        )}
      </Button>
    </form>
  );
};
