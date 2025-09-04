


export type CreateProductInputProps={
    unitPrice:number,
    totalPrice?:number,
    quantity:number,
    grossWeight:number,
    netWeight:number,
    images:string[],
    productTypeId:number,
}

export type UpdateProductInputProps=Partial<{
    unitPrice:number,
    totalPrice:number,
    quantity:number,
    grossWeight:number,
    netWeight:number,
    images:string[],
    productTypeId:number,
}>

