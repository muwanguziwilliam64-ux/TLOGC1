var WA="256787957439";
// OPTIONAL: paste a Formspree URL (https://formspree.io/f/xxxx) to also get submissions by email
var FORMSPREE="";
function val(id){return document.getElementById(id).value.trim()}
function wire(id,msgId,title,fields){
  var f=document.getElementById(id);if(!f)return;
  f.addEventListener("submit",function(e){e.preventDefault();
    var lines=[title],data={};fields.forEach(function(x){var v=val(x[0]);data[x[1]]=v;lines.push(x[1]+": "+v)});
    var m=document.getElementById(msgId);
    if(FORMSPREE){fetch(FORMSPREE,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(data)}).catch(function(){})}
    m.textContent=id==="testi"?"Thank you. May God bless you! (Press Send in WhatsApp to finish.)":"Opening WhatsApp to send to the church. Press Send there to finish.";
    window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(lines.join("\n")),"_blank");f.reset();});}
wire("prayer","pm","PRAYER REQUEST",[["pn","Name"],["pa","Address"],["pp","Phone"],["pr","Prayer Request"]]);
wire("giveF","gm","GIVING CONFIRMATION",[["gn","Name"],["gp","Phone"],["gt","Type"],["ga","Amount (UGX)"],["gr","Sent to"],["gx","Transaction ID"]]);
document.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(){var n=b.getAttribute("data-c"),m=document.getElementById("cm");
  try{navigator.clipboard.writeText(n).then(function(){m.textContent="Copied "+n},function(){m.textContent="Number: "+n})}catch(e){m.textContent="Number: "+n}}});


// TESTIMONIES: thank-you + WhatsApp buttons for each church number
var WAN=[["Website Manager","256787957439"],["Adhier Monica","256774973503"],["Abbo Brenda","256708535015"],["Giramia Peace","256762464828"]];
(function(){var f=document.getElementById("testi");if(!f)return;
 f.addEventListener("submit",function(e){e.preventDefault();
  var d=[["Name",val("tn")],["From",val("tf")],["Contact",val("tc")],["Challenge before prayers",val("tb")],["Testimony after prayers",val("ta")]];
  var txt="TESTIMONY\n"+d.map(function(x){return x[0]+": "+x[1]}).join("\n");
  document.getElementById("tm").textContent="Thank you. May God bless you!";
  document.getElementById("wa4").innerHTML="<p>Please send your testimony to the church on WhatsApp (tap each button, then press Send):</p>"+WAN.map(function(w){return '<a class="wab" href="https://wa.me/'+w[1]+'?text='+encodeURIComponent(txt)+'" target="_blank" rel="noopener">WhatsApp '+w[0]+'</a>'}).join("");
  if(FORMSPREE){var o={};d.forEach(function(x){o[x[0]]=x[1]});fetch(FORMSPREE,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(o)}).catch(function(){})}
  f.reset();});})();
