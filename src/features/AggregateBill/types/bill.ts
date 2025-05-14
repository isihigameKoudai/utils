export type CreditCardBrand = 'rakuten' | 'view' | 'd' | 'aplus' | 'yodobashi';

export interface Bill {
  id: string;
  date: Date;
  name: string;
  amount: number;
  brand: CreditCardBrand;
}

export interface BillSummary {
  totalAmount: number;
  monthlyTotals: {
    [key: string]: number;
  };
  brandTotals: {
    [key in CreditCardBrand]: number;
  };
} 
