window.onload = () => {

    startApp();

    fetch('https://connect.facebook.net/en_US/sdk.js')
        .then(function () {
            window.fbAsyncInit = () => {
                FB.init({
                    appId: '253404675657890',
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: 'v7.0'
                });
            };

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/pt_PT/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));


            let facebookBtn = document.getElementById('facebookBtn');

            facebookBtn.addEventListener('click', (e) => {
                e.preventDefault();

                facebookLogin();
            });
        })
        .catch((err) => {
            console.log(err)
            console.log('Facebook sdk is NOT allowed:');
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
            userEmail = googleUser.getEmail();
            userFirstname = googleUser.getName();
            userLastName = googleUser.getFamilyName();

            let profile = {
                'email': userEmail,
                'firstName': userFirstname,
                'lastName': userLastName,
                'api': 'google'
            }

            signInApi(profile);

        }, function (error) {
            if (error.error === 'popup_closed_by_user') {
            } else {
                console.log(error);
            }
        })
}

const facebookLogin = () => {
    FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
            FB.api('/me?fields=first_name, last_name, email, picture.type(large)', function (userData) {
                let profile = {
                    'email': userData.email,
                    'firstName': userData.first_name,
                    'lastName': userData.last_name,
                    'api': 'facebook'
                }

                signInApi(profile);
            });
        } else {
            FB.login((response) => {
                if (response.status === 'connected') {
                    FB.api('/me?fields=first_name, last_name, email, picture.type(large)', function (userData) {
                        let profile = {
                            'email': userData.email,
                            'firstName': userData.first_name,
                            'lastName': userData.last_name,
                            'api': 'facebook'
                        }
        
                        signInApi(profile);
                    });
                }
            }, { scope: 'public_profile,email' });
        }

    }, { scope: 'public_profile, email' })
}

function signInApi(profile) {

    let data = {
        email: profile.email
    }

    fetch   ('https://isi-ticket-api.herokuapp.com/user/signin', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(data)
    }).then((res) => {
        return res.json();
    }).then((data) => {
        let response = JSON.stringify(data);

        if (data.exists == true) {
            localStorage.setItem('profile', response);
            localStorage.setItem('api', JSON.stringify(profile.api));
            window.location.href = './vendor/pages/perfil.html'
        } else {
            localStorage.setItem("email", profile.email);
            localStorage.setItem("firstname", profile.firstName);
            localStorage.setItem("lastname", profile.lastName);
            localStorage.setItem('api', JSON.stringify(profile.api));
            window.location.href = './vendor/pages/registar.html'

        };
    });

}