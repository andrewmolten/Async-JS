'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.official}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} million</p>
      <p class="country__row"><span>🗣️</span>${
        data.languages[Object.keys(data.languages)[0]]
      }</p>
      <p class="country__row"><span>💰</span>${
        data.currencies[Object.keys(data.currencies)[0]].name
      }</p>
    </div>
  </article>
     `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};
///////////////////////////////////////
//https://restcountries.com/v2/

// const getCountryData = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);

//     console.log(data);

//     const html = `
//   <article class="country">
//   <img class="country__img" src="${data.flags.png}" />
//     <div class="country__data">
//       <h3 class="country__name">${data.name.official}</h3>
//       <h4 class="country__region">${data.region}</h4>
//       <p class="country__row"><span>👫</span>${(
//         +data.population / 1000000
//       ).toFixed(1)} million</p>
//       <p class="country__row"><span>🗣️</span>${
//         data.languages[Object.keys(data.languages)[0]]
//       }</p>
//       <p class="country__row"><span>💰</span>${
//         data.currencies[Object.keys(data.currencies)[0]].name
//       }</p>
//     </div>
//   </article>
//      `;

//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   });
// };

// getCountryData('Portugal');

// const getCountryAndNeighbour = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);

//     // Render country 1
//     renderCountry(data);

//     console.log(data);

//     // Get Neighbour country (2)
//     const [neighbour] = data.borders;

//     if (!neighbour) return;

//     // AJAX call country 2
//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
//     request2.send();

//     request2.addEventListener('load', function () {
//       const [data2] = JSON.parse(this.responseText);
//       console.log(data2);
//       renderCountry(data2, 'neighbour');
//     });
//   });
// };

// getCountryAndNeighbour('New Zealand');
// getCountryAndNeighbour('usa');

/////////////////////////////////
//////// USING PROMISES /////////
/////////////////////////////////

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//       // return response.json() creates another promise which we can call the 'then' function on
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

const getJSON = function (url, errorMsg = `Something went wrong`) {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);
    return response.json();
  });
};

// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(response => {
//       if (!response.ok) throw new Error(`Country not found ${response.status}`);
//       return response.json();
//     })
//     .then(data => renderCountry(data[0]));
// };

// // getCountryData('portugal');

// const getCountryAndNeighbourData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(
//       response => response.json()
//       // err => alert(err)
//     )
//     .then(data => {
//       renderCountry(data[0]);

//       const neighbour = data[0].borders?.[0];
//       if (!neighbour) return;
//       // Country 2
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
//     })
//     .then(response => {
//       if (!response.ok) throw new Error(`Country not found ${response.status}`);
//       return response.json();
//     })
//     .then(data => renderCountry(data[0], 'neighbour'))
//     .catch(err => {
//       console.log(`${err} 💥💥💥`);
//       console.log(err);
//       renderError(`Something went wrong 💥💥 ${err.message}. Try again!`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     });
// };

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then(response => {
      if (!response.ok) throw new Error(`Country not found ${response.status}`);
      return response.json();
    })
    .then(data => renderCountry(data[0]));
};

// getCountryData('portugal');

