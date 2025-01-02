// Google map element
let map = null;
// Keep track of markers (flags, dotted line, etc.) for removal when new location is clicked
let markerList = [];

// List of all coordinates as a list of lists of numbers.
let coordinates = null;

// This is for the home screen panning animation
let scrollLng = 31;

// Variable for keeping track of guess vs. view mode
let guessing = false;

// Button for switching the text
let guessButton = document.getElementById("guessButton");

// Hide guess button until they click "start game"
document.getElementById("guessButton").style.display = "none";

// These are the randomly generated coordinates that get generated when the user clickes "new location"
let recentLat = 0;
let recentLong = 0;
let recentHeading = 0;

// Random styles for the map
const stylesOff = [
    {
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
    }
];
const stylesOn = [
    {

    }
];

// Get CSV
getCoordinatesArray('coordinates.csv')
    .then(coordinatesReturn => {
        coordinates = coordinatesReturn;
    })
    .catch(error => {
        console.error('Error reading or parsing CSV:', error);
    });

// Turn the CSV into a list of coordinates and save in variable coordinates
async function getCoordinatesArray(filePath) {
    const csvText = await readCSV(filePath);
    const coordinates = parseCoordinates(csvText);
    return coordinates;
}

// Parse the CSV text into a list of coordinates
function parseCoordinates(csvText) {
    const lines = csvText.trim().split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("//")) {
            lines.splice(i, 1);
            i--;
        }
    }
    return lines.map(line => {
        const [long, lat] = line.split(', ').map(Number);
        return [long, lat];
    });
}

// Get text from CSV
async function readCSV(filePath) {
    const response = await fetch(filePath);
    const csvText = await response.text();
    return csvText;
}

// Set up map, this function runs only once.
function initMap() { // fist is long, second is lat
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 8, lng: scrollLng },
        zoom: 3,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        disableDefaultUI: true,
        styles: stylesOn,
        // tilt: 0,
        draggable: false,
        zoomControl: true,
        tilt: 45,
        // heading: 45
    });

    animate();

    // I know this is ugly lol, I'll fix it later
    google.maps.event.addListener(map, 'click', function(event) {

        if (!guessing) return;

        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        markerList.push(
            new google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
            })
        );

        markerList.push(
            new google.maps.Marker({
                position: { lat: recentLat, lng: recentLong},
                map: map
            })
        )

        const dotSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 1,
            scale: 3
        };

        const dottedLine = new google.maps.Polyline({
            path: [
                { lat: lat, lng: lng },
                { lat: recentLat, lng: recentLong}
            ],
            strokeOpacity: 0,
            icons: [{
                icon: dotSymbol,
                offset: '0',
                repeat: '10px'
            }],
            map: map
        });

        dottedLine.setMap(map);

        markerList.push(dottedLine);
    });
}

function getRandomPosition() {
    return coordinates[Math.floor(Math.random() * coordinates.length)];
}

function newLocationClick() {

    document.getElementById("newGameButton").innerText = "New Location";

    for (let i = 0; i < markerList.length; i++) {
        markerList[i].setMap(null);
    }

    scrollLng = null;
    const pos = getRandomPosition();
    recentHeading = Math.floor(Math.random() * 360);
    newMapLocation(pos[1], pos[0], recentHeading);
    recentLat = pos[1];
    recentLong = pos[0];
    guessing = false;
    guessButton.style.display = "inline-block";
    guessButton.innerText  = "Guess Location";
}

function newMapLocation(lat, lng, heading = 0) {
    map.setZoom(15);
    map.draggable = false;
    map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    map.setHeading(heading);
    map.setCenter({ lat: lat, lng: lng });
    console.log("lat:", lat, "long:", lng);
}

// This just does the nice scroll animation on the home screen.
function animate() {
    if (scrollLng === null) return;
    scrollLng += 0.021111111;
    map.setCenter({ lat: 8, lng: scrollLng });
    setTimeout(animate);
}

// Switch between guess and view mode
function readyToGuessClick() {
    guessing = !guessing;
    if (guessing) {
        map.setHeading(0);
        map.setCenter({lat: 8, lng: -35});
        map.setZoom(3);
        map.draggable = true;
        map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        // map.styles = stylesOn;
        guessButton.innerText  = "Vew Satellite Map";
    } else {
        map.setHeading(90);
        map.setZoom(15);
        map.draggable = false;
        map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        map.setCenter({ lat: recentLat, lng: recentLong });
        // map.styles = stylesOff;
        guessButton.innerText  = "Guess Location";
    }
}

// Nothing to see here, this code does nothing at all.
const script = document.createElement('script');
let superMarioBros = "azIA".split('').reverse().join('');
superMarioBros += "SyAnefJXAmG5aW" + "-uKf4QvL" + "oBtXQJ-QbB";
superMarioBros += "QAJ".split('').reverse().join('');
script.src = "https://ma" + "ps.goo" + "gleap" + "is.com/ma" + "ps/a" + "pi/js?ke" + "y=" + superMarioBros + "&callback=initM" + "ap";
script.async = false;
document.head.appendChild(script);

// TODO
// animates when zooms out
// rotation
