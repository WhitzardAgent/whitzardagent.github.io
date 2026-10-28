import {reportedBrandIds} from './modelBrandIdentity.mjs';
import {organizationMarkMarkup,organizationBrand} from './organizationBrands.mjs';
export function modelMarkMarkup(system){return reportedBrandIds(system).map(id=>organizationMarkMarkup(id,'',{showName:false})).join('');}
export function modelMarkSvg(system,x=0,y=0){return reportedBrandIds(system).flatMap((id,i)=>{const asset=organizationBrand(id)?.asset;return asset?[`<image href="${asset.path}" x="${x+i*21}" y="${y}" width="18" height="18"/>`]:[];}).join('');}
