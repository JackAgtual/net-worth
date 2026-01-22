export type UserItem = {
  userId: string;
};

export type Entry = UserItem & {
  title: string;
  amount: number;
  notes?: string;
};

export enum Category {
  Cash = "Cash",
  AfterTax = "After Tax",
  TaxFree = "Tax free",
  TaxDeferred = "Tax deferred",
  Property = "Property",
}
