/* eslint-disable */
// @ts-nocheck
'use client'
import { useState, useRef, useEffect } from 'react'

const C = {
  bg:'#0A0C10', surface:'#111318', border:'#1E2330',
  accent:'#00D4AA', warning:'#FFB020', danger:'#FF4D6D',
  info:'#4D9EFF', purple:'#A78BFA', text:'#E8ECF5', muted:'#6B7694',
}
const MACHINES = [
  {id:1,code:'MP-01',name:'Máquina Plana 1',       type:'Plana',         status:'active',      eff:92},
  {id:2,code:'MP-02',name:'Máquina Plana 2',       type:'Plana',         status:'active',      eff:88},
  {id:3,code:'MP-03',name:'Máquina Plana 3',       type:'Plana',         status:'maintenance', eff:0 },
  {id:4,code:'MP-04',name:'Máquina Plana 4',       type:'Plana',         status:'active',      eff:95},
  {id:5,code:'F5-01',name:'Fileteadora 5H-1',      type:'Fileteadora 5H',status:'active',      eff:90},
  {id:6,code:'F5-02',name:'Fileteadora 5H-2',      type:'Fileteadora 5H',status:'active',      eff:87},
  {id:7,code:'F4-01',name:'Fileteadora 4H',        type:'Fileteadora 4H',status:'active',      eff:91},
  {id:8,code:'RS-01',name:'Resuertadora',          type:'Resuertadora',  status:'active',      eff:85},
  {id:9,code:'CC-01',name:'Collarín Cuchilla Izq', type:'Collarín',      status:'active',      eff:89},
  {id:10,code:'OJ-01',name:'Ojaladora',            type:'Ojaladora',     status:'idle',        eff:0 },
  {id:11,code:'BT-01',name:'Botonadora',           type:'Botonadora',    status:'active',      eff:93},
  {id:12,code:'CE-01',name:'Cerradora de Codo',    type:'Cerradora',     status:'active',      eff:88},
]
const OPERATORS = [
  {id:1,code:'OP-001',name:'Ana García',  machine:'Plana',        eff:92,today:124,target:135,shift:'Mañana'},
  {id:2,code:'OP-002',name:'Luis Torres', machine:'Plana',        eff:88,today:118,target:135,shift:'Mañana'},
  {id:3,code:'OP-003',name:'Rosa Medina', machine:'Plana',        eff:95,today:128,target:135,shift:'Mañana'},
  {id:4,code:'OP-004',name:'Carlos Ruiz', machine:'Fileteadora',  eff:90,today:143,target:158,shift:'Mañana'},
  {id:5,code:'OP-005',name:'María López', machine:'Fileteadora',  eff:87,today:138,target:158,shift:'Tarde' },
  {id:6,code:'OP-006',name:'Pedro Soto',  machine:'Fileteadora4H',eff:91,today:140,target:154,shift:'Mañana'},
  {id:7,code:'OP-007',name:'Laura Vega',  machine:'Resuertadora', eff:85,today:98, target:115,shift:'Tarde' },
  {id:8,code:'OP-008',name:'Sandra Cruz', machine:'Botonadora',   eff:93,today:210,target:225,shift:'Mañana'},
]
const ORDERS = [
  {id:1,code:'OP-2024-001',ref:'Camiseta Básica',  qty:500,done:312,status:'running',  priority:'high'  },
  {id:2,code:'OP-2024-002',ref:'Pantalón Drill',   qty:200,done:87, status:'running',  priority:'medium'},
  {id:3,code:'OP-2024-003',ref:'Blusa Manga Larga',qty:350,done:350,status:'completed',priority:'low'   },
  {id:4,code:'OP-2024-004',ref:'Bermuda Sport',    qty:150,done:0,  status:'pending',  priority:'medium'},
]

