import { motion,useReducedMotion } from "framer-motion";
import type { AgentGuardCopy } from "../../i18n/pages/agentguard";
export default function DeploymentArchitecture({nodes}:{nodes:AgentGuardCopy["deployment"]["nodes"]}){
 const reduce=useReducedMotion();
 return <div className="ag-deployment" aria-label={nodes.join(" to ")}>
  {nodes.map((node,index)=><div key={node} className={index===2?"is-runtime":index===4?"is-control":""}><motion.span initial={reduce?false:{opacity:0,scale:.8}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:index*.12}}>{index===2?"AG":`0${index+1}`}</motion.span><strong>{node}</strong>{index<nodes.length-1&&<i aria-hidden="true">→</i>}</div>)}
 </div>
}
