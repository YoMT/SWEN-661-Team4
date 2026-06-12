export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  careeName?: string;
  dateOfBirth?: string;
  photoUrl?: string;
  bloodType?: string;
  allergies: string[];
  createdAt: string;
  updatedAt: string;
}