const getCountryAndNeighbourData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);

      const neighbour = data[0].borders?.[0];
      if (!neighbour) throw new Error('No neighbour found!');

      // Country 2
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.log(`${err} 💥💥💥`);
      console.log(err);
      renderError(`Something went wrong 💥💥 ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

// btn.addEventListener('click', function () {
//   getCountryAndNeighbourData('Germany');
// });

// getCountryAndNeighbourData('Australia');

//////////////////////////////////////
////////// CODING CHALLENGE //////////
//////////////////////////////////////
/*
const whereAmI = function (lat, lng) {
  //authcode = 238776515346848385688x36329
  fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=238776515346848385688x36329`
  )
    .then(response => {
      if (!response.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return response.json();
    })
    .then(data => {
      const city = data.city;
      const country = data.country;
      if (!city || !country) throw new Error('Could not find your location');

      console.log(`You are in ${city}, ${country}`);

      getJSON(
        `https://restcountries.com/v3.1/name/${country}`,
        'Country not found'
      )
        .then(data => {
          renderCountry(data[0]);

          const neighbour = data[0].borders?.[0];
          if (!neighbour) throw new Error('No neighbour found!');

          // Country 2
          return getJSON(
            `https://restcountries.com/v3.1/alpha/${neighbour}`,
            'Country not found'
          );
        })
        .then(data => renderCountry(data[0], 'neighbour'));
    })
    .catch(err => console.log(`${err.message} Something went wrong`))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
*/

/*
console.log('Test start');
setTimeout(() => console.log('0 sec timer'), 0);
//Promise.resolve will be executed first because it will be added to the microtask queue
Promise.resolve('Resolved promise').then(res => console.log(res));

Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 0; i < 1000000000; i++) {}
  console.log(res);
});
console.log('Test End');
*/

/*
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery draw in progress🔮');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You WIN 💰');
    } else {
      reject(new Error('You lost your money 💩'));
    }
  }, 2000);
});

lotteryPromise
  .then(resolvedValue => console.log(resolvedValue))
  .catch(err => console.log(err));

//Promisifying setTimeout
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(1)
  .then(() => {
    console.log('1 second passed');
    return wait(1);
  })
  .then(() => {
    console.log('2 second passed');
    return wait(2);
  })
  .then(() => console.log('4 seconds passed'));

Promise.resolve('abc').then(x => console.log(x));
Promise.reject(new Error('Problem')).catch(x => console.error(x));
*/

// Promiifying geolocation API

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    // Or can be written the same way:
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then(pos => console.log(pos));

const whereAmI = function (lat, lng) {
  getPosition()
    .then(pos => {
      // Destructure lat and lng
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=238776515346848385688x36329`
      );
    })

    //authcode = 238776515346848385688x36329

    .then(response => {
      if (!response.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return response.json();
    })
    .then(data => {
      const city = data.city;
      const country = data.country;
      if (!city || !country) throw new Error('Could not find your location');

      console.log(`You are in ${city}, ${country}`);

      getJSON(
        `https://restcountries.com/v3.1/name/${country}`,
        'Country not found'
      )
        .then(data => {
          renderCountry(data[0]);

          const neighbour = data[0].borders?.[0];
          if (!neighbour) throw new Error('No neighbour found!');

          // Country 2
          return getJSON(
            `https://restcountries.com/v3.1/alpha/${neighbour}`,
            'Country not found'
          );
        })
        .then(data => renderCountry(data[0], 'neighbour'));
    })
    .catch(err => console.log(`${err.message} Something went wrong`))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', whereAmI);

/*
Coding Challenge #2
For this challenge you will actually have to watch the video! Then, build the image
loading functionality that I just showed you on the screen.

Your tasks:
Tasks are not super-descriptive this time, so that you can figure out some stuff by
yourself. Pretend you're working on your own �

PART 1
1. Create a function 'createImage' which receives 'imgPath' as an input.
This function returns a promise which creates a new image (use
document.createElement('img')) and sets the .src attribute to the
provided image path
2. When the image is done loading, append it to the DOM element with the
'images' class, and resolve the promise. The fulfilled value should be the
image element itself. In case there is an error loading the image (listen for
the'error' event), reject the promise
3. If this part is too tricky for you, just watch the first part of the solution

PART 2
4. Consume the promise using .then and also add an error handler
5. After the image has loaded, pause execution for 2 seconds using the 'wait'
function we created earlier
6. After the 2 seconds have passed, hide the current image (set display CSS
property to 'none'), and load a second image (Hint: Use the image element
returned by the 'createImage' promise to hide the current image. You will
need a global variable for that �)
7. After the second image has loaded, pause execution for 2 seconds again
8. After the 2 seconds have passed, hide the current image


Test data: Images in the img folder. Test the error handler by passing a wrong
image path. Set the network speed to “Fast 3G” in the dev tools Network tab,
otherwise images load too fast
GOOD LUCK �*/

btn.style.opacity = 0;

const createImage = function (imgPath) {
  return new Promise(function () {
    const image = document.createElement('img');
    image.src = imgPath;
    image => document.querySelector('.images').appendChild(image);
  });
};

createImage('img/img-1.jpg');
