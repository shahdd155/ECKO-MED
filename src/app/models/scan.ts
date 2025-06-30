export interface Scan {
    type: string;
    date: string; // or use `Date` if parsed
    description: string;
    imageBase64: string;
  }
  