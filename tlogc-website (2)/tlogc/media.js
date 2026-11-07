var ADMIN_HASH="56cb49bae90710c84263358fee82597a9b086e6f30f106f265f6a40f1e6edbd1"; // password hash - use "Change password" on the admin page to make a new one
function sha(s){return crypto.subtle.digest("SHA-256",new TextEncoder().encode("tlogc|"+s)).then(function(b){return Array.from(new Uint8Array(b)).map(function(x){return("0"+x.toString(16)).slice(-2)}).join("")})}
function $(i){return document.getElementById(i)}
function idb(){return new Promise(function(res,rej){var r=indexedDB.open("tlogc",1);r.onupgradeneeded=function(){r.result.createObjectStore("photos",{keyPath:"id"})};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej()}})}
function allPhotos(){return idb().then(function(db){return new Promise(function(res){var q=db.transaction("photos").objectStore("photos").getAll();q.onsuccess=function(){res(q.result||[])};q.onerror=function(){res([])}})}).catch(function(){return[]})}
function addPhoto(blob,name){return idb().then(function(db){return new Promise(function(res){var t=db.transaction("photos","readwrite");t.objectStore("photos").put({id:Date.now()+Math.random(),name:name,blob:blob});t.oncomplete=res})})}
function delPhoto(id){return idb().then(function(db){return new Promise(function(res){var t=db.transaction("photos","readwrite");t.objectStore("photos").delete(id);t.oncomplete=res})})}
function shrink(f){return new Promise(function(res){var im=new Image(),u=URL.createObjectURL(f);im.onload=function(){var s=Math.min(1,1280/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*s;c.height=im.height*s;c.getContext("2d").drawImage(im,0,0,c.width,c.height);c.toBlob(function(b){res(b||f)},"image/jpeg",.82)};im.onerror=function(){res(f)};im.src=u})}
function yts(){try{return JSON.parse(localStorage.getItem("yt_links")||"[]")}catch(e){return[]}}
function ytId(u){var m=String(u).match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/);return m?m[1]:null}
function ytHtml(id){return '<div class="video" style="margin:12px 0"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'" referrerpolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>'}
// PHOTO ALBUM
if($("pg")){
  fetch("gallery.json").then(function(r){return r.json()}).catch(function(){return[]}).then(function(list){
    var h=list.map(function(s){return '<img src="'+s+'" alt="TLOGC" loading="lazy">'}).join("");
    allPhotos().then(function(ps){ps.forEach(function(p){h+='<img src="'+URL.createObjectURL(p.blob)+'" alt="'+p.name+'" loading="lazy">'});$("pg").innerHTML=h;
      $("pg").querySelectorAll("img").forEach(function(i){i.onclick=function(){$("lbi").src=i.src;$("lb").style.display="flex"}})})});
  $("lb").onclick=function(){$("lb").style.display="none"};
}
// VIDEOS
if($("lv")){
  fetch("videos.json").then(function(r){return r.json()}).catch(function(){return[]}).then(function(v){
    $("lv").innerHTML=v.map(function(x){return '<h3>'+x.title+'</h3><video controls playsinline preload="metadata" style="width:100%;border-radius:8px" src="'+x.file+'"></video>'}).join("")});
  $("yv").innerHTML=yts().map(ytHtml).join("");
}
// ADMIN
if($("gate")){
  function open_(){$("gate").style.display="none";$("adm").style.display="block";rl();ry()}
  if(sessionStorage.getItem("adm")==="1")open_();
  $("go").onclick=function(){
    var lk=+localStorage.getItem("adm_lock")||0,now=Date.now();
    if(lk>now){$("gm").textContent="Too many attempts. Try again in "+Math.ceil((lk-now)/60000)+" minute(s).";return}
    if(!window.crypto||!crypto.subtle){$("gm").textContent="Open this site over https to use the admin page.";return}
    sha($("pin").value).then(function(h){
      if(h===ADMIN_HASH){localStorage.removeItem("adm_try");sessionStorage.setItem("adm","1");open_();if(typeof rtl==="function")rtl()}
      else{var n=(+localStorage.getItem("adm_try")||0)+1;localStorage.setItem("adm_try",n);
        if(n>=5){localStorage.setItem("adm_lock",Date.now()+300000);localStorage.setItem("adm_try",0);$("gm").textContent="Too many attempts. Locked for 5 minutes."}
        else $("gm").textContent="Wrong password. "+(5-n)+" attempt(s) left."}})};
  $("pin").addEventListener("keydown",function(e){if(e.key==="Enter")$("go").click()});
  $("npb").onclick=function(){var p=$("np").value;if(p.length<8){$("npo").value="Use at least 8 characters.";return}
    sha(p).then(function(h){$("npo").value='var ADMIN_HASH="'+h+'";'})};
  function rl(){allPhotos().then(function(ps){$("pl").innerHTML=ps.map(function(p){return '<div><img src="'+URL.createObjectURL(p.blob)+'"><button data-i="'+p.id+'">Delete</button></div>'}).join("");
    $("pl").querySelectorAll("button").forEach(function(b){b.onclick=function(){delPhoto(parseFloat(b.dataset.i)).then(rl)}})})}
  $("pu").onclick=function(){var fs=$("pf").files;if(!fs.length){$("pm").textContent="Choose photos first.";return}
    var c=Promise.resolve(),n=0;Array.from(fs).forEach(function(f){c=c.then(function(){return shrink(f)}).then(function(b){return addPhoto(b,f.name)}).then(function(){n++;$("pm").textContent="Added "+n+" of "+fs.length})});
    c.then(function(){$("pf").value="";rl()})};
  function ry(){$("yll").innerHTML=yts().map(function(id,i){return '<div class="num"><span>youtu.be/'+id+'</span><button data-i="'+i+'">Delete</button></div>'}).join("");
    $("yll").querySelectorAll("button").forEach(function(b){b.onclick=function(){var a=yts();a.splice(+b.dataset.i,1);localStorage.setItem("yt_links",JSON.stringify(a));ry()}})}
  $("yu").onclick=function(){var id=ytId($("yl").value);if(!id)return;var a=yts();a.push(id);localStorage.setItem("yt_links",JSON.stringify(a));$("yl").value="";ry()};
}

// TESTIMONY WALL (approved testimonies from testimonies.json + this device's admin list)
function tlocal(){try{return JSON.parse(localStorage.getItem("approved_t")||"[]")}catch(e){return[]}}
function tesc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function thtml(x){return '<div class="tw"><b>'+tesc(x.name)+'</b> &middot; '+tesc(x.from)+'<br><u>Challenge:</u> '+tesc(x.challenge)+'<br><u>Testimony:</u> '+tesc(x.testimony)+'</div>'}
if($("wall")){fetch("testimonies.json").then(function(r){return r.json()}).catch(function(){return[]}).then(function(a){var all=a.concat(tlocal());if(all.length)$("wall").innerHTML=all.slice().reverse().map(thtml).join("")})}
if($("tadd")){
  function rtl(){var a=tlocal();$("tl").innerHTML=a.map(function(x,i){return thtml(x)+'<button data-i="'+i+'">Remove</button>'}).join("");
    $("tl").querySelectorAll("button").forEach(function(b){b.onclick=function(){var a=tlocal();a.splice(+b.dataset.i,1);localStorage.setItem("approved_t",JSON.stringify(a));rtl()}});
    $("tj").value=JSON.stringify(a,null,1)}
  $("tadd").onclick=function(){var o={name:$("an").value.trim(),from:$("af").value.trim(),challenge:$("ac").value.trim(),testimony:$("at").value.trim()};if(!o.name||!o.testimony)return;
    var a=tlocal();a.push(o);localStorage.setItem("approved_t",JSON.stringify(a));["an","af","ac","at"].forEach(function(i){$(i).value=""});rtl()};
  if(sessionStorage.getItem("adm")==="1")rtl();$("go").addEventListener("click",function(){setTimeout(rtl,50)});
}
