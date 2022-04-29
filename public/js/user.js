// const URL = "http://localhost:9000";

// let tbody = document.querySelector('#user-result');

// function createTable(users) {
//     tbody.innerHTML = "";

//     //creation du table pour le dom
//     users.forEach(user=>{
//         let tr = document.createElement('tr');
        
//         tr.innerHTML = `
//                         <td>${user.Id}</td>
//                         <td>${user.Email}</td>
//                         <td>${user.FirstName}</td>
//                         <td>${user.LastName}</td>
//                        `
//         let td = document.createElement('td');
//         if(user.Role === "admin") {
//             td.innerHTML = `
//                             <select>
//                                 <option value="admin" selected>Admin</option>
//                                 <option value="user">User</option>
//                             </select>'
//                            `
//         } else {
//             td.innerHTML = `
//                             <select class="chooseRole">
//                                 <option value="admin">Admin</option>
//                                 <option value="user" selected>User</option>
//                             </select>
//                            `
//         }
//         tr.append(td);        
//         tbody.append(tr);
//         let choose = td.querySelector('select');
//         // ajout d'un listener lorsque le select est injecté dans le dom
//         choose.addEventListener('change', function(e) { 
//             console.log(this.value);
//             // fetch post pour changer le rôle de l'utilisateur
//             changeAjaxPostUserRole(this.value, user.Id) 
//         });
//     })  
// }

// function changeAjaxPostUserRole(value, id) {
//     // récupération des données du select
//     const data = {
//         role: value
//     }
//     const dataString = JSON.stringify(data);
//     // envoie du fetch post vers la bonne route pour enregistrer dans la bdd
//     fetch(`${URL}/admin/users_list/update/${id}`,
//         {
//             method: "POST",
//             body: dataString,
//             headers: new Headers({ "Content-Type": "application/json" })
//         }
//     ).then((res)=>{
//         return res.json();
//     }).then((data)=>{ 
//         let msg = document.querySelector('#msg'); 
        
//         if(data.status === 200) {
//             msg.textContent = data.msg;
//         }
//     }).catch(err=>{
//         console.log(err);
//     })
// }


// document.addEventListener('DOMContentLoaded', () => {
//     fetch(`${URL}/admin/users_list/all`)
//     .then(res=>{
//         return res.json();
//     }).then(res => {
//         createTable(res);
//     })      
// })

const URL = "http://localhost:9000";
const table = document.querySelector('#userStatus');


const creaDomElem = (elem, type, designation) => {
   if (typeof type === 'undefined' && typeof designation === 'undefined') {
      const elementDom = document.createElement(elem);
      return elementDom;
   };
   const elementDom = document.createElement(elem);
   elementDom.setAttribute(type, designation);
   return elementDom;
};


const createDOM = (array) => {

   array.forEach(elem => {

      const tr = creaDomElem('tr');

      const tdMail = creaDomElem('td');
      tdMail.textContent = elem.Email;
      tr.append(tdMail);

      const tdFirstName = creaDomElem('td');
      tdFirstName.textContent = elem.FirstName;
      tr.append(tdFirstName);

      const tdLastName = creaDomElem('td');
      tdLastName.textContent = elem.LastName;
      tr.append(tdLastName);

      const tdRole = creaDomElem('td');
      tdRole.textContent = elem.Role;
      tr.append(tdRole);

      const select = creaDomElem('select')
      select.innerHTML = `
      <option value="admin" selected>Admin</option>
      <option value="user">User</option>`;

      
      tr.append(select);
      table.append(tr);

      select.addEventListener('change', function (e) {
         console.log(this.value);
         
         // updateStatus(this.value, elem.Id);
      });

   });
};


const updateStatus = (value, id) => {
   
   const data = {
      role: value
   }
   const dataString = JSON.stringify(data);
   
   fetch(`${URL}/admin/users_list/update/${id}`,
      {
         method: "POST",
         body: dataString,
         headers: new Headers({ "Content-Type": "application/json" })
      }
   
   ).then((res) => {
      return res.json();
   }).catch(err => {
      console.log(err);
   });
};



document.addEventListener('DOMContentLoaded', () => {
   fetch(`${URL}/admin/users_list/all`)
      .then(res => {
         return res.json();
      }).then(res => {
         console.log(res);
         createDOM(res);
      });
});
