var profileTest;

/*gapi.load('auth2', initSigninV2);

function initSigninV2() {
    gapi.auth2.init({
        client_id: '680946609407-a812c4bn4704j8u2n15lsud3hq19c3a5.apps.googleusercontent.com'
    }).then(function (authInstance) {
        // now auth2 is fully initialized
    });
}*/
//window.onload = renderButton();

function renderButton() {

    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        //'width': 240,
        //'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSignIn,
        'onfailure': onFailure
    });
}

function onFailure(error) {
    console.log(error);
}
function signOut() {

    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function onSignIn(googleUser) {
    profile = googleUser.getBasicProfile();
    var data = {
        "email": profile.getEmail()
    }
    console.log(data);
    fetch('https://isi-ticket-api.herokuapp.com/user/signin', {
        headers: { 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify(data)
    }).then(function (res) {
        return res.json();
    }).then(function (data) {
        console.log(JSON.stringify(data));
        let response = JSON.stringify(data);
        if (data.exists == true) {
            localStorage.setItem('profile', response);
            window.location.href = './vendor/pages/perfil.html'
        } else {
            window.location.href = './vendor/pages/registar.html'
            localStorage.setItem("email", profile.getEmail());
            localStorage.setItem("firstname", profile.getGivenName());
            localStorage.setItem("lastname", profile.getFamilyName());
        };
    });
}

//Facebook login - ver melhor o logout...
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

function facebookLogin() {
    FB.getLoginStatus((response) => {
        if (response.status === 'connected') {
            FB.api('/me?fields=first_name, last_name, email, picture.type(large)', function (userData) {
                let data = {
                    "email": userData.email
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

async function signInApi(data) {
    try {
        let response = await fetch("https://isi-ticket-api.herokuapp.com/user/signin", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(data)
        });

        if(response.status == 200) {
            
        }

    } catch (error) {
        console.log(error);
    }
}