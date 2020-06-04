//gloale variabeln, alle Daten, welche mit GET - Request befüllt werden
kostenData = [];
reingewinnData = [];
finanzkennzahlenData = [];
durchlaufzeitData = [];

//Finanzkennzahlen - component
var kennzahlen = Vue.component('app-kennzahlen-component', {
    template: `
    <div>
    <input class="date" id="StartDate" name="StartDate" value="/pictures/calendaricon.png"
                        type="hidden" />
    Finanzkennzahlen:
    <div class=scrollpart>
    <div class="kennzahlen">{{umsatzLab}} {{umsatzInput}}Tsd. (+{{umsatzProzent}}%)<input type="image"
            src="/pictures/greenup.jpg" alt="Submit"></div>
    <div class="kennzahlen">{{ebitLab}} {{ebitInput}}Tsd. (+{{ebitProzent}}%)<input type="image" src="/pictures/greenup.jpg"
            alt="Submit"></div>
    <div class="kennzahlen">{{roiLab}} {{roiInput}}Tsd. (-{{roiProzent}}%)<input type="image" src="/pictures/reddown.jpg"
            alt="Submit"></div>
    <div class="kennzahlen">{{gewinnLab}} {{gewinnInput}}Tsd. (+{{gewinnProzent}}%)<input type="image"
            src="/pictures/greenup.jpg" alt="Submit"></div>
    </div>
    </div>
    `,
    data() {
        return {
            umsatzInput: 0,
            ebitInput: 0,
            roiInput: 0,
            gewinnInput: 0,
            umsatzProzent: 3,
            ebitProzent: 13,
            roiProzent: 13,
            gewinnProzent: 9,
            finanzLab: "Finanzkennzahlen",
            umsatzLab: "Umsatz",
            ebitLab: "EBIT",
            roiLab: "ROI",
            gewinnLab: "Gewinn"
        }
    },
    created() {
        this.setUp()
    },
    methods: {
        setUp() {
            axios.get("http://localhost:8080/finanz")
                .then(response => {
                    this.umsatzInput = response.data.umsatz;
                    this.ebitInput = response.data.ebit;
                    this.roiInput = response.data.roi;
                    this.gewinnInput = response.data.gewinn;
                })

        }
    }
})

//  graph Kosten component (in Alle Standorte) - component
var appKosten = Vue.component('app-graph-kosten-component', {
    template:
        `
    <canvas id="Kosten" title="Kosten im Jahr"></canvas>
    `,
    mounted() {
        chartKosten();
    },
    created() {
        chartKosten();
    }
})
// graph reingewinn (in Wiedikon) - component
var appReingewinn = Vue.component('app-graph-reingewinn-component', {
    template:
        `
    <canvas id="Reingewinn" title="Reingewinn"></canvas>
    `,
    mounted() {
        chartReingewinn()
    },
    created() {
        chartReingewinn()
    }
})
//graph durchlaufzeit (in Alle Standorte) - component
var appDurchlaufzeit = Vue.component('app-graph-durchlaufzeit-component', {
    template:
        `<canvas id="Durchlaufzeit" title="Durchlaufzeit"></canvas>`,
    mounted() {
        chartDurchlaufzeit()
    },
    created() {
        chartDurchlaufzeit()
    }

})
//graph BCG Matrix (in Alle Standorte) - component
var appMatrix = Vue.component('app-graph-component-matrix', {
    template:
        `
    <canvas id="BCGMatrix" title="BCG Matrix"></canvas>
    `,
    mounted() {
        chartMatrix()
    },
    created() {
        chartMatrix()
    }

})


// component vue router
const router = new VueRouter({
    routes:
        [
            { path: '/All', component: appKosten },
            { path: '/Wiedikon', component: appReingewinn },
        ]
})

// Bild - graph- component 
Vue.component('graph-component', {
    props: ['picture'],
    template:
        `
        <img type="image" v-bind:src="picture" alt="Submit" width=""height=""title="statisches Bild"></div>
        `

})
// vue main app component
var app = new Vue({
    router,
    el: '#app',
    data: {
        alleStandortLab: "Alle",
        wiedikonLab: "Wiedikon",
        oerlikonLab: "Örlikon",
        affolternLab: "Affoltern",
        benutzerLab: "Benutzer",
        erstellenLab: "Erstellen",
        loeschenLab: "Löschen",
        verwaltungLab: "Verwaltung",
        mailLab: "Mail",
        refreshLab: "Refresh"
    },
    methods: {
        openMail: function () {
            window.location.href = "mailto:user@example.com?Kennzahlen=Subject&body=Ayverdis%20sagt%20hallo";
        },
        showFrames: function (placeName) {
            document.getElementById("frame1").innerHTML = placeName;
            document.getElementById("frame2").innerHTML = placeName;
            document.getElementById("frame3").innerHTML = placeName;
            document.getElementById("frame4").innerHTML = placeName;
            document.getElementById("frame5").innerHTML = placeName;
            document.getElementById("frame6").innerHTML = placeName;

        },
        refresh: function () {
            //chartKosten();
            chartDurchlaufzeit();
            //chartMatrix();
            //chartReingewinn();
        }
    }

})


