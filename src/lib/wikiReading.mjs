/** Recompose existing editorial notes; this does not create new findings or upgrade review. */
export function readingSections(work,locale='en'){
 const en=locale==='en',seen=new Set([work.summary?.[locale]?.trim()].filter(Boolean));
 const groups=[['question',en?'Research question':'研究问题',['question','method']],['finding',en?'Source findings':'来源研究发现',['finding']],['interpretation',en?'NUWA interpretation':'NUWA 解读',['supports','connections']],['limits',en?'Scope and open questions':'范围与开放问题',['limits']]];
 return groups.flatMap(([id,title,keys])=>{const paragraphs=keys.flatMap(key=>{const p=work.note?.[key]?.[locale]?.trim();if(!p||seen.has(p))return [];seen.add(p);return[p];});return paragraphs.length?[{id,title,paragraphs}]:[];});
}
