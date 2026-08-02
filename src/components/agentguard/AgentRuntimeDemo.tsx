import { motion, useReducedMotion } from "framer-motion";
import type { AgentGuardCopy } from "../../i18n/pages/agentguard";

export default function AgentRuntimeDemo({copy}:{copy:AgentGuardCopy["runtime"]}){
 const reduce=useReducedMotion();
 return <div className="ag-runtime-demo" role="img" aria-label={`${copy.alert}. ${copy.resolution}`}>
  <div className="ag-runtime-demo__events">{copy.events.map((event,index)=><div key={event.name} className={index===2?"is-active":""}><span>0{index+1}</span><strong>{event.name}</strong><small>{event.detail}</small></div>)}</div>
  <div className="ag-runtime-demo__track" aria-hidden="true"><motion.i initial={{scaleX:reduce?1:0}} whileInView={{scaleX:1}} viewport={{once:true}} transition={{duration:1.5,ease:"easeOut"}} /></div>
  <motion.div className="ag-runtime-demo__alert" initial={reduce?false:{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:.4}}><span>RISK</span><p>{copy.alert}</p></motion.div>
  <motion.div className="ag-runtime-demo__resolution" initial={reduce?false:{opacity:0,scale:.92}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:.8,duration:.18}}><span>AGENTGUARD</span><strong>{copy.resolution}</strong></motion.div>
  <div className="ag-runtime-demo__decisions">{copy.decisions.map((decision,index)=><span key={decision} className={index===3||index===4?"is-used":""}>{decision}</span>)}</div>
 </div>
}