function Bar(p) {
  var color = p.color||C.accent, h = p.h||6
  var w = Math.min(100, p.max>0?(p.v/p.max)*100:0)+'%'
  return React.createElement('div',{style:{background:C.border,borderRadius:99,height:h,overflow:'hidden'}},
    React.createElement('div',{style:{width:w,height:'100%',background:color,borderRadius:99,transition:'width .5s'}}))
}
function Dot(p) {
  var map = {active:{c:C.accent,l:'Activa'},maintenance:{c:C.warning,l:'Mantenimiento'},idle:{c:C.muted,l:'Inactiva'},running:{c:C.accent,l:'En Proceso'},completed:{c:C.info,l:'Completada'},pending:{c:C.muted,l:'Pendiente'}}
  var x = map[p.s]||{c:C.muted,l:p.s}
  return React.createElement('span',{style:{display:'flex',alignItems:'center',gap:6}},
    React.createElement('span',{style:{width:8,height:8,borderRadius:'50%',background:x.c,boxShadow:'0 0 8px '+x.c,display:'inline-block'}}),
    React.createElement('span',{style:{color:x.c,fontSize:12,fontWeight:600}},x.l))
}
function Chip(p) {
  var color = p.color||C.accent
  return React.createElement('span',{style:{background:color+'22',color:color,border:'1px solid '+color+'44',borderRadius:6,padding:'2px 8px',fontSize:10,fontWeight:700,textTransform:'uppercase'}},p.children)
}
function KPI(p) {
  var color = p.color||C.accent
  return React.createElement('div',{style:{background:C.surface,border:'1px solid '+C.border,borderRadius:16,padding:'18px 20px',position:'relative',overflow:'hidden'}},
    React.createElement('div',{style:{position:'absolute',top:0,left:0,right:0,height:3,background:color}}),
    React.createElement('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}},
      React.createElement('div',null,
        React.createElement('div',{style:{color:C.muted,fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:6}},p.label),
        React.createElement('div',{style:{display:'flex',alignItems:'baseline',gap:4}},
          React.createElement('span',{style:{color:color,fontSize:28,fontWeight:800,lineHeight:1}},p.value),
          p.unit&&React.createElement('span',{style:{color:C.muted,fontSize:12}},p.unit))),
      p.icon&&React.createElement('span',{style:{fontSize:24,opacity:0.5}},p.icon)))
}
function Btn(p) {
  var color = p.color||C.accent
  return React.createElement('button',{onClick:p.onClick,disabled:!!p.disabled,style:{background:p.outline?'transparent':color,color:p.outline?color:'#0A0C10',border:'1.5px solid '+color,borderRadius:8,cursor:p.disabled?'not-allowed':'pointer',fontWeight:700,fontSize:13,padding:'9px 20px',transition:'all .15s',opacity:p.disabled?.5:1}},p.children)
}
function Card(p) {
  return React.createElement('div',{style:Object.assign({background:C.surface,border:'1px solid '+C.border,borderRadius:16,padding:24},p.style||{})},p.children)
}

