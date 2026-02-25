import type { RootStackParamList } from '@/utils/types';

/**
 * Build a route object for navigation.navigate().
 * Useful for passing around routes as data (e.g. deep links, notifications).
 *
 * @example
 * // Screen without params
 * buildRoute('Home')
 * // => { screen: 'Home', params: undefined }
 *
 * // Screen with params
 * buildRoute('Profile', { userId: '123' })
 * // => { screen: 'Profile', params: { userId: '123' } }
 */
export function buildRoute<T extends keyof RootStackParamList>(
    screen: T,
    ...args: RootStackParamList[T] extends undefined
        ? []
        : [params: RootStackParamList[T]]
): { screen: T; params: RootStackParamList[T] } {
    return {
        screen,
        params: (args[0] ?? undefined) as RootStackParamList[T],
    };
}

/**
 * Build a deep link path string for a screen.
 * Concatenates screen name with params as path segments.
 *
 * @example
 * buildDeepLink('Profile', { userId: '123' })
 * // => '/Profile/123'
 *
 * buildDeepLink('Home')
 * // => '/Home'
 */
export function buildDeepLink<T extends keyof RootStackParamList>(
    screen: T,
    ...args: RootStackParamList[T] extends undefined
        ? []
        : [params: RootStackParamList[T]]
): string {
    const params = args[0];
    if (params && typeof params === 'object') {
        const segments = Object.values(params).join('/');
        return `/${String(screen)}/${segments}`;
    }
    return `/${String(screen)}`;
}
