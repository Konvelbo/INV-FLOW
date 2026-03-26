"use client";

import { useState, useEffect, Dispatch, SetStateAction, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AuthFormData, authSchema, LoginSchema } from "@/lib/zod/UserProtect";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/src/context/LanguageContext";
import { Eye, EyeOff } from "lucide-react";
import { useIPCAction } from "@/hooks/useIPCAction";

export default function SignUp({
  choice,
  setSignUpChoise,
  onVisibility,
}: {
  choice: string;
  setSignUpChoise: (value: string) => void;
  onVisibility: (value: boolean) => void;
}) {
  const router = useRouter();
  const { t } = useLanguage();
  const isLogin = choice === "Connexion" || choice === t("loginAction");
  const isRegistration =
    choice === "Creer votre compte" ||
    choice === "Créer votre compte" ||
    choice === t("createAccount");
  const schema = isLogin ? LoginSchema : authSchema;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    },
  });

  const { language } = useLanguage();
  const { performAction, loading: actionLoading } = useIPCAction();

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isRegistration) {
        const res = await performAction("auth", "register", data);
        if (res.success) {
          toast.success(t("accountCreated"));
          setSignUpChoise(t("loginAction"));
          reset();
        } else {
          toast.error(res.error || t("authError"));
        }
      } else if (
        choice === "Mot de passe oublié ?" ||
        choice === t("forgotPassword")
      ) {
        const res = await performAction("auth", "forgotPassword", { 
          email: data.email, 
          lang: language 
        });
        if (res.success) {
          toast.success(t("otpSent"));
          setSignUpChoise(t("verifyOtp"));
        } else {
          toast.error(res.error || t("authError"));
        }
      } else if (choice === "Vérification OTP" || choice === t("verifyOtp")) {
        const res = await performAction("auth", "resetPassword", {
          email: data.email,
          otp: data.otp,
          newPassword: data.password
        });
        if (res.success) {
          toast.success(t("passwordChanged"));
          setSignUpChoise(t("loginAction"));
          reset();
        } else {
          toast.error(res.error || t("authError"));
        }
      } else {
        const res = await performAction("auth", "login", data);
        if (res.success) {
          toast.success(t("loginSuccess"));
          const user = res.data;
          // Add a dummy token for compatibility with other components
          user.token = "local-session";
          localStorage.setItem("user", JSON.stringify(user));

          // Redirect to settings if no companies
          if (!user.companies || user.companies.length === 0) {
            toast(t("noCompanyRedirection"), { icon: "🏢" });
            router.push("/settings");
          } else {
            router.push("/dashboard");
          }
          // Dispatch session update for SessionProviderWrapper
          window.dispatchEvent(new Event("session-update"));
          reset();
        } else {
          toast.error(res.error || t("authError"));
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || t("authError"));
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
            {t("welcome")}
          </h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
            {choice}
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-5 p-0">
            {isRegistration && (
              <div className="space-y-2.5">
                <Label
                  htmlFor="name"
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  {t("fullName")}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
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
                {t("emailAddress")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-destructive text-[10px] font-bold uppercase tracking-wide ml-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {(choice === "Vérification OTP" || choice === t("verifyOtp")) && (
              <div className="space-y-2.5">
                <Label
                  htmlFor="otp"
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  Code OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans text-center text-xl tracking-[0.5em]"
                  {...register("otp" as any)}
                />
              </div>
            )}

            {choice !== t("forgotPassword") && (
              <div className="space-y-2.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  {(choice === "Vérification OTP" || choice === t("verifyOtp")) ? t("newPassword") : t("password")}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-destructive text-[10px] font-bold uppercase tracking-wide ml-1">
                    {errors.password.message}
                  </span>
                )}
              </div>
            )}

            {(isRegistration || choice === "Vérification OTP" || choice === t("verifyOtp")) && (
              <div className="space-y-2.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  {t("confirmPassword")}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans pr-10"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
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
              {isSubmitting ? t("initializing") : choice}
            </Button>

            {isLogin ? (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setSignUpChoise(t("forgotPassword"))}
                  className="text-[10px] text-primary font-black uppercase tracking-widest hover:text-primary/80 transition-colors"
                >
                  {t("forgotPassword")}
                </button>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                  {t("noAccount")}{" "}
                  <button
                    type="button"
                    onClick={() => setSignUpChoise(t("createAccount"))}
                    className="text-primary font-black hover:text-primary/80 transition-colors ml-1"
                  >
                    {t("signUp")}
                  </button>
                </p>
              </div>
            ) : choice === t("forgotPassword") ? (
              <button
                type="button"
                onClick={() => setSignUpChoise(t("loginAction"))}
                className="text-[10px] text-primary font-black uppercase tracking-widest"
              >
                {t("loginAction")}
              </button>
            ) : (
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                {t("alreadyRegistered")}{" "}
                <button
                  type="button"
                  onClick={() => setSignUpChoise(t("loginAction"))}
                  className="text-primary font-black hover:text-primary/80 transition-colors ml-1"
                >
                  {t("loginAction")}
                </button>
              </p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
