window.onload = function() {
    this.getTickets().then(tickets => populate(tickets))
}
async function getTickets() {
    let profile = JSON.parse(localStorage.getItem('profile'));
    let email = profile.email;
    let response = await fetch(`https://isi-ticket-api.herokuapp.com/test/tickets/${email}`);
    let data = await response.json()
    return data;
}


function populate(tickets) {
    console.log(tickets)
    let render = document.getElementById('render');
    let page;
    let index = 0;
    for (ticket of tickets) {
        let img = setImage(ticket.ticketID);
        let qrcode = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${ticket.saleID}" alt="" title="" />`
        index += 1;
        let date = ticket.date.substring(0, 10);
        page =
            `<div class="card-panel recipe white row" style="height:50%;"><img src="${img}" alt="recipe thumb">
                <div class="recipe-details">
                    <div class="recipe-title" style="font-size:medium;">${ticket.ticketName}</div>
                    <div class="recipe-ingredients" style="font-size: medium;">Comprado em : ${date}</div>
                    <br>
                    <div class="recipe-ingredients"><a class="button" style = 'font-size: 16px' href="#popup${index}"> Ver QRCode</a></div>
                    <div id="popup${index}" class="overlay">
                        <div class="popup">
                            <h1 style ="font-size: 20px">${ticket.ticketName} - ${date}</h1>
                            <a class="close" href="#">&times;</a>
                            <div class="content">${qrcode}</div>
                        </div>
                    </div>
                </div>
                <br>
                <br>
            </div>`
        render.innerHTML += page;

    }
}
/*
function populate(tickets){
    console.log(tickets)
    let render  = document.getElementById('render');
    let page;
    let index = 0;
    for(ticket of tickets){
        let img = setImage(ticket.ticketID);
        let qrcode = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=22/${ticket.ticketID}-${ticket.reference}" alt="" title="" />`
        for(let i = 0; i < ticket.quantity; i++){
            index += 1;
            let date = ticket.date.substring(0,10);
            page = 
            `<div class="card-panel recipe white row">
            <img src=${img} alt="recipe thumb">
            <div class="recipe-details">
                <div class="recipe-title">${ticket.ticketName} </div>
                <div class="recipe-ingredients">${ticket.description} - ${date}</div>
            </div>
            <div class="recipe-delete">
                <a class="button" href="#popup${index}"></a>
                <div id="popup${index}" class="overlay">
                <div class="popup">
                    <h1 style ="font-size: 20px">${ticket.ticketName} - ${date}</h1>
                    <a class="close" href="#">&times;</a>
                    <div class="content">
                        ${qrcode}
                    </div>
                </div>
                </div>
            </div>
        </div>`
            render.innerHTML += page;
        }
    }
   
}*/


function setImage(ticketID) {
    switch (ticketID) {
        case 1:
            return "../img/yellowticket.png"
        case 2:
            return "../img/greenticket.png"
        case 3:
            return "../img/purpleticket.png"
        case 4:
            return "../img/orangeticket.png"
    }
}