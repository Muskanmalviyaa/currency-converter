const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");
let exchangeRateTxt;

for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_code) {
    let selected;
    if (i == 0) {
      selected = currency_code == "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currency_code == "NPR" ? "selected" : "";
    }
    //creating option tag with passing currency code as text and value
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    //Insering option tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target); //calling loadFlag with passing target element as an argument
  });
}

function loadFlag(element) {
  for (let code in country_code) {
    if (code == element.value) {
      //if currencyy code of country list is equal to option value
      let imgTag = element.parentElement.querySelector("img"); //selcting img tag of particular drop list

      //passing country code of a selected currency code in a img url
      imgTag.src = `https://flagsapi.com/${country_code[code]}/flat/64.png`;
    }
  }
}
//event handling
window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault(); //preventing form from submitting
  getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");

exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value; //temporary currency code of FROM drop list
  fromCurrency.value = toCurrency.value; //passing TO currency code to FROM currency code
  toCurrency.value = tempCode; //passing temporary currency code to TO currency code
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector(".amount input");
  const exchangeRateTxt = document.querySelector(".exchange-rate");
  let amountVal = amount.value;
  //if user don't enter any value or enter 0 then we'll put value 1 by default in the field
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }
  exchangeRateTxt.innerText = "Getting Exchange Rate...";
  let url = ` https://v6.exchangerate-api.com/v6/1f6ad60af820dc111c916852/latest/${fromCurrency.value}`;
  //fetching api response annd returning it with parsing into js obj and in another then method receiving that obj
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value}= ${totalExchangeRate} ${toCurrency.value}`;
    })
    .catch(() => {
      //if user is offline or any other error occured while fetching the data
      exchangeRateTxt.innerText = "Something went wrong...";
    });
}