function Dashboard() {
  var active = MACHINES.filter(function(m){return m.status==='active'}).length
  var avgEff = (OPERATORS.reduce(function(s,o){return s+o.eff},0)/OPERATORS.length).toFixed(1)
  var produced = ORDERS.reduce(function(s,o){return s+o.done},0)
  return React.createElement('div',null,
    React.createElement('h2',{style:{color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px'}},'Dashboard Gerencial'),
    React.createElement('p',{style:{color:C.muted,fontSize:12,margin:'0 0 24px'}},'PROYECTEX · Planta Principal · Turno Mañana'),
    React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14,marginBottom:24}},
      React.createElement(KPI,{label:'Producción Hoy',value:produced,unit:'uds',color:C.accent,icon:'🧵'}),
      React.createElement(KPI,{label:'Eficiencia Global',value:avgEff,unit:'%',color:C.info,icon:'⚡'}),
      React.createElement(KPI,{label:'Máquinas Activas',value:active+'/12',color:C.warning,icon:'⚙️'}),
      React.createElement(KPI,{label:'Órdenes Activas',value:ORDERS.filter(function(o){return o.status==='running'}).length,color:C.danger,icon:'📋'})),
    React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}},
      React.createElement(Card,null,
        React.createElement('div',{style:{color:C.text,fontWeight:800,marginBottom:16}},'Utilización de Máquinas'),
        MACHINES.filter(function(m){return m.status==='active'}).map(function(m){
          return React.createElement('div',{key:m.id,style:{marginBottom:12}},
            React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:4}},
              React.createElement('span',{style:{color:C.text,fontSize:12}},m.name),
              React.createElement('span',{style:{color:m.eff>=90?C.accent:C.warning,fontSize:12,fontWeight:700}},m.eff+'%')),
            React.createElement(Bar,{v:m.eff,max:100,color:m.eff>=90?C.accent:C.warning}))})),
      React.createElement(Card,null,
        React.createElement('div',{style:{color:C.text,fontWeight:800,marginBottom:16}},'Órdenes de Producción'),
        ORDERS.map(function(o){
          var pct = Math.round((o.done/o.qty)*100)
          return React.createElement('div',{key:o.id,style:{marginBottom:16,paddingBottom:16,borderBottom:'1px solid '+C.border}},
            React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:4}},
              React.createElement('span',{style:{color:C.muted,fontSize:11}},o.code),
              React.createElement(Dot,{s:o.status})),
            React.createElement('div',{style:{color:C.text,fontSize:13,fontWeight:700,marginBottom:6}},o.ref),
            React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:4}},
              React.createElement('span',{style:{color:C.muted,fontSize:11}},o.done+' / '+o.qty+' uds'),
              React.createElement('span',{style:{color:C.accent,fontSize:11,fontWeight:700}},pct+'%')),
            React.createElement(Bar,{v:o.done,max:o.qty,color:o.status==='completed'?C.info:C.accent}))}))))
}

function Machines() {
  var tc = {'Plana':C.info,'Fileteadora 5H':C.accent,'Fileteadora 4H':C.accent,'Resuertadora':C.purple,'Collarín':C.warning,'Ojaladora':C.danger,'Botonadora':C.warning,'Cerradora':C.purple}
  return React.createElement('div',null,
    React.createElement('h2',{style:{color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px'}},'Módulo de Máquinas'),
    React.createElement('p',{style:{color:C.muted,fontSize:12,margin:'0 0 24px'}},'12 máquinas de PROYECTEX'),
    React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14}},
      MACHINES.map(function(m){
        return React.createElement(Card,{key:m.id,style:{border:'1px solid '+(m.status!=='active'?C.warning+'44':C.border)}},
          React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:10}},
            React.createElement('div',null,
              React.createElement('div',{style:{color:C.muted,fontSize:10,fontFamily:'monospace',marginBottom:3}},m.code),
              React.createElement('div',{style:{color:C.text,fontSize:14,fontWeight:800}},m.name)),
            React.createElement(Chip,{color:tc[m.type]||C.accent},m.type)),
          React.createElement(Dot,{s:m.status}),
          React.createElement('div',{style:{marginTop:12}},
            React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:4}},
              React.createElement('span',{style:{color:C.muted,fontSize:11}},'Eficiencia'),
              React.createElement('span',{style:{color:m.eff>=90?C.accent:C.warning,fontSize:12,fontWeight:700}},m.eff+'%')),
            React.createElement(Bar,{v:m.eff,max:100,color:m.eff>=90?C.accent:C.warning})))})))
}

