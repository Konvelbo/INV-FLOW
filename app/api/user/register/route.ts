import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserSchema } from "@/lib/zod/UserProtect";

const createToken = (id: string) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET!);
  return token;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = UserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 },
      );
    }

    const { name, email, password } = validation.data;

    const isExistUserEmail = await prisma.User.findUnique({
      where: { email: email },
    });

    if (isExistUserEmail) {
      return NextResponse.json(
        { message: "Cet email existe déjà !" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.User.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: newPassword, ...rest } = user;

    const token = createToken(user._id);

    return NextResponse.json(
      { user: rest, message: "Utilisateur créé avec succès !", token },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Une erreur s'est produite !" },
      { status: 500 },
    );
  }
}
