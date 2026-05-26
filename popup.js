function roundToNearestHalfHour(timeString) {
    if (!timeString) return "";

    //Split the time string into [hours, minutes] and convert to integers
    let timeParts = timeString.split(':');

    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1]);

    //Rounding math
    if (minutes < 15) {
        minutes = 0;
    } else if (minutes >= 15 && minutes < 45){
        minutes = 30;
    } else {
        minutes = 0;
        hours += 1;
    }
    if (hours === 24) hours = 0;
    
    //Format back into a string with leading zeros
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
}
//Wait for HTML to fully load before running JS
document.addEventListener('DOMContentLoaded', function() {
    //Grab pointers
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
    const endTimeInput = document.getElementById('endTimeInput');
    const generateBtn = document.getElementById('generateBtn');
    const resultsArea = document.getElementById('resultsArea');

    //Database of libraries
    const libraries = [
        {name: "Robarts Library and Commons", path: "robarts"},
        {name: "Gerstein Science", path: "gerstein"},
        {name: "OISE", path: "OISE"},
        {name: "E.J. Pratt Library", path: "ejpratt"},
        {name: "John M. Kelly Library", path: "kelly"},
        {name: "Music Library", path: "music"},
        {name: "University College Library", path: "uclibrary"},
        {name: "John W. Graham Library", path: "graham"},
        {name: "Eberhard Zeidler Library", path: "zeidler"},
        {name: "Industrial Relations Library", path: "IRHRlibrary"},
        {name: "UTSC Library", path: "utsclibrary"},
        {name: "UTM Library", path: "utmldel"}
    ];

    const baseURL = "https://libcal.library.utoronto.ca/r/search/";

    //Listening for click
    generateBtn.addEventListener('click', function() {
        const selectedDate = dateInput.value;
        const selectedTime = timeInput.value;
        const selectedEndTime = endTimeInput.value;
        //Input validation
        if (!selectedDate || !selectedTime || !selectedEndTime) {
            resultsArea.innerHTML = "<p style='color: red;'>Please select a date and all time fields.</p>";
            return;
        }

        const roundedTime = roundToNearestHalfHour(selectedTime);
        const roundedEndTime = roundToNearestHalfHour(selectedEndTime);

        timeInput.value = roundedTime;
        endTimeInput.value = roundedEndTime;

        //Builfing HTML string as an unordered list
        let finalHTML = '<ul>';

        //Looping through the libraries to generate links and add them to the HTML string
        for (let i = 0; i < libraries.length; i++) {
            const lib = libraries[i];

            const safeStartTime = encodeURIComponent(roundedTime);
            const safeEndTime = encodeURIComponent(roundedEndTime);
            const bookingURL = `${baseURL}${lib.path}?m=t&gid=0&capacity=0&zone=0&date=${selectedDate}&date-end=${selectedDate}&start=${safeStartTime}&end=${safeEndTime}`;
            finalHTML += `<li><a href='#' class="lib-link" data-url="${bookingURL}">${lib.name}</a></li>`;
        }
        finalHTML += '</ul>';

        //Updating the results area with the generated HTML
        resultsArea.innerHTML = finalHTML;
    });
    resultsArea.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('lib-link')){
            event.preventDefault();

            const targetUrl = event.target.getAttribute('data-url');

            chrome.tabs.create({
                url: targetUrl,
                active: false
            });
        }    
    });
});