


import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();

export async function createUser(data: { email: string; password: string }) {

    // Şifre hashleme, email kontrolü vs. burada yapılabilir

    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: data.password
        }
    });
    return user;
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email: email
        }
    });
}

