export interface Patient {
  apikey: string;
  zipcode: number;
  mobile: string;
  first_name: string;
  last_name?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  blood_group?: string;
}
