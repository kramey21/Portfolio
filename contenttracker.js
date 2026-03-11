function clickCounter() {
    const x = document.getElementById("result");
    if (typeof (Storage) !== "undefined") {
        if (sessionStorage.clickcount) {
            sessionStorage.clickcount = Number(sessionStorage.clickcount) + 1;
        } else {
            sessionStorage.clickcount = 1;
        }
        x.innerHTML = "You have viewed " + sessionStorage.clickcount + " docuemtns out of 16!";
    } else {
        x.innerHTML = "Sorry, no Web storage support!";
    }
}

window.onload = <p id="result"></p>

