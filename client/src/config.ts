/**
 * Site-wide settings that are not race data.
 *
 * TIP_URL: the maker's permanent bunq.me link. While it is null, no tip link
 * is shown anywhere. The exact value is pinned in config.test.tsx, so a
 * swapped link fails the build before it can deploy.
 */
export const TIP_URL: string | null = null;
