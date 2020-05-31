window.onload = getProfile();

function getProfile(){
    let profile = JSON.parse(localStorage.getItem('profile'));
    console.log(profile);
    document.getElementById("email").value = profile.email;
    document.getElementById("firstname").value = profile.firstname;
    document.getElementById("lastname").value = profile.lastname;
    document.getElementById("nif").value = profile.nif;
    document.getElementById("phone").value = profile.phone;
    document.getElementById("address").value = profile.address;
    document.getElementById("city").value = profile.city;
    document.getElementById("zip").value = profile.zip;

}


function signOut(){

    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
      });

    window.location.href='../../index.html';
}