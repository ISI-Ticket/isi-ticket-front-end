window.onloadstart = () => {
  let profile = JSON.parse(localStorage.setItem('profile'));

  if (profile.api === 'google') {
    let script = document.createElement('script');

    script.src = 'https://apis.google.com/js/platform.js';
    script.async = 'async';
    script.defer = 'defer';

    document.head.appendChild(script);
  } else {

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

  }

}

window.onload = getProfile();

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
  gapi.load('auth2', function () {
    gapi.auth2.init();
  });
}

const signOut = () => {

  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    localStorage.clear();
    console.log('User signed out.');
    window.location.href = '../../index.html';
  });

}

function facebookLogout() {
  FB.logout((response) => {
      localStorage.clear();
      console.log(response);
      window.location.href = '../../index.html';
  });
}
