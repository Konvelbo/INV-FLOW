import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 },
      );
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      if (!decoded || !decoded.id) {
        throw new Error("Invalid token");
      }
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "avatars",
      transformation: [
        { width: 300, height: 300, crop: "fill", gravity: "face" },
      ],
    });

    const avatarUrl = uploadResponse.secure_url;

    // Update User in DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    return NextResponse.json(
      {
        message: "Avatar mis à jour avec succès",
        avatar: avatarUrl,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Avatar Upload Error:", error);
    return NextResponse.json(
      {
        message: "Erreur lors de l'upload de l'avatar",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
