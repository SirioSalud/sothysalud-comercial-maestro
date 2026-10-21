// ══ NAVIGATION ══
var visited = new Set(['home']);
var totalPages = 16;

function gp(id) {
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.ni').forEach(function(b){ b.classList.remove('active'); });
  var pg = document.getElementById('page-' + id);
  if (pg) pg.classList.add('active');
  document.querySelectorAll('.ni').forEach(function(b){
    var oc = b.getAttribute('onclick') || '';
    if (oc.indexOf("'" + id + "'") !== -1) b.classList.add('active');
  });
  visited.add(id);
  var pct = Math.round(visited.size / totalPages * 100);
  document.getElementById('pfill').style.width = pct + '%';
  document.getElementById('ppct').textContent = pct + '%';
  var main = document.querySelector('.main');
  if (main) main.scrollTop = 0;
  window.scrollTo(0, 0);
}

// ══ TABS — Simple and bulletproof ══
// ST(wrapperID, tabIndex) — finds all .tabbts buttons and .tpane divs inside the wrapper
function ST(wrapperId, idx) {
  var wrap = document.getElementById(wrapperId);
  if (!wrap) return;
  var btns = wrap.querySelector('.tabbts').querySelectorAll('.tbtn');
  var panes = wrap.querySelectorAll('.tpane');
  btns.forEach(function(b, i){ b.classList.toggle('on', i === idx); });
  panes.forEach(function(p, i){ p.classList.toggle('on', i === idx); });
}

// ══ SCORING ══
var SM = {};
function PS(btn) {
  var g = btn.dataset.g;
  btn.closest('.sc-opts').querySelectorAll('.scopt').forEach(function(b){ b.classList.remove('sel'); });
  btn.classList.add('sel');
  SM[g] = parseInt(btn.dataset.v);
  var total = Object.values(SM).reduce(function(a,b){ return a+b; }, 0);
  document.getElementById('scv').textContent = total + ' / 100';
  var v = document.getElementById('scverd');
  v.style.display = 'inline-block';
  if (total >= 75) { v.textContent = 'Cliente ideal'; v.style.cssText = 'background:#E1F5EE;color:#085041;display:inline-block'; }
  else if (total >= 50) { v.textContent = 'Cerrar con condiciones'; v.style.cssText = 'background:#FAEEDA;color:#633806;display:inline-block'; }
  else { v.textContent = 'Alto riesgo — evaluar antes de proceder'; v.style.cssText = 'background:#FCEBEB;color:#791F1F;display:inline-block'; }
}

// ══ EXAMEN FINAL CON INTENTOS, PREGUNTAS ALEATORIAS Y CERTIFICADO ══
var PASS_SCORE = 80;
var MAX_ATTEMPTS = 2;
var EXAM_SIZE = 15;
var attemptCount = 0;
var currentExam = [];
var QI=0, QS=0, QA=false;

