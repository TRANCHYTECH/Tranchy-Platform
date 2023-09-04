import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'Dashboard',
    icon: 'bx bxs-dashboard',
    subItems: [
      {
        id: 3,
        label: 'Home',
        link: '/',
        parentId: 1
      }
    ]
  },
  {
    id: 2,
    label: 'Setting',
    icon: 'bx bxs-dashboard',
    subItems: [
      {
        id: 3,
        label: 'Agency profile',
        link: '/setting/profile',
        parentId: 2
      }
    ]
  }
];
