import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { LoginSchema } from "@/lib/zod/UserProtect";

const createToken = (id: string) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET!);
  return token;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, password } = validation.data;

    const isExistUserEmail = await prisma.user.findUnique({
      where: { email: email },
      include: { companies: true },
    });

    if (!isExistUserEmail || !isExistUserEmail.password) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé ou compte Google uniquement !" },
        { status: 404 },
      );
    } else {
      const isPasswordValid = await bcryptjs.compare(
        password,
        isExistUserEmail.password,
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Mot de passe incorrect !" },
          { status: 401 },
        );
      }
      const token = createToken(isExistUserEmail.id);
      const user = {
        token,
        name: isExistUserEmail.name,
        email: isExistUserEmail.email,
        avatar: isExistUserEmail.avatar,
        companies: isExistUserEmail.companies,
      };

      const response = NextResponse.json(
        { user, message: "Connexion réussie" },
        { status: 200 },
      );

      // Set auth-token cookie for Server Components
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      });

      return response;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Une erreur s'est produite !" },
      { status: 500 },
    );
  }
}
