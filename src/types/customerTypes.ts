




export type CreateCustomerInputProps={
    nameSurname:string;
    email:string;
    phone:string;
    address:string;
    customerTypeId:number;
    userId:number;
}


export type UpdateCustomerInputProps=Partial<CreateCustomerInputProps>;