'use server'


import bcrypt from "bcryptjs";
import * as z from "zod";
import prisma from "../db";
import { registroSchema } from "../schemas/auth";


export const registerActions = async (values: z.infer<typeof registroSchema>) => {

    const validatedField = registroSchema.safeParse(values)

    if (!validatedField.success) {
        return {
            error: "Campos inválidos"
        }
    }


    const { email, password, name } = validatedField.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const lowerCaseEmail = email.toLowerCase();


    const existeMail = await prisma.user.findUnique({
        where: {
            email: lowerCaseEmail
        }
    })

    if (existeMail) {
        return {
            error: "Email ya existe",
        };
    }


    await prisma.user.create({
        data: {
            email: lowerCaseEmail,
            password: hashedPassword,
            name
        }
    })


    return {
        success: "User Creado"
    }





}