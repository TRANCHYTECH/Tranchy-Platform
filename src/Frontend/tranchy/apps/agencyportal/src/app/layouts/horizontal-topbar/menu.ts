import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENU',
    isTitle: true
  },
  {
    id: 2,
    label: 'DASHBOARD',
    icon: 'bx bxs-dashboard',
    subItems: [
      {
        id: 3,
        label: 'LIST ANALYTICS',
        link: '/analytics',
        parentId: 2
      }
    ]
  }
];
