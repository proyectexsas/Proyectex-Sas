/* eslint-disable */
// @ts-nocheck
'use client'
import { useState, useRef, useEffect } from 'react'

const C = {
  bg: '#0A0C10', surface: '#111318', border: '#1E2330',
  accent: '#00D4AA', warning: '#FFB020', danger: '#FF4D6D',
  info: '#4D9EFF', purple: '#A78BFA', text: '#E8ECF5', muted: '#6B7694',
}

const MACHINES = [
  { id:1, code:'MP-01', name:'Máquina Plana 1',        type:'Plana',          status:'active',      eff:92 },
  { id:2, code:'MP-02', name:'Máquina Plana 2',        type:'Plana',          status:'active',      eff:88 },
  { id:3, code:'MP-03', name:'Máquina Plana 3',        type:'Plana',          status:'maintenance', eff:0  },
  { id:4, code:'MP-04', name:'Máquina Plana 4',        type:'Plana',          status:'active',      eff:95 },
  { id:5, code:'F5-01', name:'Fileteadora 5H - 1',    type:'Fileteadora 5H', status:'active',      eff:90 },
  { id:6, code:'F5-02', name:'Fileteadora 5H - 2',    type:'Fileteadora 5H', status:'active',      eff:87 },
  { id:7, code:'F4-01', name:'Fileteadora 4H',         type:'Fileteadora 4H', status:'active',      eff:91 },
  { id:8, code:'RS-01', name:'Resuertadora',           type:'Resuertadora',   status:'active',      eff:85 },
  { id:9, code:'CC-01', name:'Collarín Cuchilla Izq',  type:'Collarín',       status:'active',      eff:89 },
  { id:10,code:'OJ-01', name:'Ojaladora',              type:'Ojaladora',      status:'idle',        eff:0  },
  { id:11,code:'BT-01', name:'Botonadora',             type:'Botonadora',     status:'active',      eff:93 },
  { id:12,code:'CE-01', name:'Cerradora de Codo',      type:'Cerradora',      status:'active',      eff:88 },
]
const OPERATORS = [
  { id:1, code:'OP-001', name:'Ana García',    machine:'Plana',          eff:92, today:124, target:135, shift:'Mañana' },
  { id:2, code:'OP-002', name:'Luis Torres',   machine:'Plana',          eff:88, today:118, target:135, shift:'Mañana' },
  { id:3, code:'OP-003', name:'Rosa Medina',   machine:'Plana',          eff:95, today:128, target:135, shift:'Mañana' },
  { id:4, code:'OP-004', name:'Carlos Ruiz',   machine:'Fileteadora',    eff:90, today:143, target:158, shift:'Mañana' },
  { id:5, code:'OP-005', name:'María López',   machine:'Fileteadora',    eff:87, today:138, target:158, shift:'Tarde'  },
  { id:6, code:'OP-006', name:'Pedro Soto',    machine:'Fileteadora 4H', eff:91, today:140, target:154, shift:'Mañana' },
  { id:7, code:'OP-007', name:'Laura Vega',    machine:'Resuertadora',   eff:85, today:98,  target:115, shift:'Tarde'  },
  { id:8, code:'OP-008', name:'Sandra Cruz',   machine:'Botonadora',     eff:93, today:210, target:225, shift:'Mañana' },
]
const ORDERS = [
  { id:1, code:'OP-2024-001', ref:'Camiseta Básica',   qty:500, done:312, status:'running',   priority:'high'   },
  { id:2, code:'OP-2024-002', ref:'Pantalón Drill',    qty:200, done:87,  status:'running',   priority:'medium' },
  { id:3, code:'OP-2024-003', ref:'Blusa Manga Larga', qty:350, done:350, status:'completed', priority:'low'    },
  { id:4, code:'OP-2024-004', ref:'Bermuda Sport',     qty:150, done:0,   status:'pending',   priority:'medium' },
]

function Bar({ v, max, color, h }) {
  color = color || C.accent
  h = h || 6
  return (
    <div style={{ background:C.border, borderRadius:99, height:h, overflow:'hidden' }}>
      <div style={{ width:(Math.min(100,max>0?(v/max)*100:0))+'%', height:'100%', background:color, borderRadius:99, transition:'width .5s' }} />
    </div>
  )
}

