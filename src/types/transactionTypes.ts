


import type { CreateProductInputProps } from "./productTypes.js";
import type {CreateCustomerInputProps} from './customerTypes.js'

export type CreateTransactionInputProps={
    userId:number,
    transactionTypeId:number,
    customerId:number,
    products:{productId:number,quantity:number}[]
    //     products: Array<{
    //         productId: number;
    //         quantity: number;
    // }>;
};


// 1- giriş yapmış kullanıcı id verme
// 2- müşteri id verme yoksa yeni müşteri oluşturma
// 3- ürün oluşturma ve id,quantity verme

// endpoint gelecek veri türünü temsil etmektedir.
export type CreateAllTransactionInputProps={
    userId:number,
    customerId?:number,
    customer?:CreateCustomerInputProps,
    products:CreateProductInputProps[],
    transactionTypeId?:number,
}

