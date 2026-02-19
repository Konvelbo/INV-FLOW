"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AuthFormData, authSchema, LoginSchema } from "@/lib/zod/UserProtect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
// import { User, Mail, Lock, CheckCircle2, ArrowRight } from "lucide-react";

export default function SignUp({
  choice,
  setSignUpChoise,
  onVisibility,
}: {
  choice: string;
  setSignUpChoise: (value: string) => void;
  onVisibility: (value: boolean | Dispatch<SetStateAction<boolean>>) => void;
}) {
  const router = useRouter();
  const isLogin = choice === "Connexion";
  const schema = isLogin ? LoginSchema : authSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (choice === "Creer votre compte") {
        const response = await axios.post("/api/user/register", data);
        if (response.status === 200) {
          toast.success("Compte créé avec succès !");
          setSignUpChoise("Connexion");
          reset();
        } else if (response.status === 400) {
          return toast.error(`${response.status} ${response.data.message}`);
        }
      } else {
        const response = await axios.post("/api/user/login", data);
        if (response.status === 200) {
          toast.success(`${response.status} ${response.data.message}`);
          if (response?.data?.user?.token) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
            router.push("/dashboard");
          }
          reset();
        }
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Une erreur est survenue");
      }
    }
  };

  return (
    <div
      id="signup"
      className="fixed inset-0 flex justify-center items-center z-60 overflow-hidden bg-background/40 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onVisibility(false);
      }}
    >
      {/* Background Gradients for Auth */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <Card
        id="signup_card"
        onClick={(e) => e.stopPropagation()}
        className="relative z-20 w-full max-w-md p-8 rounded-[2.5rem] bg-card border border-border/50 backdrop-blur-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] animate-fade-in-up"
      >
        <CardHeader className="flex flex-col space-y-2 pb-8 text-center">
          <div className="w-16 h-1 bg-linear-to-r from-transparent via-primary to-transparent opacity-50 mb-6 mx-auto rounded-full" />
          <h1 className="text-4xl font-bold tracking-tighter text-foreground font-sans">
            Bienvenue
          </h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
            {choice}
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-5 p-0">
            {choice === "Creer votre compte" && (
              <div className="space-y-2.5">
                <Label
                  htmlFor="name"
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Nom Complet
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jean Dupont"
                  className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-destructive text-[10px] font-bold uppercase tracking-wide ml-1">
                    {errors.name.message}
                  </span>
                )}
              </div>
            )}

            <div className="space-y-2.5">
              <Label
                htmlFor="email"
                className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
              >
                Adresse Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@exemple.com"
                className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-destructive text-[10px] font-bold uppercase tracking-wide ml-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              <Label
                htmlFor="password"
                className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
              >
                Mot de Passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-destructive text-[10px] font-bold uppercase tracking-wide ml-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {choice === "Creer votre compte" && (
              <div className="space-y-2.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Confirmation
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <span className="text-destructive text-[10px] font-bold uppercase tracking-wide ml-1">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            )}
          </CardContent>

          <div className="w-full text-center space-y-6 pt-4">
            <Button
              className="w-full h-14 text-xs font-black uppercase tracking-[0.3em] rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10 hover:shadow-primary/25 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Initialisation..." : choice}
            </Button>

            {choice === "Connexion" ? (
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => setSignUpChoise("Creer votre compte")}
                  className="text-primary font-black hover:text-primary/80 transition-colors ml-1"
                >
                  S&apos;inscrire
                </button>
              </p>
            ) : (
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                Déjà inscrit ?{" "}
                <button
                  type="button"
                  onClick={() => setSignUpChoise("Connexion")}
                  className="text-primary font-black hover:text-primary/80 transition-colors ml-1"
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
