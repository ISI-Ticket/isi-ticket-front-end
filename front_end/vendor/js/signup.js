window.onload = () => {
    setData();
    
    validatorSignUp();

    const registerForm = document.getElementById('signUpForm');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        validatorSignUp();
    });
};

const validatorSignUp = () => {
    let validator = new Validator(document.querySelector('form[name="signUpForm"]'), function (err, res) {
        if (res) {
            register();
        }
    }, {
            rules: {
                customMinLength: function (value, params) {
                    return this.min(value.replace(/\s{2,}/g, ' ').length, params);
                },
                nif: function (value, params) {
                    return this.between(value.replace(/\s{2,}/g, ' ').length, params);
                }
            },
            messages: {
                en: {
                    customMinLength: {
                        empty: 'Insira a sua palavra-passe',
                        incorrect: 'Introdoziu menos de {0} carateres'
                    },
                    nif: {
                        empty: 'Insira o seu nif',
                        incorrect: 'Nif inválido'
                    }
                }

            }
        });
}

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
        let response = JSON.stringify(data);
        localStorage.setItem('profile', response);
        window.location.href = './perfil.html';
    });
}