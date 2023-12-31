// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Players');
    self.displayName = 'NBA Players List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(15);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };


    // Assuming your API endpoint is 'https://example.com/arenas'
const apiUrl = 'http://192.168.160.58/NBA/API/Players';


fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data); // Log the data to see its structure

    // Assuming data is an array of arena objects
    data.forEach(player => {
      // Create HTML elements and populate them with data
      const playerElement = document.createElement('div');
      // ... rest of the code
    });
  })
// Fetch data from the API
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Assuming data is an array of arena objects
    data.forEach(player => {
      // Create HTML elements and populate them with data
      const playerElement = document.createElement('div');
      playerElement.innerHTML = `
        <h2>${player.Name}</h2>
        <p>Birthdate: ${player.Birthdate}</p>
        <p>CountryId: ${player.CountryId}</p>
        <p>CountryName: ${player.CountryName}</p>
        <p>DraftYear: ${player.DraftYear}</p>
        <p>PositionId: ${player.PositionId}</p>
        <p>PositionName: ${player.PositionName}</p>
        <p>Height: ${player.Height}</p>
        <p>Weight: ${player.Weight}</p>
        <p>School: ${player.School}</p>
        <p>Photo: ${player.Photo}</p>
        <p>Biography: ${player.Biography}</p>
        <p>Seasons: ${player.Seasons}</p>
        <p>Teams: ${player.Teams}</p>
        <!-- Add more elements as needed -->
      `;

      // Append the arena element to the HTML body or a specific container
      document.body.appendChild(playerElement);
    });
  })
  .catch(error => console.error('Error fetching data:', error));


    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getPlayers...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            //self.SetFavourites();
        });
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})



var yourDataObject = {
    Name: "Your dynamic content here"
};

// Get the value from the data-bind attribute
var dynamicContent = $(".card-content").data("bind");

// Set the content of the h2 element
$("#dynamicHeading").text(yourDataObject[dynamicContent]);