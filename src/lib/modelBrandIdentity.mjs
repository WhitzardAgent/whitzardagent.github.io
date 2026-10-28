import {organizationBrand} from './organizationBrands.mjs';
/** Brand attribution is independent of precise endpoint/release identity. */
const rules=[
 ['cohere',/^(?:cohere[\s:-]+)?command[\s_-]*r(?:[+\s_-]|$)/i],['minimax',/^minimax(?:[\s_-]|$)/i],['deepseek',/^(?:deepseek)(?:[\s_-]|$)/i],['anthropic',/^(?:(?:anthropic[\s:-]+)?claude[\s_-]+(?!code\b)|anthropic[\s:-]+opus\b|(?:opus|sonnet|haiku)[\s_-]+\d)/i],
 ['openai',/^(?:openai[\s:-]+)?(?:gpt(?:[\s_-]|$)|o[134](?:[\s_-]|$))/i],['deepmind',/^(?:google[\s:-]+)?(?:gemini|gemma)(?:[\s_-]|\d|$)/i],
 ['moonshot',/^(?:moonshot[\s:-]+)?kimi(?:[\s_-]|\d|$)/i],['zai',/^(?:z[.\s-]?ai[\s:-]+)?glm(?:[\s_-]|\d|$)/i],['qwen',/^(?:qwen|qwq)(?:[\s_-]|\d|$)/i],['xai',/^(?:xai[\s:-]+)?grok(?:[\s_-]|\d|$)/i],['meta',/^(?:meta[\s_-]+)?(?:llama|muse)(?:[\s_-]|\d|$)/i],['mistral',/^(?:mistral|mixtral)(?:[\s_-]|\d|$)/i]
];
export function resolveDeveloper(system,data=null){
 const name=String(system??'').trim().replace(/^(?:C-Agent|OpenAI Codex CLI):\s*/i,'');
 if(/^multi-model\b|^average\b/i.test(name))return null;
 const match=rules.find(([,pattern])=>pattern.test(name));
 if(!match||data&&!data.organizations?.some(o=>o.id===match[0])&&!organizationBrand(match[0]))return null;
 return {organizationId:match[0],basis:'reported-model-family',reportedName:system};
}

export function reportedBrandIds(system){
 const single=resolveDeveloper(system);if(single)return[single.organizationId];
 const value=String(system??'');if(!/^multi-model\s*\(/i.test(value))return[];
 const list=value.slice(value.indexOf('(')+1,value.indexOf(')'));
 return [...new Set(list.split(',').flatMap(part=>{const r=resolveDeveloper(part.trim().replace(/^abliterated\s+/i,''));return r?[r.organizationId]:[];}))];
}