function Dot({ s }) {
  const map = { active:{c:C.accent,l:'Activa'}, maintenance:{c:C.warning,l:'Mantenimiento'}, idle:{c:C.muted,l:'Inactiva'}, running:{c:C.accent,l:'En Proceso'}, completed:{c:C.info,l:'Completada'}, pending:{c:C.muted,l:'Pendiente'} }
  const x = map[s] || { c:C.muted, l:s }
  return (
    <span style={{ display:'flex', alignItems:'center', gap:6 }}>
      <span style={{ width:8,height:8,borderRadius:'50%',background:x.c,boxShadow:'0 0 8px '+x.c,display:'inline-block' }} />
      <span style={{ color:x.c,fontSize:12,fontWeight:600 }}>{x.l}</span>
    </span>
  )
}

function Chip({ children, color }) {
  color = color || C.accent
  return <span style={{ background:color+'22',color:color,border:'1px solid '+color+'44',borderRadius:6,padding:'2px 8px',fontSize:10,fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase' }}>{children}</span>
}

function KPI({ label, value, unit, color, icon }) {
  color = color || C.accent
  return (
    <div style={{ background:C.surface,border:'1px solid '+C.border,borderRadius:16,padding:'18px 20px',position:'relative',overflow:'hidden' }}>
      <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:color }} />
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
        <div>
          <div style={{ color:C.muted,fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:6 }}>{label}</div>
          <div style={{ display:'flex',alignItems:'baseline',gap:4 }}>
            <span style={{ color:color,fontSize:28,fontWeight:800,lineHeight:1 }}>{value}</span>
            {unit && <span style={{ color:C.muted,fontSize:12 }}>{unit}</span>}
          </div>
        </div>
        {icon && <span style={{ fontSize:24,opacity:0.5 }}>{icon}</span>}
      </div>
    </div>
  )
}

function Btn({ children, onClick, color, outline, disabled }) {
  color = color || C.accent
  return (
    <button onClick={onClick} disabled={!!disabled} style={{
      background:outline?'transparent':color, color:outline?color:'#0A0C10',
      border:'1.5px solid '+color, borderRadius:8, cursor:disabled?'not-allowed':'pointer',
      fontWeight:700, fontSize:13, padding:'9px 20px', transition:'all .15s', opacity:disabled?.5:1
    }}>{children}</button>
  )
}

function Card({ children, style: s }) {
  return <div style={{ background:C.surface,border:'1px solid '+C.border,borderRadius:16,padding:24,...(s||{}) }}>{children}</div>
}

function Dashboard() {
  const active = MACHINES.filter(function(m){ return m.status==='active' }).length
  const avgEff = (OPERATORS.reduce(function(s,o){ return s+o.eff },0)/OPERATORS.length).toFixed(1)
  const produced = ORDERS.reduce(function(s,o){ return s+o.done },0)
  return (
    <div>
      <h2 style={{ color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px' }}>Dashboard Gerencial</h2>
      <p style={{ color:C.muted,fontSize:12,margin:'0 0 24px' }}>PROYECTEX · Planta Principal · Turno Mañana</p>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14,marginBottom:24 }}>
        <KPI label="Producción Hoy"    value={produced}       unit="uds" color={C.accent}  icon="🧵" />
        <KPI label="Eficiencia Global" value={avgEff}         unit="%"   color={C.info}    icon="⚡" />
        <KPI label="Máquinas Activas"  value={active+'/12'}              color={C.warning} icon="⚙️" />
        <KPI label="Órdenes Activas"   value={ORDERS.filter(function(o){ return o.status==='running' }).length} color={C.danger} icon="📋" />
      </div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }}>
        <Card>
          <div style={{ color:C.text,fontWeight:800,marginBottom:16 }}>Utilización de Máquinas</div>
          {MACHINES.filter(function(m){ return m.status==='active' }).map(function(m){
            return (
              <div key={m.id} style={{ marginBottom:12 }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                  <span style={{ color:C.text,fontSize:12 }}>{m.name}</span>
                  <span style={{ color:m.eff>=90?C.accent:C.warning,fontSize:12,fontWeight:700 }}>{m.eff}%</span>
                </div>
                <Bar v={m.eff} max={100} color={m.eff>=90?C.accent:C.warning} />
              </div>
            )
          })}
        </Card>
        <Card>
          <div style={{ color:C.text,fontWeight:800,marginBottom:16 }}>Órdenes de Producción</div>
          {ORDERS.map(function(o){
            var pct = Math.round((o.done/o.qty)*100)
            return (
              <div key={o.id} style={{ marginBottom:16,paddingBottom:16,borderBottom:'1px solid '+C.border }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                  <span style={{ color:C.muted,fontSize:11 }}>{o.code}</span>
                  <Dot s={o.status} />
                </div>
                <div style={{ color:C.text,fontSize:13,fontWeight:700,marginBottom:6 }}>{o.ref}</div>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                  <span style={{ color:C.muted,fontSize:11 }}>{o.done} / {o.qty} uds</span>
                  <span style={{ color:C.accent,fontSize:11,fontWeight:700 }}>{pct}%</span>
                </div>
                <Bar v={o.done} max={o.qty} color={o.status==='completed'?C.info:C.accent} />
              </div>
            )
          })}
        </Card>
      </div>
    </div>
  )
}

