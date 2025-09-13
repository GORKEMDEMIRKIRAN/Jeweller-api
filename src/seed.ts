import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { JwtPayload } from './types/express.js';
import logger from "./utils/logger.js";
const prisma = new PrismaClient();


export default async function seed() {
  const plainPassword = '123';
  const saltRounds = 10;
  const hashedPassword=await bcrypt.hash(plainPassword,saltRounds);
  //--------------------------------------------------------------------
  // userType add
  const userTypes = ["user", "manager", "admin"];
  const userTypeObjs = [];
  for (const type of userTypes) {
    const userType = await prisma.userType.create({ data: { name: type } });
    userTypeObjs.push(userType);
  }
  // users add
  const user1 = await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      userTypeId: userTypeObjs[2]?.id ?? 9999,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      username: "manager",
      email: "manager@example.com",
      password: hashedPassword,
      userTypeId: userTypeObjs[1]?.id ?? 9999,
    },
  });
  const user3 = await prisma.user.create({
    data: {
      username: "user",
      email: "user@example.com",
      password: hashedPassword,
      userTypeId: userTypeObjs[0]?.id ?? 9999,
    },
  });
  const user4 = await prisma.user.create({
    data: {
      username: "admin-2",
      email: "admin2@example.com",
      password: hashedPassword,
      userTypeId: userTypeObjs[2]?.id ?? 9999,
    },
  });

  //--------------------------------------------------------------------
  // customerType
  const customerType = ["vip", "normal"];
  const customerTypeIds = [];
  for (const type of customerType) {
    const ct = await prisma.customerType.create({ data: { name: type } });
    customerTypeIds.push(ct);
  }
  // customer
  await prisma.customer.create({
    data: {
      nameSurname: "Jhon Aydin",
      email: "normal@example.com",
      customerTypeId: customerTypeIds[0]?.id ?? 0,
      userId: user1.id,
    },
  });
  await prisma.customer.create({
    data: {
      nameSurname: "Gorkem Aydin",
      email: "vip@example.com",
      customerTypeId: customerTypeIds[1]?.id ?? 0,
      userId: user2.id,
    },
  });
  //--------------------------------------------------------------------

  // productType ve product
  const productTypeNames = ["Bracelet", "Necklace", "Earring", "Signet Ring", "Watch", "Ring"];
  const productTypeObjs = [];
  for (const type of productTypeNames) {
    const pt = await prisma.productType.create({ data: { name: type } });
    productTypeObjs.push(pt);
  }

  const products = [];
  for (let i = 0; i < productTypeNames.length; i++) {
    const prod = await prisma.product.create({
      data: {
        productTypeId: productTypeObjs[i]?.id ?? 0,
        quantity:i,  // quantity i value
        grossWeight:100, // 100 ons
        unitPrice: 2500 + (i * 500),   // unit price
        totalPrice: i * (2500 + (i * 500)),  // i value + unit price
      },
    });
    products.push(prod);
  }

  // ---------------------------------------------------------------------------
  // transactionType ve transaction
  const transactionTypeNames = ["sale", "purchase", "deposit", "limit"];
  const transactionTypeObjs = [];
  for (const name of transactionTypeNames) {
    const tt = await prisma.transactionType.create({ data: { name: name  } });
    transactionTypeObjs.push(tt);
  }
  const transaction1 = await prisma.transaction.create({
    data: {
      userId: user1.id,
      customerId: customerTypeIds[0]?.id ?? 0,
      transactionTypeId: transactionTypeObjs[0]?.id ?? 0,
    },
  });
  const transaction2 = await prisma.transaction.create({
    data: {
      userId: user2.id,
      customerId: customerTypeIds[1]?.id ?? 0,
      transactionTypeId: transactionTypeObjs[1]?.id ?? 0,
    },
  });
  const transaction3 = await prisma.transaction.create({
    data: {
      userId: user3.id,
      customerId: customerTypeIds[1]?.id ?? 0,
      transactionTypeId: transactionTypeObjs[2]?.id ?? 0,
    },
  });
  // ---------------------------------------------------------------------------
  // transactionProduct
  await prisma.transactionProduct.create({
    data: {
      transactionId: transaction1.id,
      productId: products[0]?.id ?? 0,
      quantity: 1,
    },
  });
  await prisma.transactionProduct.create({
    data: {
      transactionId: transaction2.id,
      productId: products[1]?.id ?? 0,
      quantity: 2,
    },
  });
  await prisma.transactionProduct.create({
    data: {
      transactionId: transaction3.id,
      productId: products[2]?.id ?? 0,
      quantity: 5,
    },
  });
}


