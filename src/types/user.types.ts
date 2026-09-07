export interface UserCompany {
  name: string;
  title: string;
  department: string;
}

export interface UserAddress {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  ip: string;
  address: UserAddress;
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: UserCompany;
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
  role: string;
  status: "active" | "inactive";
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface UserActivity {
  id: number;
  userId: number;
  action: string;
  status: "Success" | "Failed";
  timestamp: string;
}

export interface UserActivityResponse {
  activities: UserActivity[];
  total: number;
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  tenantId: string;
  page: number;
}
