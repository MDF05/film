function elemenCards(e) {
  return `<div class="col-md-3 my-3">
                  <div class="card foto-dava">
                      <img src="${e.Poster}" class="card-img-top" alt="${e.Title}">
                      <div class="card-body">
                          <h5 class="card-title">${e.Title}</h5>
                          <h6 class="text-muted text-end text-capitalize">tahun rilis ${e.Year}</h6>
                          <a href="#" class="btn btn-primary klik-film" data-bs-toggle="modal" data-bs-target="#filmmodal"
                          data-imdb="${e.imdbID}">more details</a>
                      </div>
                  </div>
              </div>
              `;
}

function cardsInfo(e) {
  return `
      <div class="modal-content">
      <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">${e.Title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
          <div class="container-fluid">
              <div class="row">
                  <div class="col-md-5 poster-saya">
                      <img src="${e.Poster}" alt="${e.Title}" class="img-fluid">
                  </div>
                  <div class="col-md">
                      <ul class="list-group">
                          <li class="list-group-item">
                              <strong>Year</strong>: ${e.Year}
                          </li>
                          <li class="list-group-item">
                              <strong>Rated</strong>: ${e.Rated}
                          </li>
                          <li class="list-group-item">
                              <strong>Released</strong>: ${e.Released}
                          </li>
                          <li class="list-group-item">
                              <strong>Runtime</strong>: ${e.Runtime}
                          </li>
                          <li class="list-group-item">
                              <strong>Genre</strong>: ${e.Genre}
                          </li>
                          <li class="list-group-item">
                              <strong>Director</strong>: ${e.Director}
                          </li>
                          <li class="list-group-item">
                              <strong>Writer</strong>: ${e.Writer}
                          </li>
                          <li class="list-group-item">
                              <strong>Actors</strong>: ${e.Actors}
                          </li>
                          <li class="list-group-item">
                              <strong>Plot</strong>: ${e.Plot}
                          </li>
                          <li class="list-group-item">
                              <strong>Language</strong>: ${e.Language},
                          </li>
                          <li class="list-group-item">
                              <strong>Country</strong>: ${e.Country},
                          </li>
                          <li class="list-group-item">
                              <strong>Awards</strong>: ${e.Awards}
                          </li>
                          <li class="list-group-item">
                              <strong>Ratings</strong>:
                              <br>
                              <strong>Source</strong>: ${e.Ratings[0].Source}
                              <br>
                              <strong>Value</strong>: ${e.Ratings[0].Value}
                          </li>
                          <li class="list-group-item"> <strong>Metascore</strong>: ${e.Metascore}</li>
                          <li class="list-group-item"> <strong>Type</strong>: ${e.Type}</li>
                          <li class="list-group-item"> <strong>DVD</strong>: ${e.DVD}</li>
                          <li class="list-group-item"> <strong>BoxOffice</strong>: ${e.BoxOffice}</li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
  </div>
  `;
}

function footerButton() {
  return `
  <div class="row mb-5 p-5">
      <div class="col d-flex justify-content-between buttonPage">
          <button type="button" class="btn btn-outline-light btn-1">⋘ before</button>
          <span class="text-light font-monospace">page 1 / page 15</span>
          <button type="button" class="btn btn-outline-light btn-2">next ⋙</button>
      </div>
  </div>`;
}

