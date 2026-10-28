import fs from 'node:fs';
import {monitorBindingHash} from '../src/lib/nuwa-intelligence/monitoringIntegrity.mjs';
import {validateCatalogue} from '../src/lib/nuwaIndex.mjs';
const target=new URL('../src/data/nuwa-index/catalogue.json',import.meta.url),data=JSON.parse(fs.readFileSync(target));
if(data.snapshotId!=='2026-10-27.2')throw Error('Attribution correction requires retained snapshot 2026-10-27.2');
const oldResults=JSON.stringify(data.results);
if(!data.organizations.some(o=>o.id==='generality'))data.organizations.push({id:'generality',name:{en:'Generality Labs',zh:'Generality Labs'},aliases:['Generality'],homepage:'https://generality.org/',type:'research-institute'});
const corrections=[
 {workId:'metr-frontier-risk-report',organizationId:'metr',authors:[],locator:'Executive summary and guide to the report; Pilot process',reason:{en:'The article is METR’s entity-based assessment. A cited opaque-serial-depth paper does not establish its authorship or evaluator affiliation.',zh:'此文为 METR 的机构层面评估，被引用的不透明串行深度论文不能确定本文作者与评测机构。'}},
 {workId:'fortress-audit',organizationId:'generality',authors:['Laurence Wroe'],locator:'Article byline, 18 September 2026; What is FORTRESS?; audit methodology',reason:{en:'The Generality Labs audit is distinct from Scale AI’s original FORTRESS benchmark paper.',zh:'Generality Labs 的审计文章与 Scale AI 的原始 FORTRESS 基准论文是不同作品。'}},
 {workId:'palisade-robot-shutdown',organizationId:'palisade',authors:['Artem Petrov','Sergey Koldyba','Sergey Molchanov','Nikolaj Kotov','Dmitrii Volkov','Oleg Serikov'],locator:'Authors; Technical Report (PDF), title page',reason:{en:'Robot-study authors come from the robot report masthead, rather than the earlier linked shutdown-resistance paper.',zh:'机器人研究的作者以该报告署名为准，不继承此前被引用的关闭抵抗论文作者。'}}
];
for(const correction of corrections){
 const work=data.works.find(w=>w.id===correction.workId),before={authors:work.authors,attributionSourceId:work.attributionSourceId,contributions:work.contributions};
 work.authors=correction.authors;work.attributionSourceId=work.sourceId;work.updatedOn='2026-10-27';
 work.contributions=[{organizationId:correction.organizationId,role:'research',sourceId:work.sourceId,locator:correction.locator},{organizationId:correction.organizationId,role:'publisher',sourceId:work.sourceId,locator:correction.locator}];
 if(correction.workId==='metr-frontier-risk-report')work.contributions[0].role='evaluation';
 const source=data.sources.find(s=>s.id===work.sourceId);source.authors=correction.authors;source.verifiedOn='2026-10-27';
 if(correction.workId==='palisade-robot-shutdown'){const pdf=data.sources.find(s=>s.id==='palisade-robot-technical-report');if(pdf)pdf.authors=correction.authors;}
 data.publicationIdentityCorrections??=[];data.publicationIdentityCorrections.push({id:`identity-${correction.workId}-2026-10-27`,workId:work.id,sourceId:work.sourceId,sourceUrl:work.originalUrl,locator:correction.locator,verifiedOn:'2026-10-27',kind:'source-metadata-correction',reason:correction.reason,previous:before});
}
data.snapshotId='2026-10-27.3';data.verifiedOn='2026-10-27';
data.coverage={en:`This snapshot indexes ${data.works.length} research works across three research functions. Coverage, source reading, numerical extraction and editorial approval are recorded separately.`,zh:`本快照收录 ${data.works.length} 项研究，按三类研究功能组织。目录覆盖、来源阅读、数值提取和编辑批准分别记录。`};
for(const group of data.monitoring.groups)group.review.dependencyHash=monitorBindingHash(data,group);
if(JSON.stringify(data.results)!==oldResults)throw Error('Attribution corrections must preserve result measurements');
const errors=validateCatalogue(data);if(errors.length)throw Error(errors.join('\n'));
const snapshot=new URL(`../src/data/nuwa-index/snapshots/${data.snapshotId}.json`,import.meta.url);if(fs.existsSync(snapshot))throw Error('Refusing to overwrite a retained snapshot');
const json=JSON.stringify(data,null,2)+'\n';fs.writeFileSync(snapshot,json);fs.writeFileSync(target,json);console.log(`Corrected 3 publication identities; preserved ${data.results.length} results; snapshot ${data.snapshotId}`);
