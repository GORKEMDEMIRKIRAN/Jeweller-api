




export type RegisterUserInputProps = {
  email: string;
  password: string;
  userTypeId: number;
  username?: string;
  phone?:number
  accessToken?: string;
  refreshToken?: string;
};

export type UpdateUserInputProps = Partial<{
  email: string;
  password: string;
  userTypeId: number;
  username: string;
  phone:number;
  accessToken: string;
  refreshToken: string;
}>; 