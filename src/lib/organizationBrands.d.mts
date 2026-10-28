export interface OrganizationBrandAsset {
  path: string;
  format: 'png' | 'svg';
  width: number;
  height: number;
  sourceUrl: string;
  resolvedSourceUrl?: string;
  sourcePage: string;
  sourceLocator?: string;
  sourceTitle?: string;
  kind: 'official-site-icon' | 'official-site-logo' | 'project-supplied-mark';
  sha256: string;
  sourceSha256?: string;
  background: 'light' | 'dark';
}
export interface OrganizationBrand {
  organizationId: string;
  displayName?: string;
  officialHomepage: string | null;
  retrievedOn: string;
  status: 'available' | 'unavailable';
  asset: OrganizationBrandAsset | null;
  note: string;
  attempts?: { url: string; result: string }[];
}
export function organizationBrand(organizationId: string): OrganizationBrand | null;
export function organizationMarkMarkup(organizationId: string, name: string, options?: {size?: 'small' | 'large'; showName?: boolean}): string;
