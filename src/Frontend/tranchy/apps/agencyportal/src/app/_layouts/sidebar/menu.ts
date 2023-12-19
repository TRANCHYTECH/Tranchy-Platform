import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'menu.user.title',
    icon: 'home',
    subItems: [
      {
        id: 2,
        label: 'menu.user.list',
        link: '/user/user-list',
        parentId: 1,
      },
    ],
  },
];
