window.onload = () => {
    getHistory().then(tickets => populate(tickets))
}

const getHistory = async () => {
    let profile = JSON.parse(localStorage.getItem('profile'));
    let email = profile.email;
    let response = await fetch(`https://isi-ticket-api.herokuapp.com/test/history/${email}`);
    let data = await response.json()
    return data;
}

const populate = (tickets) => {
    let render = document.getElementById('render');
    let page;
    let index = 0;
    console.log(tickets);
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
                    <br />
                    <div class="ticket-price">
                        <p class="ticket-price-p">Comprado em: ${date}</p>
                        <p class="ticket-price-p">${ticket.description}</p>
                        <p class="ticket-price-p">${validationDate(ticket.validated)}</p>
                    </div>
                    <br/>
                </div>
            </div>
            <br/>
            `

        render.innerHTML += page;
    }

}

const validationDate = (date) => {
    if (date == null) {
        return "Ainda por usar."
    } else {
        date = ticket.date.substring(0, 10);
        return `Validado em: ${date}`
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
