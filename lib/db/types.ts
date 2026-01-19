export interface UserItem {
  userId: string;
}

export interface Entry extends UserItem {
  title: string;
  amount: number;
  notes?: string;
}

export enum Category {
  Cash = "Cash",
  AfterTax = "After Tax",
  TaxFree = "Tax free",
  TaxDeferred = "Tax deferred",
  Property = "Property",
}
