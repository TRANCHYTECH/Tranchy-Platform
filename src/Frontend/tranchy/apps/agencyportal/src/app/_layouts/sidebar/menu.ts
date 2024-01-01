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
  {
    id: 3,
    label: 'menu.question.title',
    icon: 'home',
    subItems: [
      {
        id: 4,
        label: 'menu.question.list',
        link: '/question/question-list',
        parentId: 3,
      },
    ],
  }
];
