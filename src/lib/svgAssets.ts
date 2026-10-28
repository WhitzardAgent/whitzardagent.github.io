/** Embed local marks so downloaded SVGs do not depend on the website origin. */
export async function embedSvgMarks(svg:string){
 const paths=[...new Set([...svg.matchAll(/href="(\/assets\/organizations\/[^"<>]+)"/g)].map(m=>m[1]))];
 for(const path of paths){const response=await fetch(path);if(!response.ok)throw new Error('Unable to embed chart mark: '+path);const blob=await response.blob();const image=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(blob);});svg=svg.replaceAll(`href="${path}"`,`href="${image}"`);}return svg;
}
