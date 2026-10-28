import {Combobox,ComboboxButton,ComboboxInput,ComboboxOption,ComboboxOptions} from '@headlessui/react';
import {useRef,useState} from 'react';
export interface SelectChoice {value:string;label:string;disabled:boolean;group:string;mark?:string}
interface Props {id:string;label:string;value:string;choices:SelectChoice[];locale:string;disabled:boolean;onSelect:(value:string)=>void}
export default function IndexCombobox({id,label,value,choices,locale,disabled,onSelect}:Props){
 const [query,setQuery]=useState(''),button=useRef<HTMLButtonElement>(null),en=locale==='en',searchable=choices.length>7;
 const selected=choices.find(choice=>choice.value===value),terms=query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean),filtered=choices.filter(choice=>terms.every(term=>choice.label.toLocaleLowerCase().includes(term)));
 return <Combobox value={value} onChange={(next:string|null)=>{if(next!==null)onSelect(next);}} onClose={()=>setQuery('')} disabled={disabled}>
  {({open})=><>
   <div className="nuwa-select-control relative min-w-0 rounded-md bg-white transition-colors focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-800/10" data-open={open||undefined}>
    {selected?.mark&&<img src={selected.mark} alt="" width="16" height="16" className="nuwa-select-mark absolute left-3 top-1/2 -translate-y-1/2 object-contain"/>}
    <ComboboxInput id={id} aria-label={label} readOnly={!searchable} autoComplete="off" spellCheck={false} onFocus={event=>{if(searchable)event.target.select();}} displayValue={(current:string)=>choices.find(choice=>choice.value===current)?.label??''} onChange={event=>setQuery(event.target.value)} onClick={()=>{if(!open)button.current?.click();}} className={`nuwa-select-input w-full min-w-0 truncate border-0 bg-transparent py-2 pr-9 text-left outline-none ${selected?.mark?'pl-9':'pl-3'}`}/>
    <ComboboxButton ref={button} className="nuwa-select-button absolute inset-y-0 right-0 flex w-8 items-center justify-center" aria-label={en?`Open ${label}`:`展开${label}`}>
     <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </ComboboxButton>
   </div>
   <ComboboxOptions aria-label={label} modal={false} data-lenis-prevent anchor={{to:'bottom start',gap:6,padding:12}} portal className="nuwa-select-options rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl outline-none">
    {searchable&&<div className="nuwa-select-hint">{en?'Type to filter':'输入以筛选'}</div>}
    {!filtered.length&&<div className="nuwa-select-empty">{en?'No matching options':'没有匹配项'}</div>}
    {filtered.map((choice,index)=><div key={choice.value}>
     {choice.group&&choice.group!==filtered[index-1]?.group&&<div className="nuwa-select-group">{choice.group}</div>}
     <ComboboxOption value={choice.value} disabled={choice.disabled} className="nuwa-select-option group flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left data-focus:bg-emerald-50 data-disabled:cursor-default data-disabled:opacity-45">
      {choice.mark&&<img src={choice.mark} alt="" width="18" height="18" className="shrink-0 object-contain"/>}
      <span className="min-w-0 flex-1">{choice.label}</span><svg className="nuwa-select-check shrink-0 opacity-0 group-data-selected:opacity-100" width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
     </ComboboxOption>
    </div>)}
   </ComboboxOptions>
  </>}
 </Combobox>;
}
