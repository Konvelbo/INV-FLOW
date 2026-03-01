import * as z from "zod";

export const UserSchema = z.object({
  name: z.string().min(10, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

export const authSchema = z
  .object({
    name: z.string().min(10, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Format d'email invalide"),
    password: z
      .string()
      .min(6, "Le mot de passe doit faire au moins 6 caractères"),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Cette partie vérifie si les mots de passe correspondent uniquement en mode "Créer compte"
      if (
        data.confirmPassword !== undefined &&
        data.password !== data.confirmPassword
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Les mots de passe ne correspondent pas",
      path: ["confirmPassword"],
    },
  );

export type AuthFormData = z.infer<typeof authSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const AvatarSchema = z.object({
  image: z.string().min(1, "L'image est requise"),
});

export type AvatarFormData = z.infer<typeof AvatarSchema>;
