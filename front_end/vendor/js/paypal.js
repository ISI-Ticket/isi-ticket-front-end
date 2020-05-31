function pay() {
  var data = {
      ticketID : document.getElementById('ticketID').value,
      quantity : 1
  }
  console.log(data);
  fetch('https://isi-ticket-api.herokuapp.com/paypalV2/pay', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(data)
  }).then(function (res) {
      console.log(res.url);
      window.location.href = res.url;
      //return res.json();
  })
}