var QQ = [
  {
    q:"Un prospecto dice: '¿Cuánto cuesta el paquete de exámenes?' antes de que hayas identificado su dolor. ¿Cuál es la respuesta correcta?",
    opts:[
      "Darle el precio inmediatamente para no perder su interés.",
      "Responder: 'Depende de lo que necesitas proteger. Cuéntame, ¿cuántos trabajadores con riesgo tienen hoy sin concepto de aptitud actualizado?'",
      "Decirle que el precio no importa y hablar de marca.",
      "Pedirle que envíe un correo con los requerimientos."
    ],
    c:1,
    e:"Revelar el precio antes de construir valor destruye la negociación. Primero identifica el dolor, luego justificas el precio."
  },
  {
    q:"¿Cuál de estas frases aplica mejor la técnica de anclaje en una negociación de servicios médico-ocupacionales?",
    opts:[
      "'Nuestros precios son los más económicos del mercado.'",
      "'Empresas similares a la tuya invierten entre $8 y $12 millones al año en cumplimiento. Nosotros podemos estructurarte una solución desde $4.5 millones.'",
      "'El precio lo definimos al final después de reunirnos.'",
      "'No podemos competir con precios de otras IPS.'"
    ],
    c:1,
    e:"El anclaje fija una referencia alta primero y luego posiciona tu oferta como ventajosa. Anclar con datos del mercado da credibilidad."
  },
  {
    q:"Un cliente dice: 'Necesito pensarlo con mi socio.' ¿Cuál es la respuesta comercial más efectiva?",
    opts:[
      "Decirle: 'Claro, cuando quieras me llamas.'",
      "Presionarlo para que decida en ese momento.",
      "Preguntar: '¿Qué es lo que más le preocupa a tu socio? Así puedo preparar un resumen específico para él.'",
      "Enviarle el brochure por correo y esperar."
    ],
    c:2,
    e:"Esta objeción suele ocultar una duda real. Involucrar al socio con información específica avanza la negociación en vez de detenerla."
  },
  {
    q:"¿Cuál es la diferencia entre una objeción real y una objeción falsa en ventas B2B?",
    opts:[
      "No existe diferencia; toda objeción es igual.",
      "La objeción real bloquea la venta; la falsa es cortesía para salir de la conversación sin comprometerse.",
      "La objeción falsa siempre se resuelve con descuento.",
      "La objeción real solo aparece en la segunda reunión."
    ],
    c:1,
    e:"Identificar si la objeción es real o una excusa te permite elegir la técnica correcta: resolver el fondo o reencuadrar la conversación."
  },
  {
    q:"En una negociación con un coordinador de SST, ¿cuál pregunta genera más tensión diagnóstica?",
    opts:[
      "'¿Ya conocen a Sothysalud IPS?'",
      "'¿Cuántos empleados tienen?'",
      "'Si el Ministerio del Trabajo los visitara mañana, ¿tienen el 100% de los conceptos de aptitud firmados y vigentes?'",
      "'¿Con qué IPS trabajan actualmente?'"
    ],
    c:2,
    e:"Las preguntas que generan tensión normativa activan el dolor real. El coordinador SST teme una visita del Ministerio más que cualquier otra consecuencia."
  },
  {
    q:"¿Qué significa BATNA en una negociación y cómo debes usarlo?",
    opts:[
      "Es una técnica de cierre rápido. Debes usarla en la primera reunión.",
      "Es tu mejor alternativa si la negociación fracasa. Conocerlo te da poder para no ceder más de lo necesario.",
      "Es el precio mínimo que puedes ofrecer antes de perder margen.",
      "Es un acrónimo de beneficios adicionales para el cliente."
    ],
    c:1,
    e:"BATNA (Best Alternative To a Negotiated Agreement) define hasta dónde puedes ceder. Quien conoce mejor su BATNA negocia con más poder."
  },
  {
    q:"Un cliente pide un descuento del 30% sin justificación. ¿Cuál es la respuesta correcta?",
    opts:[
      "Aceptar inmediatamente para no perder la venta.",
      "Preguntar: '¿Qué tendría que incluir o excluir la propuesta para que ese precio tenga sentido para ti?'",
      "Decirle que es imposible y terminar la reunión.",
      "Ofrecer el 15% de descuento como punto medio."
    ],
    c:1,
    e:"Pedir condiciones a cambio del descuento transforma la conversación: el cliente entiende que el precio tiene lógica y deja de pedir descuentos sin fundamento."
  },
  {
    q:"¿Cuál de estos es un cierre de prueba efectivo en ventas de salud ocupacional?",
    opts:[
      "'¿Te gustó nuestra presentación?'",
      "'¿Firmamos hoy?'",
      "'Si pudiéramos iniciar los exámenes la próxima semana, ¿qué necesitaría estar listo de tu lado?'",
      "'¿Ya decidiste?'"
    ],
    c:2,
    e:"El cierre de prueba proyecta al cliente hacia la implementación sin presión. Revela obstáculos reales y compromiso sin exigir una decisión formal."
  },
  {
    q:"¿Cuál es el momento correcto para presentar el precio en una venta consultiva B2B?",
    opts:[
      "Al inicio de la reunión para establecer expectativas.",
      "Solo cuando el cliente lo pregunta, sin más contexto.",
      "Después de haber construido valor, identificado el dolor y mostrado cómo la solución resuelve el problema específico del cliente.",
      "En el correo previo a la reunión para ahorrar tiempo."
    ],
    c:2,
    e:"El precio tiene sentido solo cuando el cliente ya percibe el valor. Presentarlo antes destruye la negociación porque no hay nada que justifique el número."
  },
  {
    q:"Un gerente de RR.HH. dice: 'Ya tenemos proveedor de salud ocupacional.' ¿Cómo respondes?",
    opts:[
      "Decirle: 'Entiendo, llámame si cambian de opinión.'",
      "Preguntar: '¿Qué tan satisfechos están con los tiempos de entrega de conceptos de aptitud cuando tienen urgencia de contratación?'",
      "Criticar al proveedor actual para generar duda.",
      "Ofrecer un descuento inmediato para competir."
    ],
    c:1,
    e:"Tener proveedor no significa estar satisfecho. Una pregunta sobre un punto de fricción frecuente abre la puerta sin atacar a la competencia."
  },
  {
    q:"¿Cuál técnica de negociación usa preguntas en lugar de argumentos para cambiar la posición del cliente?",
    opts:[
      "Técnica de cierre por urgencia.",
      "Técnica de negociación socrática.",
      "Técnica de descuento progresivo.",
      "Técnica de anclaje emocional."
    ],
    c:1,
    e:"La negociación socrática guía al cliente para que llegue solo a la conclusión correcta mediante preguntas. Es más efectiva que argumentar porque el cliente siente que la decisión fue suya."
  },
  {
    q:"¿Qué es el efecto de pérdida en negociación y cómo se aplica en ventas de cumplimiento normativo?",
    opts:[
      "Es cuando el cliente siente que pierde tiempo en la reunión.",
      "Es el principio por el que las personas actúan más para evitar una pérdida que para obtener una ganancia. Se aplica mostrando el costo de no cumplir.",
      "Es un descuento que se pierde si el cliente no decide hoy.",
      "Es cuando el vendedor pierde el margen por dar descuentos."
    ],
    c:1,
    e:"'Una multa del Ministerio puede costar más de $50 millones' activa más decisión que 'ahorras dinero con nosotros'. El dolor de perder es más poderoso que la promesa de ganar."
  },
  {
    q:"¿Qué significa hacer 'seguimiento de valor' en lugar de 'seguimiento de presión'?",
    opts:[
      "Llamar al cliente todos los días hasta que responda.",
      "Cada contacto post-reunión aporta nueva información útil, no solo pregunta '¿ya decidiste?'",
      "Enviar el mismo correo con copia a más personas del cliente.",
      "Reducir el precio en cada seguimiento hasta cerrar."
    ],
    c:1,
    e:"El seguimiento de valor construye relación y posición. El seguimiento de presión genera rechazo. Cada toque debe aportar algo: un dato, una referencia, una respuesta a una duda pendiente."
  },
  {
    q:"En una negociación con un decisor financiero (CFO), ¿cuál argumento tiene más peso?",
    opts:[
      "'Somos la IPS más completa del mercado.'",
      "'El servicio incluye atención personalizada y calidad humana.'",
      "'Una sanción por incumplimiento en seguridad y salud en el trabajo puede representar entre 20 y 500 salarios mínimos. Nuestro servicio reduce ese riesgo a costo predecible.'",
      "'Llevamos 10 años en el mercado y somos reconocidos.'"
    ],
    c:2,
    e:"El CFO piensa en riesgo financiero y costo-beneficio. Hablarle en su lenguaje — cifras, exposición y control de riesgo — es la única forma de ganar su atención."
  },
  {
    q:"¿Qué es una 'zona de posible acuerdo' (ZOPA) en negociación?",
    opts:[
      "El rango de precios donde ambas partes pueden llegar a un acuerdo sin sacrificar sus intereses mínimos.",
      "El momento en que el cliente firma el contrato.",
      "El descuento máximo que el vendedor puede ofrecer.",
      "La zona geográfica donde opera el cliente potencial."
    ],
    c:0,
    e:"La ZOPA existe cuando el precio mínimo del vendedor es menor que el precio máximo que el cliente está dispuesto a pagar. Conocer tu ZOPA te permite negociar sin perder margen innecesariamente."
  },
  {
    q:"Un cliente dice: 'Su propuesta es buena, pero la de la competencia es más barata.' ¿Cuál es la respuesta más efectiva?",
    opts:[
      "Igualar el precio de la competencia de inmediato.",
      "Preguntar: '¿Incluye esa propuesta concepto médico especializado, trazabilidad digital y soporte en caso de visita del Ministerio?'",
      "Criticar a la competencia por sus prácticas.",
      "Decir que no podemos bajar el precio y despedirse."
    ],
    c:1,
    e:"Comparar precios sin comparar contenido es injusto. La pregunta correcta revela las diferencias de valor sin atacar y posiciona tu propuesta como superior en fondo."
  },
  {
    q:"¿Cuál es la diferencia entre negociar posiciones y negociar intereses?",
    opts:[
      "Negociar posiciones es más efectivo porque es directo.",
      "Negociar intereses busca entender qué necesita realmente el cliente detrás de lo que pide, lo que permite crear acuerdos creativos y sostenibles.",
      "Son lo mismo pero con distinto nombre.",
      "Negociar intereses aplica solo en ventas de alto valor."
    ],
    c:1,
    e:"Un cliente que pide descuento puede tener como interés real reducir el riesgo presupuestal. Entender el interés te permite ofrecer soluciones que no necesariamente implican bajar el precio."
  },
  {
    q:"¿Cuándo es correcto usar silencio como herramienta en una negociación?",
    opts:[
      "Nunca, el silencio incomoda al cliente y perjudica la relación.",
      "Después de hacer una propuesta o cerrar, para dar espacio al cliente sin rescatar la negociación prematuramente.",
      "Solo en reuniones virtuales donde el audio puede fallar.",
      "Al inicio de la reunión para generar misterio."
    ],
    c:1,
    e:"El silencio después de una propuesta es una de las herramientas más poderosas. Quien habla primero después de una oferta suele ceder. Deja que el cliente procese y responda."
  },
  {
    q:"Un prospecto pospone la decisión tres veces seguidas. ¿Cuál es la acción correcta?",
    opts:[
      "Seguir esperando con paciencia indefinida.",
      "Ofrecer un descuento adicional en cada contacto.",
      "Hacer una pregunta directa: '¿Qué debería pasar para que esto se convirtiera en una prioridad este mes?'",
      "Eliminarlo del pipeline y no volver a contactarlo."
    ],
    c:2,
    e:"Tres postergaciones seguidas indican un bloqueador no revelado. La pregunta directa lo saca a la luz sin presión y te permite resolver el obstáculo real o descalificar el prospecto."
  },
  {
    q:"¿Qué es el método SPIN en ventas y cuál es su secuencia correcta?",
    opts:[
      "Situación, Problema, Implicación, Necesidad de solución. Primero exploras, luego amplías el dolor, luego conectas con tu solución.",
      "Servicio, Precio, Interés, Negociación. Es una técnica de cierre rápido.",
      "Simpatía, Persuasión, Influencia, Negociación. Aplica en ventas emocionales.",
      "Solución, Propuesta, Implementación, Negociación. Empieza mostrando la solución."
    ],
    c:0,
    e:"SPIN (Situation, Problem, Implication, Need-payoff) guía al cliente desde reconocer su situación hasta sentir el dolor de no actuar y ver el valor de tu solución. Es la base de la venta consultiva."
  },
  {
    q:"¿Cuál de estas acciones destruye más rápido la confianza en una negociación?",
    opts:[
      "Llegar tarde a la primera reunión.",
      "Prometer algo que no puedes cumplir para cerrar más rápido.",
      "No enviar el brochure antes de la reunión.",
      "Hablar demasiado de la empresa en la primera llamada."
    ],
    c:1,
    e:"Una promesa incumplida destruye la relación de forma casi irreversible en ventas B2B. El cliente lo recordará y lo compartirá. La confianza es el activo más frágil y más valioso."
  },
  {
    q:"¿Qué es una concesión táctica en negociación y cómo debe hacerse?",
    opts:[
      "Dar un descuento grande al inicio para ganar confianza.",
      "Ceder algo de poco valor para ti pero significativo para el cliente, siempre a cambio de algo: una decisión, un volumen o un plazo.",
      "Eliminar servicios del paquete para reducir el precio.",
      "Prometer entregas más rápidas sin consultar al equipo operativo."
    ],
    c:1,
    e:"Las concesiones deben ser percibidas como valiosas por el cliente y siempre condicionadas a algo. Conceder gratis enseña al cliente a pedir más sin dar nada a cambio."
  },
  {
    q:"Un cliente quiere negociar directamente con tu jefe, saltándote a ti. ¿Cuál es la respuesta profesional?",
    opts:[
      "Ceder inmediatamente y organizar la reunión.",
      "Decirle que eso no es posible y terminar la conversación.",
      "Responder: 'Con gusto incluyo a mi director. Para preparar bien esa reunión, ¿cuáles son los puntos que más te importa que él responda?'",
      "Ignorar el pedido y seguir como si nada."
    ],
    c:2,
    e:"Involucrar al director sin control cede el poder de la negociación. Condicionar la reunión a una agenda clara te permite prepararte, aportar valor y mantener tu rol en el proceso."
  },
  {
    q:"¿Cuál es la señal más confiable de que un cliente está listo para cerrar?",
    opts:[
      "Dice que la propuesta 'está interesante'.",
      "Pregunta por detalles de implementación, tiempos, facturación o logística de inicio.",
      "Pide más reuniones de demostración.",
      "Solicita referencias de otros clientes."
    ],
    c:1,
    e:"Las preguntas de implementación indican que el cliente ya se está imaginando usando el servicio. Es el momento de avanzar al cierre, no de volver a presentar características."
  },
  {
    q:"¿Qué significa 'crear urgencia real' versus 'crear urgencia falsa' en ventas?",
    opts:[
      "Son lo mismo; el cliente no puede distinguirlas.",
      "La urgencia real está basada en una consecuencia verdadera (vencimiento normativo, temporada de contratación, aumento de precio confirmado). La urgencia falsa es inventada y destruye credibilidad cuando el cliente la detecta.",
      "La urgencia falsa es una técnica válida si el cliente es lento para decidir.",
      "Solo aplica en ventas transaccionales, no en ventas consultivas."
    ],
    c:1,
    e:"La urgencia falsa ('esta oferta vence hoy' sin que sea cierto) daña la confianza. La urgencia real conecta con consecuencias verdaderas que el cliente ya conoce y teme."
  },
  {
    q:"En una negociación donde el cliente tiene más poder (empresa grande), ¿cuál es la mejor estrategia?",
    opts:[
      "Ceder en todo para no perder el cliente.",
      "Fortalecer tu BATNA, especializar tu propuesta y posicionarte como el único que resuelve un dolor específico que otros no atienden.",
      "Competir exclusivamente por precio.",
      "Evitar negociar y esperar a que el cliente proponga términos."
    ],
    c:1,
    e:"Cuando el cliente tiene más poder, tu defensa es la especialización y el BATNA fuerte. Si eres el único que resuelve algo crítico de forma específica, el poder se equilibra."
  },
  {
    q:"¿Cuál es el propósito de una 'reunión de diagnóstico' antes de presentar una propuesta?",
    opts:[
      "Mostrar al cliente todas las soluciones disponibles para que elija.",
      "Mapear con precisión el dolor, el decisor real, el presupuesto disponible y el plazo de decisión antes de invertir en construir una propuesta.",
      "Hacer una presentación corporativa de la empresa.",
      "Firmar un acuerdo de confidencialidad antes de compartir precios."
    ],
    c:1,
    e:"Una propuesta construida sin diagnóstico es un disparo a ciegas. La reunión de diagnóstico reduce el esfuerzo de propuesta y aumenta la tasa de cierre porque hablas exactamente del dolor del cliente."
  },
  {
    q:"¿Qué es el 'framing' o reencuadre en negociación?",
    opts:[
      "Presentar la misma información con un marco diferente para cambiar cómo el cliente la percibe.",
      "Mostrar el precio en cuotas para que parezca menor.",
      "Usar imágenes y gráficas para hacer la propuesta más visual.",
      "Repetir el nombre del cliente frecuentemente para generar rapport."
    ],
    c:0,
    e:"'$500.000 al mes por trabajador protegido' y '$6 millones anuales' son el mismo precio con distinto encuadre. El framing correcto hace que el valor sea más claro que el costo."
  },
  {
    q:"Un cliente con quien llevas 6 meses en conversaciones no avanza ni retrocede. ¿Qué haces?",
    opts:[
      "Seguir insistiendo hasta que tome una decisión.",
      "Plantear directamente: 'Llevamos 6 meses en conversación. Necesito entender si esto tiene posibilidades reales este trimestre o si debería enfocarlo para el siguiente ciclo presupuestal.'",
      "Ofrecerle el precio más bajo posible para destrabar.",
      "Pedir referencias de otros contactos dentro de su empresa."
    ],
    c:1,
    e:"Las conversaciones eternas sin avance consumen tiempo y energía. Plantear la realidad con respeto mueve al cliente a definir o libera tu tiempo para prospectos con mayor urgencia."
  },
  {
    q:"¿Cuál es la diferencia entre un vendedor 'hunter' y un vendedor 'farmer' en el contexto comercial de Sothysalud?",
    opts:[
      "El hunter cierra contratos nuevos y el farmer los renueva y hace crecer. Ambos roles son necesarios y complementarios.",
      "El hunter trabaja en campo y el farmer trabaja desde la oficina.",
      "El hunter vende servicios básicos y el farmer vende servicios premium.",
      "Son nombres distintos para el mismo perfil comercial."
    ],
    c:0,
    e:"Sothysalud necesita hunters que abran nuevas empresas y farmers que profundicen y renueven relaciones existentes. Confundir los roles lleva a perder clientes activos o a dejar de crecer el portafolio."
  }
];
function Shuffle(arr){ return arr.map(function(v){return {v:v,r:Math.random()}}).sort(function(a,b){return a.r-b.r}).map(function(x){return x.v}); }
const COMMERCIAL_EMAIL = 'gerencia@sothysaludips.com';
const COMMERCIAL_CC = 'contactosothysaludips@gmail.com';
const CERT_FOLDER_ROOT = 'Certificados Emitidos — Escuela de Negocios Sothysalud IPS';
const CERT_BG_APPROVED = '';
const CERT_BG_HIGHLIGHTED = '';
const CERT_BG_SIRIO = '';
const APPS_SCRIPT_WEBHOOK = 'https://script.google.com/macros/s/AKfycbwxxQQqaw7TSXjSAiqaX4QuZNOZyMrLMXG1t1-Ibd5v84Bjo3n7gNs_21V1SxptBac/exec'; // Opcional: pega aquí una URL de Google Apps Script para notificación automática real.
function GetStudentData(){
  return {
    name:(document.getElementById('student-name').value||'').trim(),
    id:(document.getElementById('student-id').value||'').trim(),
    email:(document.getElementById('student-email').value||'').trim(),
    phone:(document.getElementById('student-phone').value||'').trim(),
    profile:(document.getElementById('student-profile').value||'').trim(),
    stars:(document.getElementById('student-stars').value||'').trim(),
    formlink:(document.getElementById('student-formlink').value||'').trim(),
    cvlink:(document.getElementById('student-cvlink').value||'').trim()
  };
}
function ValidateStudentData(d){
  var missing=[];
  if(!d.name) missing.push('nombre completo');
  if(!d.email) missing.push('correo');
  if(!d.phone) missing.push('celular');
  if(!d.profile) missing.push('perfil comercial');
  if(!d.stars) missing.push('escalafón de estrellas');
  if(missing.length){ alert('Faltan datos obligatorios: '+missing.join(', ')+'.'); return false; }
  return true;
}
function FillDemoStudent(){
  document.getElementById('student-name').value='Nombre del Comercial';
  document.getElementById('student-email').value='comercial@correo.com';
  document.getElementById('student-phone').value='3000000000';
  document.getElementById('student-profile').value='Hunter Comercial';
  document.getElementById('student-stars').value='3 estrellas — Hunter operativo';
}
function StartFinalExam(){
  var d=GetStudentData();
  if(!ValidateStudentData(d)) return;
  var key='sothy_exam_attempts_'+d.email.toLowerCase();
  attemptCount = parseInt(localStorage.getItem(key)||'0');
  if(attemptCount>=MAX_ATTEMPTS){
    var lastScore=parseInt(localStorage.getItem('sothy_exam_last_score_'+d.email.toLowerCase())||'0');
    ShowAdministrativeReview(lastScore || 0, 'Intentos ordinarios agotados en este navegador.');
    return;
  }
  attemptCount++;
  localStorage.setItem(key, attemptCount);
  currentExam = Shuffle(QQ).slice(0, EXAM_SIZE);
  QI=0; QS=0; QA=false;
  document.getElementById('exam-start').style.display='none';
  document.getElementById('qz-score').style.display='none';
  document.getElementById('cert-wrap').style.display='none';
  var cert=document.getElementById('certificate'); if(cert) cert.style.display='block';
  document.getElementById('qz-body').style.display='block';
  document.getElementById('attempt-pill').textContent='Intento '+attemptCount+' de '+MAX_ATTEMPTS;
  QRender();
}
function QRender(){
  var q=currentExam[QI]; if(!q) return;
  document.getElementById('qz-q').textContent=(QI+1)+'. '+q.q;
  document.getElementById('qz-ctr').textContent=(QI+1)+' / '+currentExam.length;
  var o=document.getElementById('qz-opts'); o.innerHTML='';
  q.opts.forEach(function(opt,i){
    var b=document.createElement('button'); b.className='qopt'; b.textContent=opt;
    b.onclick=function(){ if(!QA) QAnswer(i,b); };
    o.appendChild(b);
  });
  var fb=document.getElementById('qz-fb'); fb.className='qfb'; fb.textContent='';
  var nx=document.getElementById('qz-next'); nx.style.display='none'; nx.textContent = QI===currentExam.length-1 ? 'Ver resultado' : 'Siguiente →';
  QA=false;
}
function QAnswer(i,btn){
  QA=true;
  var q=currentExam[QI];
  document.querySelectorAll('#qz-opts .qopt')[q.c].classList.add('correct');
  if(i!==q.c) btn.classList.add('wrong'); else QS++;
  var fb=document.getElementById('qz-fb');
  fb.textContent=(i===q.c?'✓ Correcto. ':'✗ Incorrecto. ')+q.e;
  fb.className='qfb show '+(i===q.c?'ok':'fail');
  document.getElementById('qz-next').style.display='inline-block';
}
function QNext(){
  QI++;
  if(QI>=currentExam.length){
    var pct=Math.round(QS/currentExam.length*100);
    var dstudent=GetStudentData();
    if(dstudent.email) localStorage.setItem('sothy_exam_last_score_'+dstudent.email.toLowerCase(), pct);
    document.getElementById('qz-body').style.display='none';
    var d=document.getElementById('qz-score'); d.style.display='block';
    var n=document.getElementById('qz-num'); n.textContent=pct+'%'; n.style.color=pct>=PASS_SCORE?'var(--td)':'var(--re)';
    if(pct>=PASS_SCORE){
      document.getElementById('qz-msg').textContent=pct===100?'Aprobado con Distinción Estrella Sirio. Puedes generar y enviar el certificado.':(pct>=90?'Aprobado con certificación destacada. Puedes generar y enviar el certificado.':'Aprobado. Puedes generar el certificado de culminación.');
      GenerateCert(pct);
    }else if(attemptCount<MAX_ATTEMPTS){
      document.getElementById('qz-msg').textContent='Primer intento no aprobado. Debe repasar la formación antes de presentar el segundo intento. Intentos usados: '+attemptCount+' de '+MAX_ATTEMPTS+'.';
      document.getElementById('cert-wrap').style.display='none';
    }else{
      ShowAdministrativeReview(pct, 'Segundo intento no aprobado.');
    }
  } else QRender();
}
function QResetFinal(){
  document.getElementById('exam-start').style.display='block';
  document.getElementById('qz-score').style.display='none';
  document.getElementById('qz-body').style.display='none';
  document.getElementById('cert-wrap').style.display='none';
  var cr=document.getElementById('commercial-report'); if(cr) cr.style.display='none';
}
/* Certificate template images v23 */
// Las plantillas van como archivos aparte, no incrustadas: los tres SVG suman
// 8 MB y en base64 pasarian de 10 MB, que todo estudiante descargaria solo para
// leer el modulo 1. Asi el navegador las pide unicamente al generar el diploma.
var CERT_TPL_APROBADA  = 'certificados/aprobada.svg';
var CERT_TPL_DESTACADA = 'certificados/destacada.svg';
var CERT_TPL_SIRIO     = 'certificados/sirio.svg';