// Funktion Datetime &  ausführen Funktion Uhrzeit
uhrzeit();
function uhrzeit() {
    var akt = new Date(),
        hours = akt.getHours(),
        minutes = akt.getMinutes(),
        seconds = akt.getSeconds();
    minutes = timeNull(minutes);
    seconds = timeNull(seconds);
    document.getElementById('aktuelleZeitlab').innerHTML = hours + ':' + minutes + ':' + seconds;
    setTimeout(uhrzeit, 500);
}
// Funktion 0 hinzufügen
function timeNull(zahl) {
    zahl = (zahl < 10 ? '0' : '') + zahl;
    return zahl;
}
//JQuery Datepicker
$(document).ready(function () {
    $("#StartDate").datepicker({
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        changeYear: true,
        showOn: 'button',
        buttonImage: '/pictures/calendaricon.png',
    });
});

//Funktionen: Erstellung/ 'NEW CHART' von allen Graphen


//Erstellung Kosten
function chartKosten() {
    // CHART KOSTEN
    axios.get("http://localhost:8080/chartKostenDaten")
        .then(response => {
            kostenData = response.data.data;
        })
    var ctx = document.getElementById("Kosten");
    var kostendataVor = [12, 12, 12, 12, 1, 14, 15, 12, 12];

    var Kosten = new Chart(ctx, {
        type: 'line',

        data: {
            labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            datasets: [{
                label: '#  Vorjahr',
                yAxisID: 'A',
                data: [20, 30, 20, 30, 50, 100, 70, 60, 40, 30, 20, 50],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1

            },
            {
                label: '# akt. Jahr ',
                yAxisID: 'B',
                data: kostenData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Kosten'
            },
            scales: {
                yAxes: [{
                    id: 'A',
                    ticks: { beginAtZero: true }
                },
                {
                    id: 'B',
                    position: 'right',
                    ticks: { beginAtZero: true }
                }]
            }
        }
    });
}

//Erstellung Reingewinn
function chartReingewinn() {
    // CHART REINGEWINN
    axios.get("http://localhost:8080/chartReingewinnDaten")
        .then(response => {

            reingewinnData = response.data.data;

        })
    var ctx = document.getElementById("Reingewinn");
    var Reingewinn = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            datasets: [{
                label: '#  Vorjahr',
                yAxisID: 'A',
                data: [60, 60, 60, 80, 80, 70, 90, 80, 70, 80, 90, 100],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1
            },
            {
                label: '# akt. Jahr ',
                yAxisID: 'B',
                data: reingewinnData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Reingewinn'
            },
            scales: {
                yAxes: [{
                    id: 'A',
                    ticks: { beginAtZero: true }
                },
                {
                    id: 'B',
                    position: 'right',
                    ticks: { beginAtZero: true }
                }]
            }
        }
    });
}
// Erstellung Durchlaufzeit
function chartDurchlaufzeit() {
    axios.get("http://localhost:8080/durchlaufzeitData")
        .then(response => {
            durchlaufzeitData = response.data.zahlen;
        })
    //CHART DURCHLAUFZEIT
    var ctx = document.getElementById("Durchlaufzeit");
    var Durchlaufzeit = new Chart(ctx, {
        type: 'line',

        data: {
            labels: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            datasets: [{
                label: '# akt Jahr',
                yAxisID: 'A',
                data: durchlaufzeitData,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
                fill: false

            },
            {
                label: '# Vorjahr ',
                yAxisID: 'B',
                data: [20, 20, 40, 30, 50, 70, 90, 100, 70, 30, 20, 10],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                type: 'line',
                fill: false
            }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Durchlaufzeit'
            },
            scales: {
                yAxes: [{
                    id: 'A',
                    ticks: { beginAtZero: true }
                },
                {
                    id: 'B',
                    position: 'right',
                    ticks: { beginAtZero: true }
                }]
            }
        }
    });
}

//Erstellung BCG Matrix
function chartMatrix() {
    //CHART BCG MATRIX
    var ctx = document.getElementById("BCGMatrix");
    var BCGMatrix = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: ["# Döner"],
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: '#fff',
                hoverBackgroundColor: 'red',
                data: [{ x: 0, y: 10, r: 10 }],
            }, {
                label: ["# Dürüm"],
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: '#fff',
                hoverBackgroundColor: 'red',
                data: [{ x: 0.5, y: 4, r: 40 }],
            }, {
                label: ["# Pepito Poulet"],
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: '#fff',
                hoverBackgroundColor: 'red',
                data: [{ x: 1, y: 3, r: 34 }],
            }, {
                label: ["# Pide mit Dönerfleisch"],
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: '#fff',
                hoverBackgroundColor: 'red',
                data: [{ x: 2, y: 0, r: 60 }],
            }
            ]
        }, options: {
            title: {
                display: true,
                text: 'BCG Matrix'
            }
        }
    });
}