function Operators() {
  return React.createElement('div',null,
    React.createElement('h2',{style:{color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px'}},'Módulo de Operarios'),
    React.createElement('p',{style:{color:C.muted,fontSize:12,margin:'0 0 24px'}},OPERATORS.length+' operarios registrados'),
    React.createElement(Card,{style:{padding:0,overflow:'hidden'}},
      React.createElement('table',{style:{width:'100%',borderCollapse:'collapse',fontSize:13}},
        React.createElement('thead',null,
          React.createElement('tr',{style:{borderBottom:'1px solid '+C.border}},
            ['Código','Nombre','Máquina','Hoy/Meta','Eficiencia','Turno'].map(function(h){
              return React.createElement('th',{key:h,style:{padding:'10px 16px',textAlign:'left',color:C.muted,fontSize:10,fontWeight:700,textTransform:'uppercase'}},h)}))),
        React.createElement('tbody',null,
          OPERATORS.map(function(op){
            return React.createElement('tr',{key:op.id,style:{borderBottom:'1px solid '+C.border}},
              React.createElement('td',{style:{padding:'12px 16px',color:C.muted,fontFamily:'monospace',fontSize:11}},op.code),
              React.createElement('td',{style:{padding:'12px 16px',color:C.text,fontWeight:700}},op.name),
              React.createElement('td',{style:{padding:'12px 16px'}},React.createElement(Chip,{color:C.info},op.machine)),
              React.createElement('td',{style:{padding:'12px 16px',minWidth:140}},
                React.createElement('div',{style:{color:C.text,fontSize:12,marginBottom:4}},op.today+' / '+op.target+' uds'),
                React.createElement(Bar,{v:op.today,max:op.target,color:op.eff>=90?C.accent:C.warning,h:4})),
              React.createElement('td',{style:{padding:'12px 16px',textAlign:'center'}},
                React.createElement('span',{style:{color:op.eff>=90?C.accent:op.eff>=80?C.warning:C.danger,fontWeight:800,fontSize:16}},op.eff+'%')),
              React.createElement('td',{style:{padding:'12px 16px'}},React.createElement(Chip,{color:op.shift==='Mañana'?C.info:C.purple},op.shift)))}))))
}

function Timing() {
  var r=useState(false),e=useState(0),cy=useState([]),ra=useState(100),su=useState(14),sa=useState(false)
  var running=r[0],setRunning=r[1],elapsed=e[0],setElapsed=e[1],cycles=cy[0],setCycles=cy[1]
  var rating=ra[0],setRating=ra[1],supp=su[0],setSupp=su[1],saved=sa[0],setSaved=sa[1]
  var iv=useRef(null),t0=useRef(0)
  var start=function(){setRunning(true);setSaved(false);t0.current=Date.now()-elapsed*10;iv.current=setInterval(function(){setElapsed(Math.floor((Date.now()-t0.current)/10))},50)}
  var lap=function(){setCycles(function(p){return p.concat([elapsed/100])});setElapsed(0);t0.current=Date.now()}
  var stop=function(){clearInterval(iv.current);setRunning(false)}
  var reset=function(){clearInterval(iv.current);setRunning(false);setElapsed(0);setCycles([]);setSaved(false)}
  useEffect(function(){return function(){clearInterval(iv.current)}},[])
  var s=Math.floor(elapsed/100),c=elapsed%100
  var avg=cycles.length>0?cycles.reduce(function(a,b){return a+b},0)/cycles.length:0
  var tn=avg*(rating/100),ts=tn*(1+supp/100),sam=ts/60,cap=sam>0?Math.floor(450/sam):0
  var fmt=function(n){return String(n).padStart(2,'0')}
  return React.createElement('div',null,
    React.createElement('h2',{style:{color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px'}},'Toma de Tiempos'),
    React.createElement('p',{style:{color:C.muted,fontSize:12,margin:'0 0 24px'}},'Cronómetro industrial · Captura de ciclos · Cálculo automático'),
    React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}},
      React.createElement(Card,null,
        React.createElement('div',{style:{textAlign:'center'}},
          React.createElement('div',{style:{background:C.bg,borderRadius:14,padding:'20px 24px',marginBottom:24,border:'2px solid '+(running?C.accent:C.border),boxShadow:running?'0 0 24px '+C.accent+'33':'none',transition:'all .3s'}},
            React.createElement('div',{style:{fontFamily:'monospace',fontSize:48,fontWeight:900,color:running?C.accent:C.text,lineHeight:1}},
              fmt(Math.floor(s/60))+':'+fmt(s%60),
              React.createElement('span',{style:{fontSize:24,color:C.muted}},'.'+fmt(c))),
            React.createElement('div',{style:{color:C.muted,fontSize:12,marginTop:8}},'Ciclos: ',React.createElement('strong',{style:{color:C.text}},cycles.length))),
          React.createElement('div',{style:{display:'flex',gap:10,justifyContent:'center',marginBottom:20}},
            !running?React.createElement(Btn,{onClick:start},'▶ Iniciar'):
              React.createElement('span',{style:{display:'flex',gap:10}},
                React.createElement(Btn,{onClick:lap},'✓ Ciclo'),
                React.createElement(Btn,{onClick:stop,color:C.warning},'⏸ Pausa')),
            React.createElement(Btn,{onClick:reset,outline:true,color:C.danger},'↺')),
          React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,textAlign:'left'}},
            React.createElement('div',null,
              React.createElement('div',{style:{color:C.muted,fontSize:10,fontWeight:700,marginBottom:4}},'CALIFICACIÓN: '+rating+'%'),
              React.createElement('input',{type:'range',min:50,max:150,value:rating,onChange:function(e){setRating(Number(e.target.value))},style:{width:'100%',accentColor:C.accent}})),
            React.createElement('div',null,
              React.createElement('div',{style:{color:C.muted,fontSize:10,fontWeight:700,marginBottom:4}},'SUPLEMENTO: '+supp+'%'),
              React.createElement('input',{type:'range',min:5,max:30,value:supp,onChange:function(e){setSupp(Number(e.target.value))},style:{width:'100%',accentColor:C.warning}}))))),
      React.createElement('div',{style:{display:'flex',flexDirection:'column',gap:14}},
        React.createElement(Card,null,
          React.createElement('div',{style:{color:C.text,fontWeight:800,marginBottom:12}},'Ciclos ('+cycles.length+')'),
          cycles.length===0?
            React.createElement('div',{style:{color:C.muted,fontSize:13,textAlign:'center',padding:'16px 0'}},'Inicia y presiona ✓ Ciclo en cada repetición'):
            React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:6}},
              cycles.map(function(c,i){return React.createElement('div',{key:i,style:{background:C.bg,borderRadius:8,padding:'6px',textAlign:'center'}},
                React.createElement('div',{style:{color:C.muted,fontSize:9}},'C'+(i+1)),
                React.createElement('div',{style:{color:C.accent,fontSize:13,fontWeight:800,fontFamily:'monospace'}},c.toFixed(2)+'s'))}))),
        React.createElement(Card,{style:{flex:1}},
          React.createElement('div',{style:{color:C.text,fontWeight:800,marginBottom:14}},'Resultados'),
          [{l:'Tiempo Observado',v:avg.toFixed(3),u:'seg',col:C.text},{l:'Tiempo Normal',v:tn.toFixed(3),u:'seg',col:C.info},{l:'Tiempo Estándar',v:ts.toFixed(3),u:'seg',col:C.accent},{l:'SAM',v:sam.toFixed(4),u:'min',col:C.purple},{l:'Capacidad/turno',v:cap>0?String(cap):'—',u:'uds',col:C.warning}].map(function(row){
            return React.createElement('div',{key:row.l,style:{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid '+C.border}},
              React.createElement('span',{style:{color:C.muted,fontSize:11}},row.l),
              React.createElement('span',{style:{color:row.col,fontWeight:800,fontFamily:'monospace'}},row.v,' ',React.createElement('span',{style:{color:C.muted,fontSize:10}},row.u)))}),
          cycles.length>=3&&React.createElement('div',{style:{marginTop:14}},
            React.createElement(Btn,{onClick:function(){setSaved(true)},disabled:saved,style:{width:'100%'}},saved?'✓ Guardado':'💾 Guardar Estudio'))))))
}

