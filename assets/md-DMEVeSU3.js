import{aI as i,o as s,c as l,k as u,e as t,g as d,ag as g,b as m,q as c,s as p,B as r}from"./modules/vue-Dyu_1XSi.js";import{I as v}from"./slidev/default-Dou6AXnQ.js";import{u as k,f}from"./slidev/context-BodOU6x1.js";import"./index-CUl7B1pf.js";import"./modules/shiki-JHeX96R8.js";const h="/k8s-api/assets/k8s-aa-3iyu6kV1.svg",T={__name:"slide1.md__slidev_12",setup(_){const{$slidev:A,$nav:I,$clicksContext:a,$clicks:P,$page:x,$renderContext:y,$frontmatter:o}=k();return a.setup(),(b,e)=>{const n=i("click");return s(),l(v,c(p(r(f)(r(o),11))),{default:u(()=>[e[1]||(e[1]=t("h1",null,"API Aggregation",-1)),d(` 
  This diagram illustrates how API Aggregation works, showing the main API server proxying requests to a custom API server. 
  1. A request to \`/apis/mygroup\`.
  2. The kube-aggregator, embedded in the kube-apiserver, forwards the request.
  3. The extension API server, registered for \`/apis/mygroup/*\` and typically running as a pod, handles the request.
  4. The extension API server manages etcd storage if needed.
`),g((s(),m("div",null,e[0]||(e[0]=[t("br",null,null,-1),t("br",null,null,-1),t("img",{src:h,alt:"Kubernetes API Aggregation",style:{width:"100%"}},null,-1)]))),[[n]])]),_:1},16)}}};export{T as default};
