!function(t){var e={};function n(a){if(e[a])return e[a].exports;var r=e[a]={i:a,l:!1,exports:{}};return t[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=t,n.c=e,n.d=function(t,e,a){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(a,r,function(e){return t[e]}.bind(null,r));return a},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e);n(1);var a=[{product:"手机",region:"华东",sale:[120,100,140,160,180,185,190,210,230,245,255,270]},{product:"手机",region:"华北",sale:[80,70,90,110,130,145,150,160,170,185,190,200]},{product:"手机",region:"华南",sale:[220,200,240,250,260,270,280,295,310,335,355,380]},{product:"笔记本",region:"华东",sale:[50,60,80,110,30,20,70,30,420,30,20,20]},{product:"笔记本",region:"华北",sale:[30,35,50,70,20,15,30,50,710,130,20,20]},{product:"笔记本",region:"华南",sale:[80,120,130,140,70,75,120,90,550,120,110,100]},{product:"智能音箱",region:"华东",sale:[10,30,4,5,6,5,4,5,6,5,5,25]},{product:"智能音箱",region:"华北",sale:[15,50,15,15,12,11,11,12,12,14,12,40]},{product:"智能音箱",region:"华南",sale:[10,40,10,6,5,6,8,6,6,6,7,26]}];const r={region:"地区",product:"商品"},i=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];class o{constructor(t){this.data=JSON.parse(t)}getOptionsData(){return this.optsObj=this.data.reduce((t,e)=>{for(let n in e)e.hasOwnProperty(n)&&(t.hasOwnProperty(n)?-1===t[n].options.indexOf(e[n])&&t[n].options.push(e[n]):"sale"!==n&&(t[n]={},t[n].options=[e[n]],t[n].title=r[n]?r[n]:""));return t},{}),this.optsObj}searchData(t){let e=this;for(let e in t)if(t.hasOwnProperty(e)&&0===t[e].length)return;return 1===t.region.length?n([e.data,t,["region","product"]]):n([e.data,t,["product","region"]]);function n([t,e,n]){let a={};return a.title=n.reduce((t,e)=>(t.push(r[e]?r[e]:e),t),[]).concat(i),a.body=[],function t({orderIdx:a=0,ctArr:r,data:i}){e[n[a]].forEach(e=>{let o={name:n[a],val:e};if(a===n.length-1){let t=i.find(t=>t[n[a]]===e);o.sale=t.sale,r.push(o)}else{o.options=[],r.push(o);let s=i.filter(t=>t[n[a]]===e);t({orderIdx:a+1,ctArr:o.options,data:s})}})}({ctArr:a.body,data:t}),a}}}const s={title:"title",checkAll:"check-all",checkAllChosen:"check-all_chosen",option:"option",optionChosen:"option_chosen"};class l{constructor(t){this.$container=document.querySelector(t),this.addEventListener(),this.handler=[]}render(t){this.optsObj=t;for(let n in t)t.hasOwnProperty(n)&&(this.$container.innerHTML=this.$container.innerHTML+e(t,n));function e(t,e){return`<div class="${e}">\n\t\t\t\t<p class="${s.title}">${t[e].title}</p>\n\t\t\t\t<a href="javascript:;" class="${s.checkAll}" data-class-trigger="${s.checkAllChosen}">全选</a>\n\t\t\t\t${function(t){return t.reduce((t,e)=>t+`<a href="javascript:;" class="${s.option}" data-class-trigger="${s.optionChosen}">${e}</a>`,"")}(t[e].options)}\n\t\t\t</div>`}}addEventListener(){let t=this;this.$container.addEventListener("click",e=>{let n=e.target;if("A"===n.tagName){let e=n.parentNode,r=n.className;if(-1!==r.indexOf(s.checkAll)){if(r===s.checkAll){let r=e.querySelectorAll("."+s.option);a(n),Array.from(r).forEach(t=>{a(t)}),t.emit("changed",t)}}else if(r===s.optionChosen){let r=e.querySelector("."+s.checkAllChosen);if(1===e.querySelectorAll("."+s.optionChosen).length)return;a(n),r&&a(r),t.emit("changed",t)}else{a(n);let r=e.querySelectorAll("."+s.option),i=e.querySelector("."+s.checkAll);0===r.length&&a(i),t.emit("changed",t)}}function a(t){let e=t.dataset.classTrigger;t.dataset.classTrigger=t.className,t.className=e}})}getChosenOptionsData(){let t=this.$container.querySelectorAll("div");return Array.from(t).reduce((t,e)=>{let n=e.querySelectorAll("."+s.optionChosen),a=Array.from(n).reduce((t,e)=>(t.push(e.innerText.trim()),t),[]);return t[e.className]=a,t},{})}watch(t,...e){this.handler[t]||(this.handler[t]=[]),this.handler[t].push(...e)}emit(t,e){this.handler[t]&&this.handler[t].forEach(t=>t(e))}}class c{constructor(t){this.$container=document.querySelector(t),this.$container.innerHTML="选项不足......!",this.handler=[]}render(t){let e=this;t?(this.$container.innerHTML=`<table>\n        <thead><tr>${function(t){return t.reduce((t,e)=>t+`<th>${e}</th>`,"")}(t.title)}</tr></thead>\n        <tbody>${function(t){return function t({data:e,root:n,head:a}){if(e instanceof Array)return e.reduce((e,r,i)=>e+t({data:r,head:a=!!n||0!==i}),"");if(a){if(e.options instanceof Array)return`<tr><th rowspan="${e.options.length}">${e.val}</th>${t({data:e.options})}</tr>`;if(e.sale instanceof Array)return`<tr><th>${e.val}</th>${e.sale.reduce((t,e)=>`${t}<td>${e}</td>`,"")}</tr>`}else{if(e.options instanceof Array)return`<th rowspan="${e.options.length}">${e.val}</th>${t({data:e.options})}`;if(e.sale instanceof Array)return`<th>${e.val}</th>${e.sale.reduce((t,e)=>`${t}<td>${e}</td>`,"")}`}}({data:t,root:!0})}(t.body)}</tbody>\n      </table>`,this.$table=this.$container.querySelector("table"),this.emit("rendered",this),this.$table.addEventListener("mouseover",t=>{e.emit("mouseover",t,e)}),this.$container.addEventListener("mouseout",t=>{e.emit("mouseout",t,e)})):this.$container.innerHTML="选项不足......!"}watch(t,...e){this.handler[t]||(this.handler[t]=[]),this.handler[t].push(...e)}emit(t,...e){this.handler[t]&&this.handler[t].forEach(t=>t(...e))}getRowData(t){let e=this,n=t.querySelectorAll("td"),a=function(t){if(t.length)return Array.from(t).reduce((t,e)=>{let n=Number.parseFloat(e.innerText.trim());return t.push(Number.isNaN(n)?0:n),t},[])}(n),r={category:function(t,n){let a=e.$table.querySelectorAll("thead th"),r=a.length,i=t.querySelectorAll("td").length;return function t(e,n,i=[]){let o=e.children.length;if(o>n){let t=o-n;for(let n=1;n<=t;n++)i.unshift(e.children[t-n].innerText.trim())}return r===o?i.reduce((t,e,n)=>{let r=a[n].innerText.trim();return t.push([r,e]),t},[]):t(e.previousElementSibling,o,i)}(t,i)}(t,n.length),chunk:a};return r}getTableData(){let t=this.$table.querySelectorAll("tbody tr");return Array.from(t).map(t=>this.getRowData(t),this)}}let h={axis:{basePoint:[100,350],x:{line:{},text:{}},y:{line:{length:250,partCount:5,distribut:"endpoint"},text:{}}},bar:{width:40},category:{basePoint:[650,40]}};const u=[5,10,20,50,100,200,300];class d{constructor(t,e){this.$container=document.querySelector(t),h=Object.assign(h,e)}render(t){this.evaluat(t),this.$container.innerHTML=`<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">\n      ${this.generateAxis(t)}\n      ${this.generateBar(t)}\n      ${this.generateCategory(t)}\n    </svg`}evaluat(t){!function(t){let e=t.chunk.concat().sort((t,e)=>e-t)[0],n=h.axis.y.line.partCount,a=h.axis.y.line.length,r=e/n,i=u.find(t=>r<=t);h.axis.y.line.partScaleLength=i,h.bar.scale=a/n/i}(t),function(t){h.axis.x.line.partCount=t.chunk.length+1,h.axis.x.line.partLength=h.bar.width+10,h.axis.x.line.length=h.axis.x.line.partCount*h.axis.x.line.partLength}(t),function(t){let e={length:t.chunk.length},n=h.axis.x.line.partLength;if(h.axis.x.line.markPoint=Array.from(e).map((t,e)=>[h.axis.basePoint[0]+(e+1)*n,h.axis.basePoint[1]]),"endpoint"===h.axis.y.line.distribut){let t=h.axis.y.line.partCount+1,e={length:t},n=h.axis.y.line.length/h.axis.y.line.partCount;h.axis.y.line.markPoint=Array.from(e).map((t,e)=>{let a=h.axis.basePoint[1]-n*e;return[h.axis.basePoint[0],a]})}}(t),"endpoint"===h.axis.y.line.distribut&&(h.axis.y.line.dashedLine=h.axis.y.line.markPoint.reduce((t,e,n)=>(0!==n&&t.push([...e,h.axis.x.line.length]),t),[])),h.axis.y.text.data=h.axis.y.line.markPoint.map((t,e)=>{let n=h.axis.y.line.partScaleLength*e;return[t[0]-10,t[1]+5,n]}),h.axis.x.text.data=h.axis.x.line.markPoint.map((t,e)=>{let n=e+1+"月";return[t[0],t[1]+30,n]}),function(t){let e=-h.bar.width/2;h.bar.data=t.chunk.map((t,n)=>{let a=h.axis.x.line.markPoint[n],r=h.bar.scale*t,i=a[1]-h.bar.scale*t,o=a[0]+e;return[o,i,r]})}(t),function(t){let e=t.category;h.category.data=e.reduce((t,e,n)=>{let a=h.category.basePoint[0],r=h.category.basePoint[1]+25*n;return t.push([a,r,e]),t},[])}(t)}generateAxis(t){return function(t){let e=`M${h.axis.basePoint.join(" ")}`;return`<path class="axis-line" d="${`${e} v ${-h.axis.y.line.length} ${e} h ${h.axis.x.line.length}`+function(){let t="";return t+=h.axis.y.line.markPoint.reduce((t,e)=>`${t} M${e.join(" ")} h -5`,""),t+=h.axis.x.line.markPoint.reduce((t,e)=>`${t} M${e.join(" ")} v 5`,"")}()}"\n      ></path>${function(){return`<path class="axis-dashed-line" d="${h.axis.y.line.dashedLine.reduce((t,e,n)=>t+=`M${e.slice(0,2).join(" ")} h ${e[2]} `,"")}"></path>`}()}`}()+function(t){return`<text class="x-axis-text">\n        ${h.axis.x.text.data.reduce((t,e)=>`${t}<tspan x="${e[0]}" y="${e[1]}" text-anchor="middle">${e[2]}</tspan>`,"")}\n        </text>`+`<text class="y-axis-text">\n        ${h.axis.y.text.data.reduce((t,e)=>`${t}<tspan x="${e[0]}" y="${e[1]}" text-anchor="end">${e[2]}</tspan>`,"")}\n        </text>`}()}generateBar(){return`<g>\n      ${h.bar.data.reduce((t,e)=>`${t}<rect class="chart-bar" x="${e[0]}" y="${e[1]}" height="${e[2]-.5}" width="${h.bar.width}"></rect>`,"")}\n    </g>`}generateCategory(){return`<text class="category">\n      ${h.category.data.reduce((t,e)=>`${t}<tspan x="${e[0]}" y="${e[1]}" text-anchor="start">${e[2].join(": ")}</tspan>`,"")}\n    </text>`}}const x=800,g=400;let p={axis:{basePoint:[65,350],x:{line:{length:550,partCount:11,distribut:"both"},text:{}},y:{line:{length:250,partCount:5,distribut:"both"},text:{}}},line:{},category:{basePoint:[645,40],attrWidth:75,attrHeight:40,textOffset:-45,colorBoxWidth:20}};const f=[5,10,20,50,100,200,300],y=["IndianRed","LawnGreen","RosyBrown","Chocolate","Maroon","DarkGreen","DarkRed","MediumVioletRed","DarkOrange","DarkCyan","SteelBlue","Magenta","Navy","MediumSlateBlue"];class m{constructor(t){this.$container=document.querySelector(t)}render(t){let e=$(`<canvas class="base-axis" width="${x}" height="${g}"></canvas>`);this.$container.appendChild(e),this.ctx=e.getContext("2d"),this.ctx.fillStyle="white",this.ctx.fillRect(0,0,x,g),this.data=t,this.evaluate(t),this.generateAxis(),this.generateLines(),this.generateCategory()}evaluate(t){!function(t){let e=t.map((t,e)=>{let n=t.chunk.concat();return n.sort((t,e)=>e-t),n[0]}).sort((t,e)=>e-t)[0]/p.axis.y.line.partCount,n=f.find(t=>e<t);p.axis.y.line.partScaleLength=n,p.line.scale=p.axis.y.line.length/p.axis.y.line.partCount/n}(t),function(){(function(){if("both"===p.axis.x.line.distribut){let t=p.axis.x.line.partCount+1,e={length:t},n=p.axis.x.line.length/p.axis.x.line.partCount;p.axis.x.line.markPoint=Array.from(e).map((t,e)=>[e*n,0])}})(),function(){if("both"===p.axis.y.line.distribut){let t=p.axis.y.line.partCount+1,e={length:t},n=p.axis.y.line.length/p.axis.y.line.partCount;p.axis.y.line.markPoint=Array.from(e).map((t,e)=>[0,0-e*n])}}()}(),function(t){(function(t){let e=p.axis.x.line,n=0;"both"===e.distribut&&(n=1);p.axis.x.text=e.markPoint.map((t,e)=>{let a=e+n+"月",r=t[0],i=t[1]+30;return[a,r,i]})})(),function(t){let e=p.axis.y.line,n=0;"middle"===e.distribut&&(n=1);p.axis.y.text=e.markPoint.map((t,e)=>{let a=(e+n)*p.axis.y.line.partScaleLength,r=t[0]-10,i=t[1]+5;return[a,r,i]})}()}(),p.axis.y.line.dashedLine=p.axis.y.line.markPoint.reduce((t,e,n)=>{if(0===e[0]&&0===e[1])return t;{let n=[p.axis.x.line.length,e[1]];return t.push([e,n]),t}},[]),function(t){let e=p.axis.x.line.markPoint;t.forEach((t,n)=>{let a=t.chunk;t.chunkPositions=a.map((t,n)=>{let a=e[n][0],r=0-p.line.scale*t;return[a,r]}),t.lineColor=y[n]})}(t),function(t){let e=p.category.attrWidth,n=p.category.attrHeight,a=p.category.textOffset;t.forEach((t,r)=>{let i=r*n,o=[0,i];t.categoryPositions=[[o,t.lineColor]],t.category.forEach((n,r)=>{let o=(r+1)*e+a,s=[o,i];t.categoryPositions.push([s,n[1]])})})}(t)}generateAxis(){let t=this;t.ctx.save(),t.ctx.strokeStyle="#666",t.ctx.lineWidth=1,t.ctx.translate(...p.axis.basePoint),t.ctx.moveTo(p.axis.x.line.length,0),t.ctx.lineTo(0,0),t.ctx.lineTo(0,0-p.axis.y.line.length),t.ctx.stroke(),t.ctx.restore(),function(){t.ctx.save();let e=p.axis.x.line.markPoint,n=p.axis.y.line.markPoint;t.ctx.strokeStyle="#666",t.ctx.lineWidth=1,t.ctx.lineCap="square",t.ctx.translate(...p.axis.basePoint),e.forEach((e,n)=>{t.ctx.moveTo(...e),t.ctx.lineTo(e[0],5)}),t.ctx.stroke(),n.forEach((e,n)=>{t.ctx.moveTo(...e),t.ctx.lineTo(-5,e[1])}),t.ctx.stroke(),t.ctx.restore()}(),function(){let e=p.axis.y.line.dashedLine;t.ctx.save(),t.ctx.translate(...p.axis.basePoint),t.ctx.strokeStyle="#ccc",t.ctx.lineWidth=1,e.forEach((e,n)=>{t.ctx.moveTo(...e[0]),t.ctx.lineTo(...e[1])}),t.ctx.stroke(),t.ctx.restore()}(),function(){let e=p.axis.x.text,n=p.axis.y.text;t.ctx.save(),t.ctx.translate(...p.axis.basePoint),t.ctx.fillStyle="#666",t.ctx.textAlign="center",t.ctx.font="18px sans-serif",e.forEach(e=>t.ctx.fillText(...e)),t.ctx.textAlign="right",n.forEach(e=>t.ctx.fillText(...e)),t.ctx.restore()}()}generateLines(){this.data.forEach(t=>{let e=$(`<canvas width="${x}" height="${g}"></canvas>`);this.$container.appendChild(e),t.element=e,function(t,e){let n=t.getContext("2d");n.save(),n.translate(...p.axis.basePoint),n.strokeStyle=e.lineColor,n.fillStyle="white",e.chunkPositions.forEach((t,e)=>{n.lineTo(...t),0!==e&&(n.moveTo(...t),n.arc(...t,5,0,2*Math.PI,!0)),n.moveTo(...t)}),n.stroke(),n.fill()}(e,t)},this)}generateCategory(t){let e,n=this,a=p.category.colorBoxWidth;if(t)(e=t.getContext("2d")).clearRect(0,0,x,g);else{let t=$(`<canvas class="category" width="${x}" height="${g}"></canvas>`);n.$container.appendChild(t),n.$categoryCanvas=t,e=t.getContext("2d")}e.save(),e.translate(...p.category.basePoint),e.fillStyle="#333",e.font="16px sans-serif",e.strokeStyle="black",e.strokeWidth=1,e.textBaseline="top",n.data.forEach((t,n)=>{"hide"!==t.element.className&&t.categoryPositions.forEach((t,n)=>{0===n?(e.save(),e.fillStyle=t[1],e.fillRect(...t[0],a,a),e.restore()):e.fillText(t[1],...t[0])})}),e.restore()}showSingleLine(t){let e=t.category.sort().toString();this.data.forEach(t=>{let n=t.category.sort().toString();t.element.className=n===e?"":"hide"}),this.generateCategory(this.$categoryCanvas)}showAllLine(){this.data.forEach(t=>{t.element.className=""}),this.generateCategory(this.$categoryCanvas)}}function $(t){let e=document.createElement("div");return e.innerHTML=t,e.children[0]}!function(){let t=new o(JSON.stringify(a)),e=new l(".check-box"),n=new c(".table-box"),r=new d(".bar"),i=new m(".line");e.render(t.getOptionsData()),e.watch("changed",e=>{let a=e.getChosenOptionsData(),r=t.searchData(a);n.render(r)}),n.watch("rendered",t=>{let e=t.getTableData();i.render(e)}),n.watch("mouseover",t=>{if("TBODY"===t.target.parentNode.parentNode.tagName){let e=n.getRowData(t.target.parentNode);e&&(r.render(e),i.showSingleLine(e))}}),n.watch("mouseout",t=>{"TBODY"===t.target.parentNode.parentNode.tagName&&i.showAllLine()})}()},function(t,e){}]);