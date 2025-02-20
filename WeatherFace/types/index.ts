export interface City {
  name: string;
  address: {
    postCode: number;
  };
}

export interface User {
  email: string;
  password: string;
  phoneNumber: string;
  cities: City[];
}

export type SignInFormData = Pick<User, 'email' | 'password'>;

export interface SignUpFormData extends User {
  confirmPassword: string;
}

export interface WeatherSearch {
  name: string;
}
