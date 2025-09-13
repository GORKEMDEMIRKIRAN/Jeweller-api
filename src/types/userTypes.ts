




export type RegisterUserInputProps = {
  email: string;
  password: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  phoneVerificationCode?: number;
  phoneCodeExpiresAt?: Date;
  userTypeId: number;
  username?: string;
  phone?:string
  accessToken?: string;
  refreshToken?: string;
};

export type UpdateUserInputProps = Partial<{
  email: string;
  password: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  phoneVerificationCode: number | null;
  phoneCodeExpiresAt: Date | null;
  userTypeId: number;
  username: string;
  phone:string;
  accessToken: string | null;
  refreshToken: string | null;
}>; 