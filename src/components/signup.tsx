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
import { useLanguage } from "@/src/context/LanguageContext";
// import { User, Mail, Lock, CheckCircle2, ArrowRight } from "lucide-react";

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
  const schema = isLogin ? LoginSchema : authSchema;

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
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (choice === "Creer votre compte" || choice === t("createAccount")) {
        const response = await axios.post("/api/user/register", data);
        if (response.status === 200) {
          toast.success(t("accountCreated"));
          setSignUpChoise(t("loginAction"));
          reset();
        } else if (response.status === 400) {
          return toast.error(`${response.status} ${response.data.message}`);
        }
      } else if (
        choice === "Mot de passe oublié ?" ||
        choice === t("forgotPassword")
      ) {
        const response = await axios.post("/api/user/forgot-password", {
          email: data.email,
        });
        if (response.status === 200) {
          toast.success(t("otpSent"));
          setSignUpChoise(t("verifyOtp"));
        }
      } else if (choice === "Vérification OTP" || choice === t("verifyOtp")) {
        const response = await axios.post("/api/user/reset-password", {
          email: data.email,
          otp: data.otp,
          newPassword: data.password,
        });
        if (response.status === 200) {
          toast.success(t("passwordChanged"));
          setSignUpChoise(t("loginAction"));
          reset();
        }
      } else {
        const response = await axios.post("/api/user/login", data);
        if (response.status === 200) {
          toast.success(t("loginSuccess"));
          if (response?.data?.user?.token) {
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Redirect to settings if no companies
            if (
              !response.data.user.companies ||
              response.data.user.companies.length === 0
            ) {
              toast(t("noCompanyRedirection"), { icon: "🏢" });
              router.push("/settings");
            } else {
              router.push("/dashboard");
            }
          }
          reset();
        }
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t("authError"));
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
            {t("welcome")}
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

            {choice !== t("verifyOtp") && (
              <div className="space-y-2.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  {t("password")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-destructive text-[10px] font-bold uppercase tracking-wide ml-1">
                    {errors.password.message}
                  </span>
                )}
              </div>
            )}

            {choice === "Creer votre compte" && (
              <div className="space-y-2.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  {t("confirmPassword")}
                </Label>
                <Input
                  id="confirmPassword"
                  type="confirmPassword"
                  placeholder={t("passwordPlaceholder")}
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

            {(choice === "Vérification OTP" || choice === t("verifyOtp")) && (
              <div className="space-y-2.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                >
                  {t("newPassword")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  className="bg-background/50 border-border/50 h-12 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-sans"
                  {...register("password")}
                />
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