function GetCertTemplate(pct){
  if(pct===100) return CERT_TPL_SIRIO;
  if(pct>=90) return CERT_TPL_DESTACADA;
  return CERT_TPL_APROBADA;
}

function GetCertificationType(pct){
  if(pct===100) return 'Distinción Estrella Sirio';
  if(pct>=90) return 'Certificación destacada';
  if(pct>=80) return 'Certificación aprobada';
  return 'Sin certificación ordinaria';
}
function GetCertificateCode(d){
  var base=(d.id||d.email||d.name||'0000').toString().replace(/[^A-Za-z0-9]/g,'').slice(-4).toUpperCase();
  if(!base) base='0000';
  var now=new Date();
  return 'ENS-SOT-'+now.getFullYear()+'-'+base.padStart(4,'0');
}
function GetCertFolderName(type){
  if(type==='Certificación aprobada') return '01_Certificacion_Aprobada';
  if(type==='Certificación destacada') return '02_Certificacion_Destacada';
  if(type==='Distinción Estrella Sirio') return '03_Distincion_Estrella_Sirio';
  return '04_Revision_Administrativa';
}

function GenerateCert(pct){
  var d=GetStudentData();
  var cert=document.getElementById('certificate'); if(cert) cert.style.display='block';
  var type = GetCertificationType(pct);
  var tplImg=GetCertTemplate(pct);
  var stage=document.getElementById('cert-stage');
  if(stage){
    stage.classList.remove('cert-tpl-aprobada','cert-tpl-destacada','cert-tpl-sirio');
    if(pct===100) stage.classList.add('cert-tpl-sirio');
    else if(pct>=90) stage.classList.add('cert-tpl-destacada');
    else stage.classList.add('cert-tpl-aprobada');
    if(tplImg){
      stage.classList.remove('cert-plain');
      stage.style.setProperty('background-image','url('+tplImg+')','important');
    } else {
      stage.classList.add('cert-plain');
      stage.style.removeProperty('background-image');
    }
  }
  var recognition = type;
  var code = GetCertificateCode(d);
  var dateTxt = new Date().toLocaleDateString('es-CO',{year:'numeric',month:'long',day:'numeric'});
  document.getElementById('cert-stage-name').textContent=d.name||'Nombre del estudiante';
  document.getElementById('cert-stage-date').textContent=dateTxt;
  document.getElementById('cert-stage-code').textContent=code;
  var recoEl=document.getElementById('cert-stage-reco'); if(recoEl) recoEl.textContent=recognition;
  AjustaNombre();
  var scoreEl=document.getElementById('cert-stage-score'); if(scoreEl) scoreEl.textContent='Puntaje: '+pct+'/100';
  document.getElementById('cert-score').textContent=pct+'%';
  document.getElementById('cert-attempt').textContent=attemptCount+' de '+MAX_ATTEMPTS;
  document.getElementById('cert-date').textContent=dateTxt;
  document.getElementById('cert-profile').textContent=d.profile||'—';
  document.getElementById('cert-stars').textContent=d.stars||'—';
  document.getElementById('cert-recognition').textContent=recognition;
  document.getElementById('cert-type').textContent=type;
  document.getElementById('cert-code').textContent=code;
  document.getElementById('cert-wrap').style.display='block';
  var cr=document.getElementById('commercial-report'); if(cr) cr.style.display='block';
  BuildCommercialReport(pct, recognition, type, code, GetCertFolderName(type));
  TryWebhookNotification(pct, recognition);
}
function AjustaNombre(){
  var n=document.getElementById('cert-stage-name'); if(!n) return;
  n.style.fontSize='';                                   // vuelve al tamaño de la hoja de estilo
  var caja=n.parentNode ? n.getBoundingClientRect() : null;
  if(!caja || !caja.width) return;
  var limite=n.getBoundingClientRect().width;
  var px=parseFloat(getComputedStyle(n).fontSize);
  // el nombre va en una banda estrecha del diploma: si no cabe en una linea, encoge
  for(var i=0; i<22 && n.scrollWidth > Math.ceil(limite) && px > 11; i++){
    px *= 0.94; n.style.setProperty('font-size', px.toFixed(1)+'px', 'important');
  }
}

