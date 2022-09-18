// declare global constants
const countryApiUrl = "https://randommer.io/api/Phone/Countries", myXApiKey = "2229467e25554a80bd372eb68ce6c74f";
//const countryApiUrl = "../Randommer.io Phone Countries.json"; // for offline testing

$(document).ready(function() {
  /*
  $(document).click((event) => {
    let mousePosition = {
      x: event.clientX,
      y: event.clientY
    }
    if (!isWithin(generateButton, mousePosition) && isVisible(results))
      if (!isWithin(results, mousePosition)) hide($("#results"));
  });
  */
  setFooterYear();
  populateCountries();
});

function copy() {
  let range = document.createRange();
  range.selectNode(results);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  $("#confirmation").text("Copied to clipboard");
}

function deselectAll() {
  $("#countrySelect option").prop("selected", false);
}

async function generateNumbers(n) {
  // declare local variables
  let countryCode, index, number, numbers = [], selectedOptions;

  // clear previous resuts
  $("#results p").remove();

  // show loading message
  $("#results").append("<p>Generating numbers...</p>");

  // show results banner
  show($("#resultContainer"));

  for (let i = 0; i < n; i++) {
    selectedOptions = $("#countrySelect option:selected");
    index = Math.floor(Math.random() * selectedOptions.length);
    countryCode = selectedOptions[index].value;
    number = await getNumber(countryCode);
    numbers.push(number);
  }
  // clear loading message
  $("#results p").remove();

  // display numbers
  numbers.forEach((number) => {
    $("#results").append(
      `<p class="number">${number}</p>`
    );
  })
}

function getCountries() {
  return new Promise((resolve) => {
    fetch(countryApiUrl, {
      method: "GET",
      headers: {
        "X-Api-Key": $("xApiKey").val() ? $("xApiKey").val() : myXApiKey
      }
    })
    .then(response => response.json())
    .then((data) => {
      resolve(data);
    })
    .catch((error) => {
      console.log(error);
      $("#countrySelect option").remove();
      $("#countrySelect").append(
        "<option disabled selected>Failed to fetch countries</option>"
      );
    });
  });
}

function getNumber(code) {
  return new Promise((resolve) => {
    let phoneApiUrl = `https://randommer.io/api/Phone/Generate?CountryCode=${code}&Quantity=1`;
    fetch(phoneApiUrl, {
      method: "GET",
      headers: {
        "X-Api-Key": $("xApiKey").val() ? $("xApiKey").val() : myXApiKey
      }
    })
    .then(response => response.json())
    .then((data) => {
      resolve(data[0]);
    })
    .catch((error) => {
      //console.log(error);
      $("#results p").remove();
      $("#results").append(`
        <p>Failed to generate phone numbers</p>
        <p>${error}</p>
      `);
    });
  });
}

function hide(element) {
  element.addClass("hidden");
}

function isVisible(element){
  return !element.classList.contains("hidden");
}

function isWithin(element, mousePosition){
  return (element.offsetLeft < mousePosition.x) && (mousePosition.x < (element.offsetLeft + element.offsetWidth)) && (element.offsetTop < mousePosition.y) && (mousePosition.y < (element.offsetTop + element.offsetHeight));
}

async function populateCountries() {
  countries = await getCountries();
  $("#countrySelect option").remove();
  countries.forEach((country) => {
    $("#countrySelect").append(
      `<option value='${country.countryCode}'>${country.name} (${country.callingCode})</option>`
    );
  });
  selectAll();
}

function selectAll() {
  $("#countrySelect option").prop("selected", true);
}

function setFooterYear() {
    let date = new Date(), year = date.getFullYear();
    $("#footerYear").text(year.toString());
}

function show(element) {
  element.removeClass("hidden");
}