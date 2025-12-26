export type Customer = {
  _id: string;
  company: string;
  phone: string;
  address?: string;
  location?: string;
  paymentMode?: string;
  status: string;
  created: string;
  executive?: {
    name: string;
    surname?: string;
    phone?: string;
  };
};