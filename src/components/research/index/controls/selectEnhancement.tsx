import {createRoot,type Root} from 'react-dom/client';
import IndexCombobox,{type SelectChoice} from './IndexCombobox';
import {organizationBrand} from '../../../../lib/organizationBrands.mjs';
import './indexSelects.css';
type Entry={select:HTMLSelectElement;host:HTMLElement;root:Root;label:HTMLLabelElement|null;id:string;observer:MutationObserver;style:string|null;tabIndex:string|null;labelFor:string|null};
class NuwaSelectSystem extends HTMLElement{
 entries=new Map<HTMLSelectElement,Entry>();controller?:AbortController;intersection?:IntersectionObserver;frame=0;config:{locale:string;developers:Record<string,string>}={locale:'en',developers:{}};
 connectedCallback(){
  this.config=JSON.parse(this.querySelector('script')!.textContent!);this.controller=new AbortController();const {signal}=this.controller;
  const schedule=()=>{cancelAnimationFrame(this.frame);this.frame=requestAnimationFrame(()=>this.sync());};
  this.intersection=new IntersectionObserver(schedule,{rootMargin:'100px'});
  document.querySelectorAll<HTMLSelectElement>('#main-content select:not([multiple])').forEach(select=>this.intersection!.observe(select));
  for(const event of ['nuwa-index-change','nuwa-topic-change','nuwa-monitor-sources','nuwa-selects-sync','popstate','hashchange'])window.addEventListener(event,schedule,{signal});
  document.addEventListener('change',schedule,{signal});document.addEventListener('click',schedule,{signal});this.sync();
 }
 sync(){
  const selects=document.querySelectorAll<HTMLSelectElement>('#main-content select:not([multiple])');
  for(const select of selects){
   let entry=this.entries.get(select);if(entry){this.render(entry);continue;}
   const rect=select.getBoundingClientRect();if(!rect.width||!rect.height||select.closest('[hidden]')||rect.top>innerHeight+100||rect.bottom<0)continue;
   const label=select.closest('label'),id=`nuwa-select-${this.entries.size+1}`,host=document.createElement('div');host.dataset.nuwaSelect='';host.dataset.nativeName=select.name||Object.keys(select.dataset)[0]||id;
   entry={select,host,root:createRoot(host),label,id,observer:new MutationObserver(()=>this.render(entry!)),style:select.getAttribute('style'),tabIndex:select.getAttribute('tabindex'),labelFor:label?.getAttribute('for')??null};
   this.entries.set(select,entry);this.intersection?.unobserve(select);select.after(host);select.style.cssText='position:absolute;width:1px;height:1px;opacity:0;overflow:hidden;clip-path:inset(50%);padding:0;margin:-1px';select.tabIndex=-1;select.setAttribute('aria-hidden','true');if(label)label.htmlFor=id;
   entry.observer.observe(select,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','disabled','selected','label']});select.addEventListener('change',()=>this.render(entry!),{signal:this.controller!.signal});this.render(entry);
  }
 }
 render(entry:Entry){
  const {select,id}=entry,caption=entry.label?[...entry.label.childNodes].filter(node=>node.nodeType===Node.TEXT_NODE).map(node=>node.textContent).join(' ').trim():'';const label=select.getAttribute('aria-label')||entry.label?.querySelector(':scope > span')?.textContent||caption||select.name;
  const choices:SelectChoice[]=[...select.options].filter(option=>(!option.hidden||option.selected)&&!(option.parentElement instanceof HTMLOptGroupElement&&option.parentElement.hidden)).map(option=>({value:option.value,label:option.textContent??'',disabled:option.disabled||option.parentElement instanceof HTMLOptGroupElement&&option.parentElement.disabled,group:option.parentElement instanceof HTMLOptGroupElement?option.parentElement.label:'',mark:organizationBrand(this.config.developers[option.value]??option.value)?.asset?.path}));
  entry.root.render(<IndexCombobox id={id} label={label.trim()} value={select.value} choices={choices} locale={this.config.locale} disabled={select.disabled} onSelect={value=>{select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));this.render(entry);}}/>);
 }
 disconnectedCallback(){cancelAnimationFrame(this.frame);this.controller?.abort();this.intersection?.disconnect();for(const entry of this.entries.values()){entry.observer.disconnect();entry.root.unmount();entry.host.remove();if(entry.style===null)entry.select.removeAttribute('style');else entry.select.setAttribute('style',entry.style);if(entry.tabIndex===null)entry.select.removeAttribute('tabindex');else entry.select.setAttribute('tabindex',entry.tabIndex);entry.select.removeAttribute('aria-hidden');if(entry.label){if(entry.labelFor===null)entry.label.removeAttribute('for');else entry.label.htmlFor=entry.labelFor;}}this.entries.clear();}
}
if(!customElements.get('nuwa-select-system'))customElements.define('nuwa-select-system',NuwaSelectSystem);