function ShowAdministrativeReview(pct, reason){
  document.getElementById('qz-body').style.display='none';
  document.getElementById('exam-start').style.display='block';
  var scoreBox=document.getElementById('qz-score'); scoreBox.style.display='block';
  var n=document.getElementById('qz-num');
  n.textContent=(pct ? pct+'%' : 'Revisión');
  n.style.color='var(--re)';
  document.getElementById('qz-msg').innerHTML='Has completado los intentos ordinarios del examen final de la Escuela de Negocios Sothysalud IPS.<br><br><strong>Estado del proceso: Revisión por administración.</strong><br><br>Esto no significa una descalificación automática. Puede existir una situación técnica, una condición particular del proceso o un criterio comercial adicional que deba ser evaluado. Comunícate con el administrador de la Escuela de Negocios Sothysalud IPS para revisar tu caso y definir el siguiente paso.';
  var cert=document.getElementById('certificate'); if(cert) cert.style.display='none';
  document.getElementById('cert-wrap').style.display='block';
  var cr=document.getElementById('commercial-report'); if(cr) cr.style.display='block';
  BuildAdministrativeReviewReport(pct, reason || 'Revisión por administración');
}

function BuildAdministrativeReviewReport(pct, reason){
  var d=GetStudentData();
  var body = [
    'REPORTE DE REVISIÓN ADMINISTRATIVA — ESCUELA DE NEGOCIOS SOTHYSALUD IPS',
    '',
    'El participante completó los intentos ordinarios del examen final sin alcanzar el puntaje mínimo de aprobación.',
    '',
    'IMPORTANTE',
    'Este resultado no genera descarte automático. El caso requiere revisión administrativa o de alta dirección antes de tomar una decisión final.',
    '',
    'DATOS DEL PARTICIPANTE',
    'Nombre: '+(d.name||'—'),
    'Documento: '+(d.id||'—'),
    'Correo: '+(d.email||'—'),
    'Celular: '+(d.phone||'—'),
    'Perfil comercial aspirado: '+(d.profile||'—'),
    'Escalafón real asignado: '+(d.stars||'—'),
    '',
    'RESULTADO DEL EXAMEN',
    'Último puntaje registrado: '+(pct ? pct+'%' : 'No disponible'),
    'Intentos usados: '+MAX_ATTEMPTS+' de '+MAX_ATTEMPTS,
    'Estado sugerido en Base Viva: Revisión por administración',
    'Motivo: '+(reason||'Segundo intento no aprobado'),
    'Fecha: '+new Date().toLocaleDateString('es-CO',{year:'numeric',month:'long',day:'numeric'}),
    '',
    'RUTAS POSIBLES',
    '1. Validación oral.',
    '2. Prueba práctica comercial.',
    '3. Intento excepcional autorizado.',
    '4. Banco de talento.',
    '5. Descarte formal documentado.',
    '6. Activación por criterio directivo.',
    '',
    'SOPORTES',
    'Registro / Google Forms: '+(d.formlink||'Pendiente de adjuntar'),
    'Hoja de vida / Drive: '+(d.cvlink||'Pendiente de adjuntar'),
    '',
    'Nota: Las estrellas corresponden al perfil comercial real y no al resultado del examen.'
  ].join('\n');
  var rt=document.getElementById('report-text'); if(rt) rt.value=body;
  return body;
}

