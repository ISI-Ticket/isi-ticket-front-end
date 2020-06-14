window.onload = function () {
    this.getTickets().then(tickets => populate(tickets))
}
async function getTickets() {
    let profile = JSON.parse(localStorage.getItem('profile'));
    let email = profile.email;
    let response = await fetch(`https://isi-ticket-api.herokuapp.com/test/tickets/${email}`);
    let data = await response.json()
    return data;
}


const populate = (tickets) => {
    console.log(tickets);
    let render = document.getElementById('render');
    let page;
    let index = 0;
    for (ticket of tickets) {

        let divImageClass = setImage(ticket.ticketID);
        index += 1;
        let date = ticket.date.substring(0, 10);
        page =
            `
            <div class="card-panel ticket row">
                    <div class="${divImageClass}">
                    </div>
                    <div class="ticket-details">
                        <br />
                        <div class="ticket-title">
                            <p class="ticket-title-p">${ticket.ticketName}</p>
                        </div>
                        <div class="ticket-price">
                            <p class="ticket-price-p">Comprado em : ${date}</p><br />
                        </div>
                        <div class="btn-card-container">
                            <a class="btn-card" data-toggle="modal" data-target="#popup${index}">Ver QRCode</a>
                            <br />
                            <br />
                        </div>
                        <div class="modal fade" id="popup${index}" tabindex="-1" role="dialog"
                            aria-labelledby="qrCodeModalLabel" aria-hidden="true">
                                <div class="modal-content">
                                    <div class="modal-header" id="qrCodeModalLabel">
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                        <h4 class="modal-title">${ticket.ticketName}</h4>
                                    </div>
                                    <div class="modal-body">
                                        <p>Comprado em : 07-06-2020 23:03</p>
                                        <div class="qrcode-container" id="${ticket.saleID}"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            <br/>
            `
        render.innerHTML += page;

        let divQrCode = document.getElementById(ticket.saleID);
        divQrCode.style.position = "absolute";
        divQrCode.style.top = "54px";
        divQrCode.style.width = "90%";
        divQrCode.style.height = "calc(100vh - (32px + var(--navbar-bot-height) + 56.6px + 54px + 48px + var(--header-height)))";
        divQrCode.style.background = "url('https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${ticket.saleID}') center no-repeat";
        divQrCode.style.backgroundSize = "contain";
    }
}

const setImage = (ticketID) => {
    switch (ticketID) {
        case 1:
            return 'card-img-senha-simples'
        case 2:
            return 'card-img-senha-completa'
        case 3:
            return 'card-img-senha-grill'
        case 4:
            return 'card-img-senha-rampab'
        case 5:
            return 'card-img-pack-senha-completa'
        case 6:
            return 'card-img-pack-senha-simples'
        default:
            return 'card-img-senha-completa'
    }
}