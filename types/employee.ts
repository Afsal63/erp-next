export type EmployeeInventoryItem = {
  _id: string;
  itemName: string;
  actualQty: number;
  quantity: number;
  barCode: string;
};

export type Employee = {
  _id: string;

  /* status flags */
  removed: boolean;
  enabled: boolean;

  /* basic info */
  name: string;
  surname?: string;
  birthday?: string;
  gender?: "Male" | "Female" | "Other";

  /* job info */
  department?: string;
  position?: string;

  /* contact */
  phone: string;
  phonePrefix?: string;
  email?: string;

  /* location */
  address?: string;
  state?: string;

  /* system */
  status?: string;
  checkInStatus?: string;
  checkInCustomerStatus?: any[];

  /* inventory assigned to employee */
  items?: EmployeeInventoryItem[];

  /* meta */
  created?: string;
};