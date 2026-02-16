import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
        { message: validation.error.errors[0].message },
        { status: 400 },
      );
    }

    const { email, password } = validation.data;

    const isExistUserEmail = await prisma.User.findUnique({
      where: { email: email },
    });

    if (!isExistUserEmail) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé !" },
        { status: 404 },
      );
    } else {
      const isPasswordValid = await bcrypt.compare(
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
      };
      return NextResponse.json(
        { user, message: "Connexion réussie" },
        { status: 200 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Une erreur s'est produite !" },
      { status: 500 },
    );
  }
}
