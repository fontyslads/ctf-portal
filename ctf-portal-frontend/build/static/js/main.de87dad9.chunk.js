(this["webpackJsonpctf-portal"]=this["webpackJsonpctf-portal"]||[]).push([[0],{37:function(e,t,n){},47:function(e,t,n){},49:function(e,t,n){},73:function(e,t,n){"use strict";n.r(t);var a,c=n(0),r=n.n(c),i=n(5),s=n.n(i),u=(n(47),n(48),n(9)),l=n(10),o=n(17),d=n(15),f=(n(49),n(14)),h=n(4),b=n.n(h),p=n(11),j=n(8);!function(e){e.Red="Red",e.Blue="Blue"}(a||(a={}));var m=a,v=n(13),g=n.n(v),x=g.a.CancelToken,O=function(){function e(){Object(u.a)(this,e)}return Object(l.a)(e,null,[{key:"get",value:function(t){return e.cancel&&e.cancel(),this.api.get(t,{cancelToken:new x((function(t){e.cancel=t}))}).then((function(e){return e.data})).catch((function(e){if(!g.a.isCancel(e))return e.response?e.response:void 0}))}},{key:"post",value:function(t,n){return e.cancel&&e.cancel(),this.api.post(t,n,{cancelToken:new x((function(t){e.cancel=t}))}).then((function(e){return e.data})).catch((function(e){if(!g.a.isCancel(e)&&e.response)throw e.response}))}},{key:"put",value:function(t,n){return e.cancel&&e.cancel(),this.api.put(t,n,{cancelToken:new x((function(t){e.cancel=t}))}).then((function(e){return e})).catch((function(e){if(!g.a.isCancel(e))return e.response?e.response:void 0}))}},{key:"delete",value:function(t,n){return e.cancel&&e.cancel(),this.api.delete(t,{data:n,cancelToken:new x((function(t){e.cancel=t}))}).then((function(e){return e})).catch((function(e){if(!g.a.isCancel(e))return e.response?e.response:void 0}))}}]),e}();O.cancel=void 0,O.api=g.a.create({baseURL:"http://172.16.1.19:5000"});var y=O;function w(e){return k.apply(this,arguments)}function k(){return(k=Object(p.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",y.get("/flag/".concat(t)).then((function(e){return e})).catch((function(e){throw e})));case 1:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function C(e,t){return N.apply(this,arguments)}function N(){return N=Object(p.a)(b.a.mark((function e(t,n){var a,c=arguments;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=c.length>2&&void 0!==c[2]?c[2]:"Blue",e.abrupt("return",y.post("/flag/submit",{id:t,hash:n,team:a}).then((function(e){return e})).catch((function(e){throw e})));case 2:case"end":return e.stop()}}),e)}))),N.apply(this,arguments)}var S,F=Object(j.b)("flag/listFlags",Object(p.a)(b.a.mark((function e(){var t,n=arguments;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=n.length>0&&void 0!==n[0]?n[0]:m.Blue,e.next=3,w(t);case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}}),e)})))),A=Object(j.b)("flag/submitFlag",function(){var e=Object(p.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,C(t.id,t.value);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),B=Object(j.c)({name:"flag",initialState:{flags:[]},reducers:{},extraReducers:function(e){e.addCase(F.fulfilled,(function(e,t){e.flags=t.payload})).addCase(A.fulfilled,(function(e,t){e.flags=e.flags.map((function(e){return e.id===t.payload.id&&(e=t.payload),e}))}))}}).reducer,T=n(37),R=n.n(T),I=n(16),V=n(76),D=n(75),E=n(19),H=n(1),J=function(e){Object(o.a)(n,e);var t=Object(d.a)(n);function n(e){var a;return Object(u.a)(this,n),(a=t.call(this,e)).state={value:""},a.handleChange=a.handleChange.bind(Object(E.a)(a)),a.handleSubmit=a.handleSubmit.bind(Object(E.a)(a)),a}return Object(l.a)(n,[{key:"handleChange",value:function(e){this.setState({value:e.target.value})}},{key:"handleSubmit",value:function(e){var t={id:this.props.flag.id,value:this.state.value};this.props.submitFlagAsync(t),e.preventDefault()}},{key:"render",value:function(){return Object(H.jsxs)("form",{className:"flex gap-2",onSubmit:this.handleSubmit,children:[Object(H.jsxs)("div",{className:"flex",children:[Object(H.jsx)("div",{children:"TODO: CAPTCHA"}),Object(H.jsx)("span",{className:"text-sm border border-2 rounded-l px-4 py-2 bg-gray-300 whitespace-no-wrap",children:"Flag:"}),Object(H.jsx)("input",{name:"field_name",className:"text-black border border-2 rounded-r px-4 py-2 w-full",type:"text",placeholder:"YoUr FlAg HeRe",onChange:this.handleChange,value:this.state.value})]}),Object(H.jsx)(V.a,{type:"submit",children:"Submit"})]})}}]),n}(r.a.Component),L=Object(f.b)(null,{submitFlagAsync:A})(J);!function(e){e.Valid="Valid",e.Invalid="Invalid",e.NotSubmitted="NotSubmitted"}(S||(S={}));var P=S,U=function(e){var t=Object(c.useState)(!1),n=Object(I.a)(t,2),a=n[0],r=n[1];function i(){switch(e.flag.status){case P.Invalid:return"bg-red-500";case P.Valid:return"bg-green-500";default:return"bg-gray-300"}}return Object(H.jsxs)("div",{className:"flex md:contents",children:[Object(H.jsxs)("div",{className:"col-start-2 col-end-4 mr-10 md:mx-auto relative",children:[Object(H.jsx)("div",{className:"h-full w-6 flex items-center justify-center",children:Object(H.jsx)("div",{className:"".concat(i()," h-full w-1 pointer-events-none")})}),Object(H.jsx)("div",{className:"".concat(i()," w-6 h-6 absolute top-1/2 -mt-3 rounded-full shadow text-center"),children:Object(H.jsx)("i",{className:"fas fa-check-circle text-white"})})]}),Object(H.jsxs)("div",{className:"".concat(i()," \n          col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full"),children:[Object(H.jsxs)("h3",{className:"font-semibold text-lg mb-1",children:["Flag ",e.flag.id]}),Object(H.jsx)("p",{className:"leading-tight text-justify w-full",children:e.flag.description}),Object(H.jsx)(V.a,{onClick:function(){return r(!a)},"aria-controls":"example-collapse-text","aria-expanded":a,children:"click"}),Object(H.jsx)(D.a,{in:a,children:Object(H.jsx)("div",{children:Object(H.jsx)(L,{flag:e.flag})})})]})]})},W=function(e){Object(o.a)(n,e);var t=Object(d.a)(n);function n(e){var a;return Object(u.a)(this,n),(a=t.call(this,e)).props.listFlagsAsync(),a}return Object(l.a)(n,[{key:"getFlagCards",value:function(){var e=[];return(this.props.flags||[]).forEach((function(t,n){e.push(Object(H.jsx)(U,{flag:t},n))})),e}},{key:"render",value:function(){return Object(H.jsx)("div",{className:R.a.FlagList,children:Object(H.jsxs)("div",{className:"p-4 mt-4",children:[Object(H.jsx)("h1",{className:"text-4xl text-center font-semibold mb-6",children:"Blue Team"}),Object(H.jsx)("div",{className:"container",children:Object(H.jsx)("div",{className:"flex flex-col md:grid grid-cols-12 text-gray-50",children:this.getFlagCards()})})]})})}}]),n}(r.a.Component),M=Object(f.b)((function(e){return{flags:e.flag.flags}}),{listFlagsAsync:F})(W),Y=function(e){Object(o.a)(n,e);var t=Object(d.a)(n);function n(){return Object(u.a)(this,n),t.apply(this,arguments)}return Object(l.a)(n,[{key:"render",value:function(){return Object(H.jsx)("div",{className:"App",children:Object(H.jsx)(M,{})})}}]),n}(r.a.Component),$=Y;function _(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return new Promise((function(t){return setTimeout((function(){return t({data:e})}),500)}))}var q=Object(j.b)("counter/fetchCount",function(){var e=Object(p.a)(b.a.mark((function e(t){var n;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,_(t);case 2:return n=e.sent,e.abrupt("return",n.data);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),z=Object(j.c)({name:"counter",initialState:{value:0,status:"idle"},reducers:{increment:function(e){e.value+=1},decrement:function(e){e.value-=1},incrementByAmount:function(e,t){e.value+=t.payload}},extraReducers:function(e){e.addCase(q.pending,(function(e){e.status="loading"})).addCase(q.fulfilled,(function(e,t){e.status="idle",e.value+=t.payload}))}}),G=z.actions,K=(G.increment,G.decrement,G.incrementByAmount,z.reducer),Q=Object(j.a)({reducer:{counter:K,flag:B}});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(Object(H.jsx)(r.a.StrictMode,{children:Object(H.jsx)(f.a,{store:Q,children:Object(H.jsx)($,{})})}),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[73,1,2]]]);
//# sourceMappingURL=main.de87dad9.chunk.js.map