function Machines() {
  var typeColor = { 'Plana':C.info,'Fileteadora 5H':C.accent,'Fileteadora 4H':C.accent,'Resuertadora':C.purple,'Collarín':C.warning,'Ojaladora':C.danger,'Botonadora':C.warning,'Cerradora':C.purple }
  return (
    <div>
      <h2 style={{ color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px' }}>Módulo de Máquinas</h2>
      <p style={{ color:C.muted,fontSize:12,margin:'0 0 24px' }}>12 máquinas registradas · {MACHINES.filter(function(m){return m.status==='active'}).length} activas</p>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:14 }}>
        {MACHINES.map(function(m){
          return (
            <Card key={m.id} style={{ border:'1px solid '+(m.status!=='active'?C.warning+'44':C.border) }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:10 }}>
                <div>
                  <div style={{ color:C.muted,fontSize:10,fontFamily:'monospace',marginBottom:3 }}>{m.code}</div>
                  <div style={{ color:C.text,fontSize:14,fontWeight:800 }}>{m.name}</div>
                </div>
                <Chip color={typeColor[m.type]||C.accent}>{m.type}</Chip>
              </div>
              <Dot s={m.status} />
              <div style={{ marginTop:12 }}>
                <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                  <span style={{ color:C.muted,fontSize:11 }}>Eficiencia</span>
                  <span style={{ color:m.eff>=90?C.accent:C.warning,fontSize:12,fontWeight:700 }}>{m.eff}%</span>
                </div>
                <Bar v={m.eff} max={100} color={m.eff>=90?C.accent:C.warning} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Operators() {
  return (
    <div>
      <h2 style={{ color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px' }}>Módulo de Operarios</h2>
      <p style={{ color:C.muted,fontSize:12,margin:'0 0 24px' }}>{OPERATORS.length} operarios registrados</p>
      <Card style={{ padding:0,overflow:'hidden' }}>
        <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid '+C.border }}>
              {['Código','Nombre','Máquina','Hoy / Meta','Eficiencia','Turno'].map(function(h){
                return <th key={h} style={{ padding:'10px 16px',textAlign:'left',color:C.muted,fontSize:10,fontWeight:700,textTransform:'uppercase' }}>{h}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {OPERATORS.map(function(op){
              return (
                <tr key={op.id} style={{ borderBottom:'1px solid '+C.border }}>
                  <td style={{ padding:'12px 16px',color:C.muted,fontFamily:'monospace',fontSize:11 }}>{op.code}</td>
                  <td style={{ padding:'12px 16px',color:C.text,fontWeight:700 }}>{op.name}</td>
                  <td style={{ padding:'12px 16px' }}><Chip color={C.info}>{op.machine}</Chip></td>
                  <td style={{ padding:'12px 16px',minWidth:140 }}>
                    <div style={{ color:C.text,fontSize:12,marginBottom:4 }}>{op.today} / {op.target} uds</div>
                    <Bar v={op.today} max={op.target} color={op.eff>=90?C.accent:C.warning} h={4} />
                  </td>
                  <td style={{ padding:'12px 16px',textAlign:'center' }}>
                    <span style={{ color:op.eff>=90?C.accent:op.eff>=80?C.warning:C.danger,fontWeight:800,fontSize:16 }}>{op.eff}%</span>
                  </td>
                  <td style={{ padding:'12px 16px' }}><Chip color={op.shift==='Mañana'?C.info:C.purple}>{op.shift}</Chip></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

function Timing() {
  var running = useState(false)
  var elapsed = useState(0)
  var cycles = useState([])
  var rating = useState(100)
  var supp = useState(14)
  var saved = useState(false)

  var isRunning = running[0], setRunning = running[1]
  var elapsedVal = elapsed[0], setElapsed = elapsed[1]
  var cyclesVal = cycles[0], setCycles = cycles[1]
  var ratingVal = rating[0], setRating = rating[1]
  var suppVal = supp[0], setSupp = supp[1]
  var savedVal = saved[0], setSaved = saved[1]

  var iv = useRef(null)
  var t0 = useRef(0)

  var start = function() {
    setRunning(true); setSaved(false)
    t0.current = Date.now() - elapsedVal*10
    iv.current = setInterval(function(){ setElapsed(Math.floor((Date.now()-t0.current)/10)) }, 50)
  }
  var lap = function() { setCycles(function(p){ return p.concat([elapsedVal/100]) }); setElapsed(0); t0.current=Date.now() }
  var stop = function() { clearInterval(iv.current); setRunning(false) }
  var reset = function() { clearInterval(iv.current); setRunning(false); setElapsed(0); setCycles([]); setSaved(false) }

  useEffect(function(){ return function(){ clearInterval(iv.current) } }, [])

  var s = Math.floor(elapsedVal/100), c = elapsedVal%100
  var avg = cyclesVal.length>0 ? cyclesVal.reduce(function(a,b){return a+b},0)/cyclesVal.length : 0
  var tn = avg*(ratingVal/100)
  var ts = tn*(1+suppVal/100)
  var sam = ts/60
  var cap = sam>0 ? Math.floor(450/sam) : 0

  return (
    <div>
      <h2 style={{ color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px' }}>Toma de Tiempos</h2>
      <p style={{ color:C.muted,fontSize:12,margin:'0 0 24px' }}>Cronómetro industrial · Captura de ciclos · Cálculo automático</p>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:20 }}>
        <Card>
          <div style={{ textAlign:'center' }}>
            <div style={{ background:C.bg,borderRadius:14,padding:'20px 24px',marginBottom:24,border:'2px solid '+(isRunning?C.accent:C.border),boxShadow:isRunning?'0 0 24px '+C.accent+'33':'none',transition:'all .3s' }}>
              <div style={{ fontFamily:'monospace',fontSize:48,fontWeight:900,color:isRunning?C.accent:C.text,lineHeight:1 }}>
                {String(Math.floor(s/60)).padStart(2,'0')}:{String(s%60).padStart(2,'0')}
                <span style={{ fontSize:24,color:C.muted }}>.{String(c).padStart(2,'0')}</span>
              </div>
              <div style={{ color:C.muted,fontSize:12,marginTop:8 }}>Ciclos: <strong style={{ color:C.text }}>{cyclesVal.length}</strong></div>
            </div>
            <div style={{ display:'flex',gap:10,justifyContent:'center',marginBottom:20 }}>
              {!isRunning ? <Btn onClick={start}>▶ Iniciar</Btn> : (
                <span style={{ display:'flex',gap:10 }}>
                  <Btn onClick={lap}>✓ Ciclo</Btn>
                  <Btn onClick={stop} color={C.warning}>⏸ Pausa</Btn>
                </span>
              )}
              <Btn onClick={reset} outline={true} color={C.danger}>↺</Btn>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,textAlign:'left' }}>
              <div>
                <div style={{ color:C.muted,fontSize:10,fontWeight:700,marginBottom:4 }}>CALIFICACIÓN: {ratingVal}%</div>
                <input type="range" min={50} max={150} value={ratingVal} onChange={function(e){ setRating(Number(e.target.value)) }} style={{ width:'100%',accentColor:C.accent }} />
              </div>
              <div>
                <div style={{ color:C.muted,fontSize:10,fontWeight:700,marginBottom:4 }}>SUPLEMENTO: {suppVal}%</div>
                <input type="range" min={5} max={30} value={suppVal} onChange={function(e){ setSupp(Number(e.target.value)) }} style={{ width:'100%',accentColor:C.warning }} />
              </div>
            </div>
          </div>
        </Card>
        <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
          <Card>
            <div style={{ color:C.text,fontWeight:800,marginBottom:12 }}>Ciclos ({cyclesVal.length})</div>
            {cyclesVal.length===0 ? (
              <div style={{ color:C.muted,fontSize:13,textAlign:'center',padding:'16px 0' }}>Inicia y presiona ✓ Ciclo en cada repetición</div>
            ) : (
              <div style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:6 }}>
                {cyclesVal.map(function(c,i){
                  return (
                    <div key={i} style={{ background:C.bg,borderRadius:8,padding:'6px',textAlign:'center' }}>
                      <div style={{ color:C.muted,fontSize:9 }}>C{i+1}</div>
                      <div style={{ color:C.accent,fontSize:13,fontWeight:800,fontFamily:'monospace' }}>{c.toFixed(2)}s</div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
          <Card style={{ flex:1 }}>
            <div style={{ color:C.text,fontWeight:800,marginBottom:14 }}>Resultados</div>
            {[
              { l:'Tiempo Observado Prom.', v:avg.toFixed(3),        u:'seg', color:C.text    },
              { l:'Tiempo Normal',          v:tn.toFixed(3),         u:'seg', color:C.info    },
              { l:'Tiempo Estándar',        v:ts.toFixed(3),         u:'seg', color:C.accent  },
              { l:'SAM',                    v:sam.toFixed(4),        u:'min', color:C.purple  },
              { l:'Capacidad / turno',      v:cap>0?String(cap):'—', u:'uds', color:C.warning },
            ].map(function(row){
              return (
                <div key={row.l} style={{ display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid '+C.border }}>
                  <span style={{ color:C.muted,fontSize:11 }}>{row.l}</span>
                  <span style={{ color:row.color,fontWeight:800,fontFamily:'monospace' }}>{row.v} <span style={{ color:C.muted,fontSize:10 }}>{row.u}</span></span>
                </div>
              )
            })}
          </Card>
        </div>
      </div>
    </div>
  )
}

function Production() {
  var pc = { high:C.danger, medium:C.warning, low:C.info }
  return (
    <div>
      <h2 style={{ color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px' }}>Órdenes de Producción</h2>
      <p style={{ color:C.muted,fontSize:12,margin:'0 0 24px' }}>Seguimiento de avance en tiempo real</p>
      <div style={{ display:'grid',gap:14 }}>
        {ORDERS.map(function(o){
          var pct = Math.round((o.done/o.qty)*100)
          return (
            <Card key={o.id} style={{ borderLeft:'4px solid '+pc[o.priority] }}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr auto auto auto auto',gap:20,alignItems:'center' }}>
                <div>
                  <div style={{ display:'flex',gap:8,alignItems:'center',marginBottom:6 }}>
                    <span style={{ color:C.muted,fontSize:11,fontFamily:'monospace' }}>{o.code}</span>
                    <Chip color={pc[o.priority]}>{o.priority}</Chip>
                    <Dot s={o.status} />
                  </div>
                  <div style={{ color:C.text,fontSize:16,fontWeight:800 }}>{o.ref}</div>
                </div>
                <div style={{ textAlign:'center' }}><div style={{ color:C.muted,fontSize:9 }}>PRODUCIDAS</div><div style={{ color:C.accent,fontSize:22,fontWeight:900 }}>{o.done}</div></div>
                <div style={{ textAlign:'center' }}><div style={{ color:C.muted,fontSize:9 }}>META</div><div style={{ color:C.text,fontSize:22,fontWeight:900 }}>{o.qty}</div></div>
                <div style={{ textAlign:'center' }}><div style={{ color:C.muted,fontSize:9 }}>PENDIENTE</div><div style={{ color:C.warning,fontSize:22,fontWeight:900 }}>{o.qty-o.done}</div></div>
                <div style={{ textAlign:'center' }}><div style={{ color:C.muted,fontSize:9 }}>AVANCE</div><div style={{ color:pct===100?C.info:C.accent,fontSize:22,fontWeight:900 }}>{pct}%</div></div>
              </div>
              <div style={{ marginTop:14 }}>
                <Bar v={o.done} max={o.qty} color={o.status==='completed'?C.info:C.accent} h={8} />
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function Reports() {
  var avgEff = (OPERATORS.reduce(function(s,o){return s+o.eff},0)/OPERATORS.length).toFixed(1)
  return (
    <div>
      <h2 style={{ color:C.text,fontSize:20,fontWeight:800,margin:'0 0 4px' }}>Reportes</h2>
      <p style={{ color:C.muted,fontSize:12,margin:'0 0 24px' }}>Análisis de producción y eficiencia — PROYECTEX</p>
      <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14,marginBottom:20 }}>
        <KPI label="Total Producido"  value={ORDERS.reduce(function(s,o){return s+o.done},0)} unit="uds" color={C.accent}  icon="🧵" />
        <KPI label="Eficiencia Prom." value={avgEff} unit="%" color={C.info} icon="⚡" />
        <KPI label="Completadas"      value={ORDERS.filter(function(o){return o.status==='completed'}).length} color={C.purple} icon="✅" />
        <KPI label="En Proceso"       value={ORDERS.filter(function(o){return o.status==='running'}).length}   color={C.warning} icon="🔄" />
      </div>
      <Card>
        <div style={{ color:C.text,fontWeight:800,marginBottom:16 }}>Eficiencia por Operario</div>
        {OPERATORS.map(function(op){
          return (
            <div key={op.id} style={{ marginBottom:14 }}>
              <div style={{ display:'flex',justifyContent:'space-between',marginBottom:4 }}>
                <span style={{ color:C.text,fontSize:13,fontWeight:600 }}>{op.name}</span>
                <span style={{ color:op.eff>=90?C.accent:op.eff>=80?C.warning:C.danger,fontWeight:800 }}>{op.eff}%</span>
              </div>
              <Bar v={op.eff} max={100} color={op.eff>=90?C.accent:op.eff>=80?C.warning:C.danger} />
              <div style={{ color:C.muted,fontSize:10,marginTop:2 }}>{op.today} uds hoy · Meta: {op.target} · {op.machine}</div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}

var MODULES = [
  { id:'dashboard',  label:'Dashboard',       icon:'📊', comp:Dashboard  },
  { id:'machines',   label:'Máquinas',        icon:'⚙️', comp:Machines   },
  { id:'operators',  label:'Operarios',       icon:'👷', comp:Operators  },
  { id:'timing',     label:'Toma de Tiempos', icon:'⏱', comp:Timing     },
  { id:'production', label:'Producción',      icon:'🏭', comp:Production },
  { id:'reports',    label:'Reportes',        icon:'📋', comp:Reports    },
]

export default function App() {
  var active = useState('dashboard')
  var open = useState(true)
  var activeId = active[0], setActive = active[1]
  var isOpen = open[0], setOpen = open[1]
  var mod = MODULES.find(function(m){ return m.id===activeId })
  var Mod = mod ? mod.comp : Dashboard

  return (
    <div style={{ display:'flex',height:'100vh',overflow:'hidden',background:C.bg }}>
      <div style={{ width:isOpen?220:60,background:C.surface,borderRight:'1px solid '+C.border,display:'flex',flexDirection:'column',transition:'width .3s',overflow:'hidden',flexShrink:0 }}>
        <div style={{ padding:'18px 14px',borderBottom:'1px solid '+C.border,display:'flex',alignItems:'center',gap:10 }}>
          <div style={{ width:34,height:34,background:'linear-gradient(135deg,#00D4AA,#0099AA)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }}>🧵</div>
          {isOpen && <div><div style={{ color:C.text,fontWeight:900,fontSize:14 }}>PROYECTEX</div><div style={{ color:C.muted,fontSize:9,letterSpacing:'0.08em' }}>SISTEMA MES</div></div>}
        </div>
        <nav style={{ flex:1,padding:'10px 6px',overflowY:'auto' }}>
          {MODULES.map(function(m){
            var on = activeId===m.id
            return (
              <button key={m.id} onClick={function(){ setActive(m.id) }} style={{
                width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 10px',
                background:on?C.accent+'22':'transparent',border:'1px solid '+(on?C.accent+'33':'transparent'),
                borderRadius:9,cursor:'pointer',marginBottom:2,color:on?C.accent:C.muted,textAlign:'left'
              }}>
                <span style={{ fontSize:17,flexShrink:0 }}>{m.icon}</span>
                {isOpen && <span style={{ fontSize:12,fontWeight:on?700:500,whiteSpace:'nowrap' }}>{m.label}</span>}
              </button>
            )
          })}
        </nav>
        <div style={{ padding:'10px 14px',borderTop:'1px solid '+C.border }}>
          <button onClick={function(){ setOpen(!isOpen) }} style={{ background:'none',border:'none',color:C.muted,cursor:'pointer',fontSize:16 }}>{isOpen?'◀':'▶'}</button>
        </div>
      </div>
      <div style={{ flex:1,display:'flex',flexDirection:'column',overflow:'hidden' }}>
        <div style={{ background:C.surface,borderBottom:'1px solid '+C.border,padding:'12px 24px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <span style={{ color:C.muted,fontSize:12 }}>PROYECTEX · <span style={{ color:C.accent,fontWeight:700 }}>{mod?mod.label:''}</span></span>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:7,height:7,borderRadius:'50%',background:C.accent,boxShadow:'0 0 8px '+C.accent }} />
            <span style={{ color:C.muted,fontSize:11 }}>En Línea · Turno Mañana</span>
          </div>
        </div>
        <div style={{ flex:1,overflowY:'auto',padding:24 }}>
          <Mod />
        </div>
      </div>
    </div>
  )
}
