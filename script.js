$(function() {
    //Haetaan asiakastyypit ja sijoitetaan ne alasvetovalikkoon.
    $.ajax({
        url: "https://codez.savonia.fi/jussi/api/asiakas/tyypit.php",
        method: "GET",
        success: function(data) {
             $.each(data, function(i, tyyppi) {
                $("#asty").append($("<option></option>").val(tyyppi.avain).text(tyyppi.selite));
            });
        }
    });

    $("#haeForm").on("submit", function(e) {
        e.preventDefault();
        fetch();
    });
});

function fetch() {
    //Tämä funktio hakee asiakkaat tietokannasta kenttiin syötettyjen arvojen perusteella.
    const nimi = $("#nimi").val();
    const osoite = $("#osoite").val()
    const asty = $("#asty").val();

    let url = "https://codez.savonia.fi/jussi/api/asiakas/haku.php?";
    const haku = [];

    //Muodostetaan kysely (url) syötettyjen arvojen perusteella 
    if (nimi) haku.push("nimi=" + nimi);
    if (osoite) haku.push("osoite=" + osoite);
    if (asty !== "0") haku.push("asty_avain=" + asty);

    url += haku.join("&");

    $.ajax({
        url: url,
        method: "GET",
        success: function(data) {
            $("table tbody").empty();
            $.each(data, function(i, asiakas) {
                //Sijoitellaan asiakkaiden tiedot taulukkoon.
                const rivi = $("<tr>");
                rivi.append($("<td>").text(asiakas.nimi));
                rivi.append($("<td>").text(asiakas.osoite));
                rivi.append($("<td>").text(asiakas.postitmp));
                rivi.append($("<td>").text(asiakas.asty_avain));
                rivi.append($("<td>").append($("<button>").attr, `poista_${asiakas.avain}`).text("Poista").click(function() {
                    poista(asiakas.avain);
                }));
                $("table tbody").append(rivi);
            });
        }
    });
}

function poista(avain) {
    //Tämä funktio poistaa asiakkaan taulukosta ja tietokannasta.
    if (confirm("Haluatko varmisti poistaa tämän asiakkaan?")) {
        $.ajax({
            url: `https://codez.savonia.fi/jussi/api/asiakas/poista.php?avain=${avain}`,
            method: "GET",
            success: function() {
                fetch();
            }
        });
    }
}

