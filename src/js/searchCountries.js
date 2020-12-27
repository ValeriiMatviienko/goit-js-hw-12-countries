import countryApi from './fetchCountries.js';
import countryData from '../templates/countryData.hbs';
import countryList from '../templates/countryList.hbs';

import debounce from 'lodash.debounce';
import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  input: document.querySelector('.js-input-search'),
  country: document.querySelector('.js-country'),
};

refs.input.addEventListener('input', debounce(searchCountry, 500));

let searchedCountry = '';

function searchCountry() {
  clearSearch();
  searchedCountry = refs.input.value;
  if (!searchedCountry) {
    return;
  }
  countryApi(searchedCountry)
    .then(displayResults)
    .catch(err => console.log(err));
}

function clearSearch() {
  refs.country.innerHTML = '';
}

function displayResults(countries) {
  if (countries.length === 1) {
    displayContries(countryData, countries);
  } else if (countries.length > 1 && countries.length <= 10) {
    displayContries(countryList, countries);
  } else if (countries.length > 10) {
    createMessage(
      error,
      'To many matches found. Please enter a more specific query!',
    );
  } else {
    createMessage(info, 'Sorry. No such country found');
  }
}

function createMessage(information, text) {
  information({
    text: `${text}`,
    delay: 1400,
    closerHover: true,
  });
}

function displayContries(template, countries) {
  refs.country.insertAdjacentHTML('beforeend', template(countries));
}
