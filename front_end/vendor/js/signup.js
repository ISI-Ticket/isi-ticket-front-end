window.onload = setData();

function setData(){
    document.getElementById("email").value = localStorage.getItem('email');
    document.getElementById("firstname").value = localStorage.getItem('firstname');
    document.getElementById("lastname").value = localStorage.getItem('lastname');
}

function register() {
    let email = document.getElementById("email").value;
    let firstname = document.getElementById("firstname").value;
    let lastname  = document.getElementById("lastname").value;
    let nif = document.getElementById("nif").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let zip = document.getElementById("zip").value;
    let data = {email,firstname,lastname,nif,phone,address,city,zip}
    console.log(data);
    fetch('https://isi-ticket-api.herokuapp.com/user/signup', {
        headers: { 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify(data)
    }).then(function (res) {
        return res.json();
    }).then(function (data) {
        console.log(JSON.stringify(data));
        let response = JSON.stringify(data);
        localStorage.setItem('profile', response);
        window.location.href = './perfil.html';
    });
}