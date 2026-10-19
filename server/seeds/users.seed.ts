import { UserProfile } from '../../src/types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-101',
    name: 'Prasad Sharma',
    email: 'prasad.sharma@hommlyn247.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Prestige Ferns, Koramangala 4th Block',
    city: 'Bangalore',
    pincode: '560034',
    role: 'client',
    joinedDate: '2026-01-10'
  },
  {
    id: 'usr-adm-1',
    name: 'Admin Operations Console',
    email: 'admin@hommlyn247.com',
    phone: '+91 98000 00247',
    address: 'hommlyn247 HQ, Embassy Tech Village, Outer Ring Road',
    city: 'Bangalore',
    pincode: '560103',
    role: 'admin',
    joinedDate: '2025-12-01'
  },
  {
    id: 'hlp-101',
    name: 'Sunita Devi',
    email: 'sunita.devi@partners.hommlyn247.com',
    phone: '+91 98765 43211',
    address: 'Ejipura, Koramangala Hub',
    city: 'Bangalore',
    pincode: '560047',
    role: 'provider',
    joinedDate: '2026-01-15'
  }
];