function Production() {
  var pc={high:C.danger,medium:C.warning,low:C.info}
  return React.createElement('div',null,
    React.createElement('h2',{style:{color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px'}},'Órdenes de Producción'),
    React.createElement('p',{style:{color:C.muted,fontSize:12,margin:'0 0 24px'}},'Seguimiento en tiempo real'),
    React.createElement('div',{style:{display:'grid',gap:14}},
      ORDERS.map(function(o){
        var pct=Math.round((o.done/o.qty)*100)
        return React.createElement(Card,{key:o.id,style:{borderLeft:'4px solid '+pc[o.priority]}},
          React.createElement('div',{style:{display:'grid',gridTemplateColumns:'1fr auto auto auto auto',gap:20,alignItems:'center'}},
            React.createElement('div',null,
              React.createElement('div',{style:{display:'flex',gap:8,alignItems:'center',marginBottom:6}},
                React.createElement('span',{style:{color:C.muted,fontSize:11,fontFamily:'monospace'}},o.code),
                React.createElement(Chip,{color:pc[o.priority]},o.priority),
                React.createElement(Dot,{s:o.status})),
              React.createElement('div',{style:{color:C.text,fontSize:16,fontWeight:800}},o.ref)),
            React.createElement('div',{style:{textAlign:'center'}},React.createElement('div',{style:{color:C.muted,fontSize:9}},'PRODUCIDAS'),React.createElement('div',{style:{color:C.accent,fontSize:22,fontWeight:900}},o.done)),
            React.createElement('div',{style:{textAlign:'center'}},React.createElement('div',{style:{color:C.muted,fontSize:9}},'META'),React.createElement('div',{style:{color:C.text,fontSize:22,fontWeight:900}},o.qty)),
            React.createElement('div',{style:{textAlign:'center'}},React.createElement('div',{style:{color:C.muted,fontSize:9}},'PENDIENTE'),React.createElement('div',{style:{color:C.warning,fontSize:22,fontWeight:900}},o.qty-o.done)),
            React.createElement('div',{style:{textAlign:'center'}},React.createElement('div',{style:{color:C.muted,fontSize:9}},'AVANCE'),React.createElement('div',{style:{color:pct===100?C.info:C.accent,fontSize:22,fontWeight:900}},pct+'%'))),
          React.createElement('div',{style:{marginTop:14}},React.createElement(Bar,{v:o.done,max:o.qty,color:o.status==='completed'?C.info:C.accent,h:8})))})))
}

function Reports() {
  var avgEff=(OPERATORS.reduce(function(s,o){return s+o.eff},0)/OPERATORS.length).toFixed(1)
  return React.createElement('div',null,
    React.createElement('h2',{style:{color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px'}},'Reportes'),
    React.createElement('p',{style:{color:C.muted,fontSize:12,margin:'0 0 24px'}},'Análisis de producción y eficiencia — PROYECTEX'),
    React.createElement('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14,marginBottom:20}},
      React.createElement(KPI,{label:'Total Producido',value:ORDERS.reduce(function(s,o){return s+o.done},0),unit:'uds',color:C.accent,icon:'🧵'}),
      React.createElement(KPI,{label:'Eficiencia Prom.',value:avgEff,unit:'%',color:C.info,icon:'⚡'}),
      React.createElement(KPI,{label:'Completadas',value:ORDERS.filter(function(o){return o.status==='completed'}).length,color:C.purple,icon:'✅'}),
      React.createElement(KPI,{label:'En Proceso',value:ORDERS.filter(function(o){return o.status==='running'}).length,color:C.warning,icon:'🔄'})),
    React.createElement(Card,null,
      React.createElement('div',{style:{color:C.text,fontWeight:800,marginBottom:16}},'Eficiencia por Operario'),
      OPERATORS.map(function(op){
        return React.createElement('div',{key:op.id,style:{marginBottom:14}},
          React.createElement('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:4}},
            React.createElement('span',{style:{color:C.text,fontSize:13,fontWeight:600}},op.name),
            React.createElement('span',{style:{color:op.eff>=90?C.accent:op.eff>=80?C.warning:C.danger,fontWeight:800}},op.eff+'%')),
          React.createElement(Bar,{v:op.eff,max:100,color:op.eff>=90?C.accent:op.eff>=80?C.warning:C.danger}),
          React.createElement('div',{style:{color:C.muted,fontSize:10,marginTop:2}},op.today+' uds hoy · Meta: '+op.target+' · '+op.machine))})))
}

var MODS=[
  {id:'dashboard',label:'Dashboard',      icon:'📊',comp:Dashboard },
  {id:'machines', label:'Máquinas',       icon:'⚙️',comp:Machines  },
  {id:'operators',label:'Operarios',      icon:'👷',comp:Operators },
  {id:'timing',   label:'Toma de Tiempos',icon:'⏱',comp:Timing    },
  {id:'production',label:'Producción',   icon:'🏭',comp:Production},
  {id:'reports',  label:'Reportes',       icon:'📋',comp:Reports   },
]

export default function App() {
  var a=useState('dashboard'),o=useState(true)
  var activeId=a[0],setActive=a[1],isOpen=o[0],setOpen=o[1]
  var mod=MODS.find(function(m){return m.id===activeId})
  var Mod=mod?mod.comp:Dashboard
  return React.createElement('div',{style:{display:'flex',height:'100vh',overflow:'hidden',background:C.bg}},
    React.createElement('div',{style:{width:isOpen?220:60,background:C.surface,borderRight:'1px solid '+C.border,display:'flex',flexDirection:'column',transition:'width .3s',overflow:'hidden',flexShrink:0}},
      React.createElement('div',{style:{padding:'18px 14px',borderBottom:'1px solid '+C.border,display:'flex',alignItems:'center',gap:10}},
        React.createElement('div',{style:{width:34,height:34,background:'linear-gradient(135deg,#00D4AA,#0099AA)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0}},'🧵'),
        isOpen&&React.createElement('div',null,
          React.createElement('div',{style:{color:C.text,fontWeight:900,fontSize:14}},'PROYECTEX'),
          React.createElement('div',{style:{color:C.muted,fontSize:9,letterSpacing:'0.08em'}},'SISTEMA MES'))),
      React.createElement('nav',{style:{flex:1,padding:'10px 6px',overflowY:'auto'}},
        MODS.map(function(m){
          var on=activeId===m.id
          return React.createElement('button',{key:m.id,onClick:function(){setActive(m.id)},style:{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 10px',background:on?C.accent+'22':'transparent',border:'1px solid '+(on?C.accent+'33':'transparent'),borderRadius:9,cursor:'pointer',marginBottom:2,color:on?C.accent:C.muted,textAlign:'left'}},
            React.createElement('span',{style:{fontSize:17,flexShrink:0}},m.icon),
            isOpen&&React.createElement('span',{style:{fontSize:12,fontWeight:on?700:500,whiteSpace:'nowrap'}},m.label))})),
      React.createElement('div',{style:{padding:'10px 14px',borderTop:'1px solid '+C.border}},
        React.createElement('button',{onClick:function(){setOpen(!isOpen)},style:{background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:16}},isOpen?'◀':'▶'))),
    React.createElement('div',{style:{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}},
      React.createElement('div',{style:{background:C.surface,borderBottom:'1px solid '+C.border,padding:'12px 24px',display:'flex',justifyContent:'space-between',alignItems:'center'}},
        React.createElement('span',{style:{color:C.muted,fontSize:12}},'PROYECTEX · ',React.createElement('span',{style:{color:C.accent,fontWeight:700}},mod?mod.label:'')),
        React.createElement('div',{style:{display:'flex',alignItems:'center',gap:8}},
          React.createElement('div',{style:{width:7,height:7,borderRadius:'50%',background:C.accent,boxShadow:'0 0 8px '+C.accent}}),
          React.createElement('span',{style:{color:C.muted,fontSize:11}},'En Línea · Turno Mañana'))),
      React.createElement('div',{style:{flex:1,overflowY:'auto',padding:24}},
        React.createElement(Mod,null))))
}