function BuildCommercialReport(pct, recognition){
  var d=GetStudentData();
  var body = [
    'REPORTE DE APROBACIÓN — ESCUELA DE NEGOCIOS SOTHYSALUD IPS',
    '',
    'El participante culminó satisfactoriamente el curso de formación comercial institucional.',
    '',
    'DATOS DEL COMERCIAL',
    'Nombre: '+(d.name||'—'),
    'Documento: '+(d.id||'—'),
    'Correo: '+(d.email||'—'),
    'Celular: '+(d.phone||'—'),
    'Perfil comercial aspirado: '+(d.profile||'—'),
    'Escalafón real asignado: '+(d.stars||'—'),
    '',
    'EVALUACIÓN',
    'Puntaje obtenido: '+pct+'%',
    'Intento aprobado: '+attemptCount+' de '+MAX_ATTEMPTS,
    'Reconocimiento: '+recognition,
    'Fecha: '+new Date().toLocaleDateString('es-CO',{year:'numeric',month:'long',day:'numeric'}),
    '',
    'SOPORTES',
    'Registro / Google Forms: '+(d.formlink||'Pendiente de adjuntar'),
    'Hoja de vida / Drive: '+(d.cvlink||'Pendiente de adjuntar'),
    '',
    'LECTURA INSTITUCIONAL',
    pct===100 ? 'Aprobó con 100 puntos. Recomendación: reconocerlo como candidato de alto compromiso formativo y priorizar entrevista comercial.' : 'Aprobó el estándar mínimo institucional. Recomendación: continuar con entrevista, validación de experiencia real y revisión de habilidades de cierre.',
    '',
    'Nota: Las estrellas corresponden al perfil comercial real y no al resultado del examen.'
  ].join('\n');
  var rt=document.getElementById('report-text'); if(rt) rt.value=body;
  return body;
}
function CopyCommercialReport(){
  var rt=document.getElementById('report-text');
  if(!rt) return;
  rt.select(); document.execCommand('copy');
  alert('Reporte copiado. Puedes pegarlo en correo, WhatsApp o CRM.');
}
function SendCommercialReport(){
  var d=GetStudentData();
  var body=(document.getElementById('report-text')||{}).value||BuildCommercialReport(0,'');
  var subject=((body.indexOf('REVISIÓN ADMINISTRATIVA')!==-1)?'Revisión administrativa Escuela de Negocios — ':'Aprobación Escuela de Negocios — ')+(d.name||'Comercial Sothysalud');
  var url='mailto:'+encodeURIComponent(COMMERCIAL_EMAIL)+'?cc='+encodeURIComponent(COMMERCIAL_CC)+'&subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  window.location.href=url;
}
function TryWebhookNotification(pct, recognition){
  if(!APPS_SCRIPT_WEBHOOK) return;
  try{
    var d=GetStudentData();
    var type = GetCertificationType(pct);
    var code = GetCertificateCode(d);
    var folder = GetCertFolderName(type);
    var payload = {
      // Datos planos para Apps Script
      nombre: d.name,
      documento: d.id,
      correo: d.email,
      celular: d.phone,
      perfil: d.profile,
      estrellas: d.stars,
      formlink: d.formlink,
      cvlink: d.cvlink,
      puntaje: pct,
      score: pct,
      intento: attemptCount + ' de ' + MAX_ATTEMPTS,
      attempt: attemptCount,
      reconocimiento: recognition,
      tipo_certificado: type,
      codigo_certificado: code,
      carpeta_destino: folder,
      fecha: new Date().toISOString(),

      // Se conserva también anidado por compatibilidad
      student: d,
      recognition: recognition,
      type: type,
      code: code,
      folder: folder,
      date: new Date().toISOString()
    };

    fetch(APPS_SCRIPT_WEBHOOK,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    }).catch(function(){ /* el certificado no depende de la notificacion */ });
  }catch(e){ console.warn('No se pudo notificar automáticamente',e); }
}

