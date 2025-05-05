export interface Charge {
    description: string;
    amount: number;
  }
  
export interface Receipt {
patientName: string;
visitDate: string; // or use `Date` if it's a proper Date object
doctor: string;
charges: Charge[];
total: number;
}
  