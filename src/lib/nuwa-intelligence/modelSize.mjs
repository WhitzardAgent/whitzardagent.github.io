import {parameterLabel} from '../modelMetadata.mjs';
// AA's textual definitions resolve the overlapping shorthand at 4B and 40B.
export const modelSizeScale={version:'total-parameters-bands-1',basis:'total',source:'https://artificialanalysis.ai/models/open-source',checkedOn:'2026-10-28',bands:[
 {id:'tiny',diameter:8,label:{en:'Tiny ≤4B',zh:'微型 ≤4B'}},
 {id:'small',diameter:12,label:{en:'Small >4–<40B',zh:'小型 >4–<40B'}},
 {id:'medium',diameter:18,label:{en:'Medium 40–150B',zh:'中型 40–150B'}},
 {id:'large',diameter:26,label:{en:'Large >150B',zh:'大型 >150B'}},
 {id:'unknown',diameter:10,label:{en:'Unknown / undisclosed',zh:'待核实／未披露'}}
]};
export function modelSizeMark(row){
 const p=row.modelMetadata?.parameters,known=p?.status==='disclosed'&&Number.isFinite(p.total)&&p.total>0&&p.sources?.length>0;
 const id=!known?'unknown':p.total<=4e9?'tiny':p.total<40e9?'small':p.total<=150e9?'medium':'large';
 return {...modelSizeScale.bands.find(b=>b.id===id),known:Boolean(known),total:known?p.total:null,active:known?p.active:null};
}
export function modelSizeDescription(row,locale='en'){
 const mark=modelSizeMark(row),en=locale==='en';return `${en?'Total-parameter size':'总参数尺寸'}: ${mark.label[locale]} · ${parameterLabel(row.modelMetadata?.parameters,locale)}${mark.known?(en?' (MoE active parameters are separate)':'（MoE 激活参数单列）'):''}`;
}
export function modelSizeLegend(rows,locale='en'){
 const en=locale==='en',known=rows.filter(r=>modelSizeMark(r).known).length;
 return `<div class="nv-size-key"><strong>${en?'Point size · total parameters (B = billion)':'点大小 · 总参数量（B = 十亿）'}</strong>${modelSizeScale.bands.map(b=>`<span><i style="--point-size:${b.diameter}px"${b.id==='unknown'?' class="nv-size-unknown"':''} aria-hidden="true"></i>${b.label[locale]}</span>`)}</div><p>${en?`${known}/${rows.length} plotted observations have disclosed, source-backed sizes. Fixed size bands, not proportional area; dashed outlines mean size unknown. Selection changes the outline only.`:`${rows.length} 条绘图观测中 ${known} 条有来源支持的已披露尺寸。采用固定档位，不按参数比例缩放面积；虚线轮廓表示尺寸未知，选中仅改变轮廓。`} ${en?'Scores retain each protocol’s meaning; this does not establish a size–risk causal relationship.':'成绩仍按各协议解释，不能据此确定尺寸与风险的因果关系。'} <a href="${modelSizeScale.source}" target="_blank" rel="noreferrer">${en?'Size bands adapted from Artificial Analysis':'分档参考 Artificial Analysis'} ↗</a></p>`;
}
