import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  //--------------------------------------------------------------------
  // userType add
  const userTypes = ["admin", "manager", "user"];
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
      password: "123",
      userTypeId: userTypeObjs[0]?.id ?? 1,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      username: "manager",
      email: "manager@example.com",
      password: "123",
      userTypeId: userTypeObjs[1]?.id ?? 1,
    },
  });
  const user3 = await prisma.user.create({
    data: {
      username: "user",
      email: "user@example.com",
      password: "123",
      userTypeId: userTypeObjs[2]?.id ?? 1,
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
      name: "Gorkem",
      surname: "gr",
      email: "gorkem@example.com",
      customerTypeId: customerTypeIds[0]?.id ?? 1,
      userId: user1.id,
    },
  });
  await prisma.customer.create({
    data: {
      name: "Gorkem",
      surname: "gr",
      email: "gorkem2@example.com",
      customerTypeId: customerTypeIds[1]?.id ?? 1,
      userId: user2.id,
    },
  });
  //--------------------------------------------------------------------

  // productType ve product
  const productTypeNames = ["Bilezik", "Kolye", "Küpe", "Künye", "Saat", "Yüzük"];
  const productTypeObjs = [];
  for (const type of productTypeNames) {
    const pt = await prisma.productType.create({ data: { name: type } });
    productTypeObjs.push(pt);
  }

  const products = [];
  for (let i = 0; i < productTypeNames.length; i++) {
    const prod = await prisma.product.create({
      data: {
        name: productTypeNames[i] ?? "",
        productTypeId: productTypeObjs[i]?.id ?? 1,
        price: 2500 + i * 500,
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
      name: "Transaction 1",
      quantity: 1,
      productId: products[0]?.id ?? 1,
      transactionTypeId: transactionTypeObjs[0]?.id ?? 1,
      createdAt: new Date(),
    },
  });
  const transaction2 = await prisma.transaction.create({
    data: {
      userId: user2.id,
      name: "Transaction 2",
      quantity: 2,
      productId: products[1]?.id ?? 1,
      transactionTypeId: transactionTypeObjs[1]?.id ?? 1,
      createdAt: new Date(),
    },
  });
  const transaction3 = await prisma.transaction.create({
    data: {
      userId: user3.id,
      name: "Transaction 3",
      quantity: 5,
      productId: products[2]?.id ?? 1,
      transactionTypeId: transactionTypeObjs[2]?.id ?? 1,
      createdAt: new Date(),
    },
  });
  // ---------------------------------------------------------------------------
  // transactionProduct
  await prisma.transactionProduct.create({
    data: {
      transactionId: transaction1.id,
      productId: products[0]?.id ?? 1,
      quantity: 1,
    },
  });
  await prisma.transactionProduct.create({
    data: {
      transactionId: transaction2.id,
      productId: products[1]?.id ?? 1,
      quantity: 2,
    },
  });
  await prisma.transactionProduct.create({
    data: {
      transactionId: transaction3.id,
      productId: products[2]?.id ?? 1,
      quantity: 5,
    },
  });
}
export default seed;

