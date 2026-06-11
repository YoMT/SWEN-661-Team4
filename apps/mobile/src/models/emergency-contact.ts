export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  createdAt: string;
  updatedAt: string;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';
}
