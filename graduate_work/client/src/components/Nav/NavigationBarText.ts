// NavigationBarText.tsx

import {  MenuItemsList ,NavbarTextTypes } from "../App/props.interface";

export const menuItemsList: MenuItemsList = {
  bg: ['Филми', 'Сериали'] as MenuItemsList['bg'],
  en: ['Movies', 'Series'] as MenuItemsList['en'],
};

export const NavbarText = {
  bg: {
    liked: 'Секция Харесвани',
    watched: 'Секция Гледани',
    system: 'Системна',
    dark: 'Тъмна',
    light: 'Светла',
    themeText: 'Тема',
    bg: 'БГ',
    en: 'EN',
    language: 'Език',
    signInBtn : 'Вход',
    popularTxt: 'Популярни',
    trendingTxt: 'Трендинг',
    nowPlayingTxt: 'Сега пуснати',
    profile: 'Профил',
    settings: 'Настройки',
    helpFeedback: 'Помощ и Обратна връзка',
    logOut: 'Изход',
    categories: 'Категории',

  } as NavbarTextTypes,
  en: {
    liked: 'Liked Section',
    watched : 'Watched Section',
    system: 'System',
    dark: 'Dark',
    light: 'Light',
    themeText: 'Theme',
    bg: 'БГ',
    en: 'EN',
    language: 'Language',
    signInBtn : 'Sign in',
    popularTxt: 'Popular',
    trendingTxt: 'Trending',
    nowPlayingTxt: 'Now Playing',
    profile: 'Profile',
    settings: 'Settings',
    helpFeedback: 'Help & Feedback',
    logOut: 'Log Out',
    categories: 'Categories',
  } as NavbarTextTypes,
};
