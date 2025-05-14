import { Bill, CreditCardBrand } from '../types/bill';

export const parseCSV = (csvContent: string, brand: CreditCardBrand): Bill[] => {
  const lines = csvContent.split('\n');
  const bills: Bill[] = [];

  // ヘッダー行をスキップ
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const [dateStr, name, amountStr] = line.split(',').map(item => item.trim());
    
    bills.push({
      id: `${brand}-${i}`,
      date: new Date(dateStr),
      name,
      amount: Number(amountStr),
      brand
    });
  }

  return bills;
}; 
