export type Customer = {
  id: string
  code: string
  firstName: string
  middleName?: string
  lastNameOne: string
  lastNameTwo?: string
  address: string
  apartment?: string
  countryId: number
  stateId: number
  cityId: number
  zipCode: string
  phone: string
  dob: Date
  type: "CUSTOMER" | "RECIPIENT"
  ssn: string
  dlid: string
  imageUrl?: string
  percentage: number
  isActive: boolean
  notes?: string
  checkTransaction: CheckTransaction[]
  sentTransfers: SentTransfers[]
};

export type Recipient = Customer;

export type SentTransfers = {
  id: string
  companyId: string
  recipientId: string
  amount: number
  feed: number
}

export type City = {
  id: string
  name: string
  code: string
  stateId: string
}

export type CheckTransaction = {
  id: string
  customerId: string
  checkTransactionTypeId: string
  number: string
  amount: number
  feed: number
  createdAt: Date
}

export type TransactionType = {
  id: string
  name: string
  description: string
}

export type Company = {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}

export type Country = {
  id: string
  name: string
  code: string
}

export type State = {
  id: string
  name: string
  code: string
  countryId: string
}

export type Settings = {
  id: string
  name: string
  code: string
  zipCode: string
  cityId: string
  stateId: string
  numCustomerPercentRate: number
  customerPercentRate: number
  moneyOrderFeed: number
  maxBankDepositLimit: number
  minimunAge: number
}