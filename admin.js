import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getDatabase,

ref,

push,

update,

remove,

onValue

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig={

apiKey:"AIzaSyA_qDc-FbKjLGUF0YTJBQMiLE8sbw8mpGI",

authDomain:"zerohub2010.firebaseapp.com",

databaseURL:"https://zerohub2010-default-rtdb.firebaseio.com",

projectId:"zerohub2010",

storageBucket:"zerohub2010.firebasestorage.app",

messagingSenderId:"10761752021",

appId:"1:10761752021:web:891c5494e298f2c21e815c"

};

const app=initializeApp(firebaseConfig);

const db=getDatabase(app);

const productsRef=ref(db,"products_v2");

const form=document.getElementById("productForm");

const list=document.getElementById("productList");

let editId=null;
export function loadProducts(){

onValue(productsRef,(snapshot)=>{

const data=snapshot.val();

if(!list)return;

list.innerHTML="";

if(!data)return;

Object.keys(data).reverse().forEach(id=>{

const p=data[id];

list.innerHTML+=`

<div class="product-item">

<img src="${p.image}" width="60">

<div>

<b>${p.title}</b><br>

<small>${p.version} • ${p.category}</small>

</div>

<div>

<button onclick="editProduct('${id}')">

Edit

</button>

<button onclick="deleteProduct('${id}')">

Delete

</button>

</div>

</div>

`;

});

});

}
window.editProduct=function(id){

editId=id;

alert("Қисми пурраи Edit баъдтар пайваст мешавад.");

};

window.deleteProduct=function(id){

if(!confirm("Ин маҳсулот нест карда шавад?")) return;

remove(ref(db,"products_v2/"+id));

};

form?.addEventListener("submit",(e)=>{

e.preventDefault();

const product={

title:document.getElementById("title").value,

category:document.getElementById("category").value,

version:document.getElementById("version").value,

size:document.getElementById("size").value,

image:document.getElementById("image").value,

screen1:document.getElementById("screen1").value,

screen2:document.getElementById("screen2").value,

screen3:document.getElementById("screen3").value,

video:document.getElementById("video").value,

link:document.getElementById("link").value,

description:document.getElementById("description").value,

views:0,

downloads:0,

date:new Date().toLocaleDateString()

};
if(editId){

update(ref(db,"products_v2/"+editId),product)

.then(()=>{

alert("Маҳсулот навсозӣ шуд.");

editId=null;

form.reset();

});

}else{

push(productsRef,product)

.then(()=>{

alert("Маҳсулот илова шуд.");

form.reset();

});

}

});

loadProducts();
window.logout=function(){

localStorage.removeItem("zerohub_login");

window.location.href="login.html";

};

window.addEventListener("online",()=>{

console.log("Firebase Connected");

});

window.addEventListener("offline",()=>{

alert("Интернет қатъ шудааст!");

});

console.log("ZEROHUB admin.js Loaded");