$(".dava-button").on("click", function () {
  const logo = document.querySelector(".mdf-logo");
  const filmShow = document.querySelector(".film-show");
  filmShow.classList.remove("justify-content-end");
  if (logo) logo.remove();
  const dava = document.querySelector(".search-dava");
  const footerDava = document.querySelector(".text-dava-footer");

  let page = 1;
  function requestData() {
    fetch(
      `https://www.omdbapi.com/?apikey=cb2c7062&s=${dava.value.trim()}&page=${page}`
    )
      .then((e) => e.json())
      .then(function (e) {
        let simpan = e.Search || "kosong";
        let cards = "";
        if (simpan === "kosong") {
          cards += `<div class="text-center my-4" style="color : white"><h3>tidak ditemukan data film : ${
            dava.value || "mohon isi terlebih dahulu input search "
          }</h4></div>`;
          footerDava.parentElement.parentElement.style.position = "absolute";
        } else {
          simpan.forEach((e) => {
            cards += elemenCards(e);
          });
          footerDava.parentElement.parentElement.style.position = "relative";
        }
        cards += e.totalResults > 10 ? footerButton() : "";
        const kartuFilm = document.querySelector(".kartuFilm");
        kartuFilm.innerHTML = cards;

        const pageInfo = document.querySelector(".buttonPage span");
        const max = Math.ceil(e.totalResults / 10);
        function gantiHalaman(iterator) {
          page = page + iterator;
          if (page < 1) page = max;
          if (page > max) page = 1;
          requestData();
        }
        pageInfo.innerHTML = `page ${page} / page ${max}`;

        const button = document.querySelectorAll(".buttonPage button");
        button[0].addEventListener("click", () => {
          gantiHalaman(-1);
        });

        button[1].addEventListener("click", () => {
          gantiHalaman(1);
        });

        const moreDetails = document.querySelectorAll(".klik-film");
        moreDetails.forEach(function (e) {
          e.addEventListener("click", function (e) {
            let id = e.target.getAttribute("data-imdb");
            fetch(`https://www.omdbapi.com/?i=${id}&apikey=cb2c7062&plot=full`)
              .then((e) => e.json())
              .then(function (e) {
                $(".film-saya").html(cardsInfo(e));
              })
              .catch(function (a) {
                console.log(a.responeseText);
              });
          });
        });
      })
      // 📌succes method
      .catch((e) => {
        console.log(e.responeseText);
      });
  }
  requestData();
});
function placeHolderText() {
  const dava = document.querySelector(".search-dava");
  let JudulFilm = `Makmum 2,Nussa,Yowis Ben 3,Yowis Ben Finale,Tarian Lengger Maut,Teka-teki Tika,Backstage Paragon ,Kuyang the Movie,Losmen Bu Broto	Paragon ,Yuni,Seperti Dendam, Rindu Harus Dibayar Tuntas,Kadet 1947,Paranoia,Pintu Surga,Akhirat: A Love Story,500 Days of Summer,Big Fish,Everybody's Fine,About Time,U Turn,Submarine,The Perfect Host,The Lord of the Rings: The Two Towers,Mad Max: Fury Road,Gone Girl,It's Kind of a Funny Story,Little Miss Sunshine,Back to the Future,Memento,Her,City of God,The Truman Show,The Town,Anger Management,Ocean's Eleven,Mr Nobody,We Need to Talk About Kevin,Crash,Orphan,50 First Dates,Being John Malkovich,Wild Tales,The Bourne Identity,Argo,Warrior,Catch Me If You Can,Memento,Wedding Crashers,Her,The Intouchables,Nightcrawler,Drive,Inside Out,Django Unchained,Inception,Interstellar,The Terminal,Definitely, Maybe,The Butterfly Effect,End of Watch,Wreck-It Ralph,Up in the Air,Chronicle,Side Effects,Phone Booth,The Lincoln Lawyer,Two Days, One Night,Wild Tales,The Descendants,The Angels' Share,Thank You for Smoking,Dear Zachary: A Letter to a Son About His Father,The Shawshank Redemption,Fight Club,The Dark Knight,Moneyball,Room,The Lobster,The Hunt,What's Up with Cinta?,Janji Joni,Coherence,Superbad,Accepted,Detachment,The Prestige,Bridesmaids,In Bruges,A Serious Man,Source Code,Limitless,In Time,Juno,Death at a Funeral,District 9,Megamind,Borat,Valentine's Day,The Imposter,The Other Guys,Before Sunset,While We're Young,Saving Private Ryan,Hot Fuzz,The Break-Up`;
  JudulFilm = JudulFilm.split(",");
  setInterval(() => {
    dava.placeholder = `Movies ${
      JudulFilm[Math.round(Math.random() * JudulFilm.length - 1)]
    }`;

    const footerDava = document.querySelector(".text-dava-footer");
    footerDava.innerHTML =
      "© muhammad dava fahreza january " + new Date().getFullYear();
  }, 1000);
}
placeHolderText();
