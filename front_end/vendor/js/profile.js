window.onload = () => {
  getProfile();

  let api = JSON.parse(localStorage.getItem('api'));

  const signOutBtn = document.getElementById('signOutBtn');

  if (api === 'google') {

    let script = document.createElement('script');
    console.log("carreguei")
    script.src = 'https://apis.google.com/js/platform.js?onload=initialize';
    script.async = 'async';
    script.defer = 'defer';

    document.head.appendChild(script);

  }

  if (api === 'facebook') {
    window.fbAsyncInit = function () {
      FB.init({
        appId: '253404675657890',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v7.0'
      });
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/pt_PT/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    signOutBtn.addEventListener('click', () => {
      signOutFacebook();
    });

  }

}

function getProfile() {
  let profile = JSON.parse(localStorage.getItem('profile'));
  document.getElementById("email").value = profile.email;
  document.getElementById("firstname").value = profile.firstname;
  document.getElementById("lastname").value = profile.lastname;
  document.getElementById("nif").value = profile.nif;
  document.getElementById("phone").value = profile.phone;
  document.getElementById("address").value = profile.address;
  document.getElementById("city").value = profile.city;
  document.getElementById("zip").value = profile.zip;

}

function onLoad() {
  console.log("terminar")
  gapi.load('auth2', function () {
    gapi.auth2.init();
  });
}

const signOutGoogle = () => {
  console.log("terminar")
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    localStorage.clear();
    window.location.href = '../../index.html';
  });

}

const signOutFacebook = () => {
  FB.logout((response) => {
    localStorage.clear();
    console.log(response);
    window.location.href = '../../index.html';
  });
}

function initialize() {
  console.log("inicializei")
  gapi.load('auth2', function () {
    auth2 = gapi.auth2.init({
      client_id: '743510812799-olf9sq5n33lqvp9reigo9tb11itfucmo.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      scope: 'profile'
    });
  });

  signOutBtn.addEventListener('click', () => {
    signOutGoogle();
  });

}