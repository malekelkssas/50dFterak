/**
 * Theme constants.
 */

import type { ColorScheme } from '@mobile/utils/types';

export const SCHEME_LIGHT: ColorScheme = 'light';
export const SCHEME_DARK: ColorScheme = 'dark';

/**
 * Theme color constants.
 * Values are RGB channel strings (e.g. '255 255 255') used with
 * NativeWind's vars() and Tailwind's rgb() color function.
 */

export const colors = {
  light: {
    background: '255 255 255',
    foreground: '10 10 10',
    primary: '59 130 246',
    secondary: '100 116 139',
    muted: '241 245 249',
    accent: '99 102 241',
    border: '226 232 240',
    surface: '248 250 252',
    mutedForeground: '100 116 139',
    primaryOn: '255 255 255',
  },
  dark: {
    background: '10 10 10',
    foreground: '245 245 245',
    primary: '96 165 250',
    secondary: '148 163 184',
    muted: '30 41 59',
    accent: '129 140 248',
    border: '51 65 85',
    surface: '24 24 27',
    mutedForeground: '148 163 184',
    primaryOn: '255 255 255',
  },
} as const;

/** StatusBar background colors (hex) for each scheme */
export const statusBarColors = {
  light: '#ffffff',
  dark: '#0a0a0a',
} as const;
