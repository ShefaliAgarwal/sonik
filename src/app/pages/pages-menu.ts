import { NbMenuItem } from '@nebular/theme';

const mainMenu = ['analytics', 'campaigns', 'admin'];
export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: mainMenu[0].charAt(0).toUpperCase() + mainMenu[0].slice(1),
    icon: 'nb-layout-default',
    link: '/pages/analytics',
  },
  {
    title: mainMenu[1].charAt(0).toUpperCase() + mainMenu[1].slice(1),
    icon: 'nb-layout-default',
    link: '/pages/campaigns',
  },
  {
    title: mainMenu[2].charAt(0).toUpperCase() + mainMenu[2].slice(1),
    icon: 'nb-layout-default',
    link: '/pages/admin',
  }
];