// ══ CHECKLIST ══
function ChkScopeId(scope){
  var d=new Date();
  if(scope==='semana'){
    var dd=new Date(d.getFullYear(),d.getMonth(),d.getDate());
    dd.setDate(dd.getDate()-((dd.getDay()+6)%7));           // lunes de esta semana
    return 'w'+dd.toISOString().slice(0,10);
  }
  return 'd'+d.toISOString().slice(0,10);                   // hoy
}
function ChkRead(scope){
  try{ return JSON.parse(localStorage.getItem('edn.chk.'+scope+'.'+ChkScopeId(scope))||'{}'); }
  catch(e){ return {}; }
}
function ChkWrite(scope,obj){
  try{ localStorage.setItem('edn.chk.'+scope+'.'+ChkScopeId(scope),JSON.stringify(obj)); }catch(e){}
}
function ChkCount(card){
  var tot=card.querySelectorAll('.chi').length;
  var hechos=card.querySelectorAll('.chb.done').length;
  var el=card.querySelector('.chk-count');
  if(el) el.textContent=hechos+' de '+tot;
}
function TC(item){
  var b=item.querySelector('.chb'), t=item.querySelector('.cht');
  b.classList.toggle('done'); t.classList.toggle('done');
  var card=item.closest('.card'); if(!card) return;
  var scope=card.getAttribute('data-scope')||'dia';
  var st=ChkRead(scope); st[item.getAttribute('data-k')]=b.classList.contains('done');
  ChkWrite(scope,st); ChkCount(card);
}
function ChkRestore(){
  document.querySelectorAll('.card[data-scope]').forEach(function(card){
    var st=ChkRead(card.getAttribute('data-scope'));
    card.querySelectorAll('.chi').forEach(function(it){
      if(st[it.getAttribute('data-k')]){
        it.querySelector('.chb').classList.add('done');
        it.querySelector('.cht').classList.add('done');
      }
    });
    ChkCount(card);
  });
}

// ══ INIT ══
ChkRestore();
