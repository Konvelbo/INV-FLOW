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
      className="absolute w-full h-full flex justify-center items-center z-100"
    >
      <div
        id="delete_signup"
        className="absolute -z-100 w-full h-full"
        onClick={() => onVisibility(false)}
      ></div>
      <div id="delete_signup"></div>
      <Card id="signup_card" className="w-130 min-h-190 p-5 pb-10">
        <CardHeader className="flex flex-col space-y-2">
          <h1 className="text-5xl font-bold">Bienvenue</h1>
          <h2 className="text-2xl mb-2">{choice}</h2>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {choice === "Creer votre compte" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[18px]">
                  Nom
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Votre nom"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[18px]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Votre email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[18px]">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="******"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>
            {choice === "Creer votre compte" && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[18px]">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="******"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            )}
          </CardContent>
          <div className="w-full text-center space-y-2 mt-6">
            <Button className="w-full py-4" disabled={isSubmitting}>
              {isSubmitting ? "Chargement..." : choice}
            </Button>
            {choice === "Connexion" ? (
              <p>
                Si vous n&apos;avez pas de compte:{" "}
                <span
                  id="signup_btn"
                  onClick={() => setSignUpChoise("Creer votre compte")}
                  className="text-blue-700 p-0 h-auto font-normal hover:bg-text-blue-700 cursor-pointer"
                >
                  Creer un compte
                </span>
              </p>
            ) : (
              <p>
                Vous avez déjà un compte:{" "}
                <span
                  id="signup_btn"
                  onClick={() => setSignUpChoise("Connexion")}
                  className="text-blue-700 p-0 h-auto font-normal hover:bg-text-blue-700 cursor-pointer"
                >
                  Connectez-vous
                </span>
              </p>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
