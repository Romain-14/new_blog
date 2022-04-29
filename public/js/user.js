const URL = "https://blog-mvc-ro.herokuapp.com";

let tbody = document.querySelector('#user-result');

function createTable(users) {
    tbody.innerHTML = "";

    //creation du table pour le dom
    users.forEach(user=>{
        let tr = document.createElement('tr');
        
        tr.innerHTML = `
                        <td>${user.Id}</td>
                        <td>${user.Email}</td>
                        <td>${user.FirstName}</td>
                        <td>${user.LastName}</td>
                       `
        let td = document.createElement('td');
        if(user.Role === "admin") {
            td.innerHTML = `
                            <select>
                                <option value="admin" selected>Admin</option>
                                <option value="user">User</option>
                            </select>'
                           `
        } else {
            td.innerHTML = `
                            <select class="chooseRole">
                                <option value="admin">Admin</option>
                                <option value="user" selected>User</option>
                            </select>
                           `
        }
        tr.append(td);        
        tbody.append(tr);
        let choose = td.querySelector('select');
        // ajout d'un listener lorsque le select est injecté dans le dom
        choose.addEventListener('change', function(e) { 
            console.log(this.value);
            // fetch post pour changer le rôle de l'utilisateur
            changeAjaxPostUserRole(this.value, user.Id) 
        });
    })  
}

function changeAjaxPostUserRole(value, id) {
    // récupération des données du select
    const data = {
        role: value
    }
    const dataString = JSON.stringify(data);
    // envoie du fetch post vers la bonne route pour enregistrer dans la bdd
    fetch(`${URL}/admin/users_list/update/${id}`,
        {
            method: "POST",
            body: dataString,
            headers: new Headers({ "Content-Type": "application/json" })
        }
    ).then((res)=>{
        return res.json();
    }).then((data)=>{ 
        let msg = document.querySelector('#msg'); 
        
        if(data.status === 200) {
            msg.textContent = data.msg;
        }
    }).catch(err=>{
        console.log(err);
    })
}


document.addEventListener('DOMContentLoaded', () => {
    fetch(`${URL}/admin/users_list/all`)
    .then(res=>{
        return res.json();
    }).then(res => {
        createTable(res);
    })      
})
