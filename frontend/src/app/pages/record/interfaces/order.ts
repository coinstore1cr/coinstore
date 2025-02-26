export interface Order {
    name: string;
  termCode: string;
  openingPrice: number;
  deliveryPrice: number;
  direction: 'Up' | 'Down';
  time: string;
  buyAmount: number;
  openingTime: string;
  deliveryTime: string;
  profitAndLoss: number;
}
