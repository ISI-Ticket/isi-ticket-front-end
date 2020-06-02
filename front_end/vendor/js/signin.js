window.onload = () => {

    startApp();

    let facebookBtn = document.getElementById('facebookBtn');

    facebookBtn.addEventListener('click', (e) => {
        e.preventDefault();

        facebookLogin();
    });
} 

const startApp = () => {
    gapi.load('auth2', function () {
        auth2 = gapi.auth2.init({
            client_id: '743510812799-olf9sq5n33lqvp9reigo9tb11itfucmo.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
            scope: 'profile'
        });
        attachSignin(document.getElementById('googleBtn'));
    });
};

const attachSignin = (element) => {
    auth2.attachClickHandler(element, {},
        function (googleUser) {
            googleUser = googleUser.getBasicProfile();

            let profile = {
                'email': googleUser.Eu,
                'firstName': googleUser.GW,
                'lastName': googleUser.GU,
                'api': 'google'
            }

            signInApi(profile);

        }, function (error) {
            if(error.error === 'popup_closed_by_user') {
                console.log('fechei popup')
            } else {
                console.log(error);
            }
        })
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '253404675657890',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v6.0'
    });
};

// Load the SDK asynchronously
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

const facebookLogin = () => {
    FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
            FB.api('/me?fields=first_name, last_name, email, picture.type(large)', function (userData) {
                let data = {
                    "email": userData.email,
                    "firstName": userData.first_name,
                    "lastName": userData.last_name
                }

                signInApi(data);
            });
        }

    }, { scope: 'public_profile, email' })
}

function facebookLogout() {
    FB.logout((response) => {
        console.log(response);
    });
}

function signInApi(profile) {

    let data = {
        email: profile.email
    }

   fetch('https://isi-ticket-api.herokuapp.com/user/signin', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => {
        return res.json();
    }).then((data) => {
        let response = JSON.stringify(data);

        if (data.exists == true) {
            localStorage.setItem('profile', response);
            window.location.href = './vendor/pages/perfil.html'
        } else {
            window.location.href = './vendor/pages/registar.html'
            localStorage.setItem('email', profile.email);
            localStorage.setItem('firstname', profile.firstName);
            localStorage.setItem('lastname', profile.lastName);
        };
    });
}