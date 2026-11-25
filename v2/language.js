/* Translate presentation only. Story IDs, events, and saved progress are language independent. */
function createTranslator(messages={}){
 const exact=new Map(), patterns=[];
 const normalized=text=>text.trim().replace(/\s+/g,' ');
 for(const [source,target] of Object.entries(messages)){
  if(!source.includes('{{')){
   exact.set(normalized(source),target);
   continue;
  }
  const pieces=source.split(/\{\{(\d+)\}\}/);
  const slots=pieces.filter((_,index)=>index%2===1);
  const expression=pieces.map((part,index)=>index%2?'(.+?)':part.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('');
  patterns.push([new RegExp('^'+expression+'$'),slots,target,pieces.filter((_,index)=>index%2===0).join('').length]);
 }
 patterns.sort((a,b)=>b[3]-a[3]);
 function tr(value){
  const source=normalized(String(value??''));
  if(exact.has(source))return exact.get(source);
  for(const [expression,slots,target] of patterns){
   const match=expression.exec(source);
   if(match)return target.replace(/\{\{(\d+)\}\}/g,(_,slot)=>tr(match[slots.indexOf(slot)+1]));
  }
  if(source.includes(' · '))return source.split(' · ').map(tr).join(' · ');
  if(source.includes(' › '))return source.split(' › ').map(tr).join(' › ');
  if(source.includes(' → '))return source.split(' → ').map(tr).join(' → ');
  if(source.endsWith('.')&&exact.has(source.slice(0,-1)))return exact.get(source.slice(0,-1))+'.';
  return value;
 }
 function localize(root){
  const walker=root.ownerDocument.createTreeWalker(root,4);
  while(walker.nextNode()){
   const node=walker.currentNode;
   if(!node.nodeValue.trim()||node.parentElement?.closest('script,style,code,pre,[translate=no]'))continue;
   node.nodeValue=node.nodeValue.replace(/\S(?:[\s\S]*\S)?/,part=>tr(part));
  }
  const attributes=['aria-label','title','placeholder','alt'];
  for(const element of [root,...root.querySelectorAll(attributes.map(attribute=>'['+attribute+']').join(','))]){
   for(const attribute of attributes){
    if(element.hasAttribute(attribute))element.setAttribute(attribute,tr(element.getAttribute(attribute)));
   }
  }
 }
 return {tr,localize};
}
if(typeof module!=='undefined')module.exports=createTranslator;
