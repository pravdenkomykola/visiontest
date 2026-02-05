const levels=[
{label:"2/10",mm:8.87},{label:"2/8",mm:7.1},{label:"2/6",mm:5.32},
{label:"2/5",mm:4.43},{label:"2/4",mm:3.55},{label:"2/3",mm:2.66},
{label:"2/2",mm:1.77},{label:"2/1.5",mm:1.33}
];
const pxPerMm=4;

let level=0,trial=0,correct=0,currentDir;

function startVisionTest(){
  mainPage.style.display="none";
  qaSection.style.display="none";
  testWrapper.style.display="flex";
  prepVision(1);
}

function startAstigmatism(){
  startVisionTest(); // одинаковая подготовка
}

function prepVision(step){
  const steps=[
    "Prepare for the test. Remove glasses.",
    "Increase brightness and press F11.",
    "Keep device at arm’s length."
  ];
  if(step<=3){
    app.innerHTML=`
      <p>${steps[step-1]}</p>
      <button onclick="prepVision(${step+1})">Next</button>`;
  }else{
    app.innerHTML=`
      <div class="face">
        <div class="eye"><div class="pupil"></div></div>
        <div class="eye"><div class="pupil"></div></div>
      </div>
      <p>Cover your left eye</p>
      <button onclick="startTest()">Start Test</button>`;
  }
}

function startTest(){
  level=trial=correct=0;
  app.innerHTML=`
    <div id="eContainer"></div>
    <div class="controls">
      <div class="e-button" onclick="answer('up')"></div>
      <div class="e-button" onclick="answer('right')"></div>
      <div class="e-button" onclick="answer('left')"></div>
      <div class="e-button" onclick="answer('down')"></div>
    </div>`;
  nextE();
}

function nextE(){
  currentDir=["up","down","left","right"][Math.floor(Math.random()*4)];
  drawE(eContainer,levels[level].mm*pxPerMm,currentDir);
}

function drawE(target,size,dir){
  target.innerHTML="";
  const e=document.createElement("div");
  e.style.width=e.style.height=size+"px";
  e.style.position="relative";
  const s=size/5;

  [
    {t:0,l:0,w:size,h:s},
    {t:size/2-s/2,l:0,w:size*0.8,h:s},
    {b:0,l:0,w:size,h:s},
    {t:0,l:0,w:s,h:size}
  ].forEach(b=>{
    const bar=document.createElement("div");
    bar.className="bar";
    Object.assign(bar.style,{
      top:b.t!=null?b.t+"px":"auto",
      bottom:b.b!=null?b.b+"px":"auto",
      left:b.l+"px",
      width:b.w+"px",
      height:b.h+"px"
    });
    e.appendChild(bar);
  });

  e.style.transform={
    up:"rotate(0deg)",
    right:"rotate(90deg)",
    down:"rotate(180deg)",
    left:"rotate(270deg)"
  }[dir];

  target.appendChild(e);
}

function answer(d){
  if(d===currentDir) correct++;
  trial++;
  if(trial>=3){
    if(correct>=2 && level<levels.length-1){
      level++;
    }else{
      app.innerHTML=`<p>Result: ${levels[level].label}</p>`;
      return;
    }
    trial=correct=0;
  }
  nextE();
}
