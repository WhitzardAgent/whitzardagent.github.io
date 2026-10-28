import registry from '../data/nuwa-index/organization-brands.json' with { type: 'json' };

import supplemental from '../data/nuwa-index/model-developer-brands.json' with {type:'json'};
const brands = new Map([...registry.organizations,...supplemental.organizations].map(record => [record.organizationId, record]));

/** Presentation metadata only; the scientific catalogue and snapshots stay independent. */
export function organizationBrand(organizationId) {
  return brands.get(organizationId) ?? null;
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

/** Safe decorative mark for progressively enhanced HTML; full names remain visible text. */
export function organizationMarkMarkup(organizationId, name, {size = 'small', showName = true} = {}) {
  const asset = organizationBrand(organizationId)?.asset;
  const dimension = size === 'large' ? 40 : 20;
  const mark = asset ? `<img class="organization-mark__image" src="${escapeHtml(asset.path)}" alt="" width="${dimension}" height="${dimension}" loading="lazy" decoding="async" style="width:${dimension}px;height:${dimension}px;object-fit:contain;flex-shrink:0;background:${asset.background === 'dark' ? '#182234' : '#fff'};border-radius:3px;padding:2px;box-sizing:border-box">` : '';
  return `<span class="organization-mark" style="display:inline-flex;align-items:center;gap:8px;max-width:100%;vertical-align:middle">${mark}${showName ? `<span style="overflow-wrap:anywhere">${escapeHtml(name)}</span>` : ''}</span>`;
}
