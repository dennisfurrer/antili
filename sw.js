self.addEventListener('install',function(e){e.waitUntil(self.skipWaiting());});
self.addEventListener('activate',function(e){e.waitUntil(clients.claim());});

function makeIcon(size){
  var pad=0.12,sc=size*(1-2*pad)/100,cx=size/2,cy=size/2;
  var canvas=new OffscreenCanvas(size,size);
  var ctx=canvas.getContext('2d');
  ctx.fillStyle='#06080c'; ctx.fillRect(0,0,size,size);
  ctx.strokeStyle='#56d6c6'; ctx.lineCap='round';
  function p(x){return cx+(x-50)*sc;}
  function q(y){return cy+(y-50)*sc;}
  ctx.globalAlpha=0.65; ctx.lineWidth=1.2*sc;
  ctx.beginPath(); ctx.arc(cx,cy,40*sc,0,Math.PI*2); ctx.stroke();
  ctx.globalAlpha=1; ctx.lineWidth=1.6*sc;
  ctx.beginPath(); ctx.arc(cx,cy,20*sc,0,Math.PI*2); ctx.stroke();
  ctx.lineWidth=1.4*sc;
  [[50,6,50,26],[50,74,50,94],[6,50,26,50],[74,50,94,50]].forEach(function(a){
    ctx.beginPath(); ctx.moveTo(p(a[0]),q(a[1])); ctx.lineTo(p(a[2]),q(a[3])); ctx.stroke();
  });
  ctx.fillStyle='#56d6c6';
  ctx.beginPath(); ctx.arc(cx,cy,2.6*sc,0,Math.PI*2); ctx.fill();
  return canvas.convertToBlob({type:'image/png'});
}

self.addEventListener('fetch',function(event){
  var path=new URL(event.request.url).pathname;
  var isIcon=path.indexOf('icon-')!==-1||path.indexOf('apple-touch-icon')!==-1;
  if(isIcon){
    var size=path.indexOf('512')!==-1?512:(path.indexOf('apple')!==-1?180:192);
    event.respondWith(
      makeIcon(size).then(function(blob){
        return new Response(blob,{headers:{'Content-Type':'image/png','Cache-Control':'public,max-age=86400'}});
      }).catch(function(){return fetch(event.request);})
    );
    return;
  }
  event.respondWith(fetch(event.request));
});
