// Wrap our monumentList variable in an IIFE
const monumentsRepository = (function () {
  let monumentsList = [];
  const apiMonumentsUrl =
    "https://historical-national-monuments.herokuapp.com/monuments/";

  // Define/declare loadingMessage variable that will be used in showLoadingMessage() and hideLoadingMessage()
  const loadingMessage = $("#loading-message-placeholder");

  function loadList() {
    showLoadingMessage();
    return fetch(apiMonumentsUrl)
      .then(function (response) {
        console.log(response);
        return response.json();
      })
      .then(function (json) {
        console.log(json);
        json.forEach(function (item) {
          // Create a monument Object for each item
          let monument = {
            id: item._id,
            name: item.name,
            wikipediaLinkEn: item.wikipediaLinkEn,
            imageUrl: item.thumbImgUrl,
            shortDescription: item.shortDescription,
          };
          console.log(monument);
          // Add this new monument Object to the monumentsList Array
          addv(monument);
        });
        hideLoadingMessage();
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  function loadDetails(item) {
    // Function makes a call to the single monument the user is looking for and returns the details of this specific monument

    let url =
      "https://historical-national-monuments.herokuapp.com/monuments/" +
      item.id;

    console.log("Url for further monument details: ", url);

    console.log("Requested item is:", item);

    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.type = details.type;
        item.cityLocation = details.cityLocation;
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  function showLoadingMessage() {
    loadingMessage.text("LOADING... Please wait...");
    loadingMessage.prepend(
      '<img id="loading-spinner-icon" src="./img/spinner.gif" />'
    );
  }

  function hideLoadingMessage() {
    loadingMessage.empty();
  }

  // When called getAll returns the list of monuments
  function getAll() {
    // console.log("Full list", monumentsList);
    return monumentsList;
  }

  // When called, adds a monument Object to the monument list
  function add(monument) {
    monumentsList.push(monument);
  }

  // When called, this function checks that the entered value is an Object
  function addv(monument) {
    // Check entered monument is an Object
    if (typeof monument === "object") {
      return add(monument);
    } else {
      alert("Monument not added, entered data shall be an Object");
    }
  }

  function filterMonument(inputValue) {
    const list = $(".listItem");
    console.log(list);
    list.each(function () {
      let item = $(this);
      let name = item.text().toLowerCase();

      if (name.includes(inputValue)) {
        item.show();
      } else {
        item.hide();
      }
    });
  }

  function addListItem(monument) {
    const listMonuments = $(".row-monuments-list");

    const listItem = $(
      '<div class=" col-6 col-md-4 col-lg-3 listItem" align="center"></div>'
    );

    // Creates a button and add it to the DOM
    let buttonMonument = $(
      '<button type="button" class="btn btn-light card mt-2" data-toggle="modal" data-target="#ModalCenter"><img src="' +
        monument.imageUrl +
        '" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">' +
        monument.name +
        "</h5></div></button>"
    );

    listItem.append(buttonMonument);

    listMonuments.append(listItem);

    // Add an event listener to our button element
    buttonMonument.on("click", function () {
      showDetails(monument);
    });
  }

  function showDetails(monument) {
    // console.log("details from showDetails: ", monument);
    // showModal(monument);
    loadDetails(monument).then(function () {
      showModal(monument);
    });
  }

  function showModal(monument) {
    console.log("monument from showModal: ", monument);

    const modalBody = $(".modal-body");
    const modalTitle = $(".modal-title");
    const modalFooter = $(".modal-header");

    modalTitle.empty();
    modalBody.empty();

    let nameElement = $("<h1>" + monument.name + "</h1>");
    console.log("monument name from showModal: ", monument.name);

    const imageElement = $(
      '<img class="modal-img mx-auto d-block" style="width:100%">'
    );
    imageElement.attr("src", monument.imageUrl);
    let summaryElement = $(
      '<div class="modal-scores-summary">' +
        monument.shortDescription +
        "</div>"
    );

    let typeElement = $("<p>" + "Monument Type: " + monument.type + "</p>");

    let cityElement = $("<p>" + "City: " + monument.cityLocation + "</p>");

    let buttonLinkElement = $("#link-to-monument-on-wikipedia");
    buttonLinkElement.attr("href", monument.wikipediaLinkEn);

    modalTitle.append(nameElement);
    modalBody.append(imageElement);
    modalBody.append(summaryElement);
    modalBody.append(typeElement);
    modalBody.append(cityElement);
  }

  // monumentsRepository function will return either getAll, add etc... and then trigger the appropriate function
  return {
    getAll: getAll, // if monumentsRepository.getAll() is selected then this will trigger the getAll(monument) function
    add: add, // if monumentRepository.add() is selected then this will trigger the add(monument) function
    addv: addv, // if monumentRepository.add() is selected then this will trigger the addv(monument) function
    filterMonument: filterMonument,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showLoadingMessage: showLoadingMessage,
    hideLoadingMessage: hideLoadingMessage,
  };
})();

// Load Monuments from the API
monumentsRepository.loadList().then(function () {
  monumentsRepository.getAll().forEach(function (monument) {
    return monumentsRepository.addListItem(monument);
  });
  // monumentsRepository.hideLoadingMessage();
});

// Search functionality
$(document).ready(function () {
  search();
});

function search() {
  $("#user-search-input").on("keyup", function () {
    let inputValue = $("#user-search-input").val();
    console.log("inputValue: ", inputValue);
    monumentsRepository.filterMonument(inputValue);
  });
}

$("#user-search-input").on("keypress", function (event) {
  if (event.which == "13") {
    event.preventDefault(); // stop the default behavior of the form submit.
    search();
    $("#navbarToggler").removeClass("show");
  }
});
