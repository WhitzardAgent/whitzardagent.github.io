/** Count CSV records, including exports with quoted multiline display labels. */
export function csvRecordCount(csv){
 let quoted=false,records=csv.trimEnd()?1:0;
 const value=csv.trimEnd();
 for(let i=0;i<value.length;i++){
  if(value[i]==='"'){
   if(quoted&&value[i+1]==='"'){i++;continue;}
   quoted=!quoted;
  }else if(value[i]==='\n'&&!quoted)records++;
 }
 return records;
}
