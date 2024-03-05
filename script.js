const alarmsList = [];
let alarmIndex = 0;
// ====================================================== //
// ================== Helper Functions ================== //
// ====================================================== //

// --- function to return current time --- //
function getTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// ====================================================== //
// ================== Render Functions ================== //
// ====================================================== //

// -------- Clock Displaying Time -------- //
function timeRenderer() {
  const timeContainer = document.getElementById("timeContainer");
  timeContainer.innerHTML = "";
  const timeElement = document.createElement("h1");
  timeElement.innerHTML = getTime();
  timeContainer.appendChild(timeElement);
}
// ##################################################################### //
// ########## The Magic Trick is to call timeRenderer every second ######### //
// ##################################################################### //
setInterval(timeRenderer, 1000);

// ------------ Input for Time ----------- //
function optionsRenderer() {
  const hourElement = document.getElementById("hoursSelect");
  // Loop to generate options from 0 to 23
  for (let i = 0; i <= 23; i++) {
    const option = document.createElement("option");
    option.value = i.toString().padStart(2, "0"); // Add leading zero if needed
    option.textContent = i.toString().padStart(2, "0"); // Add leading zero if needed
    hourElement.appendChild(option);
  }

  const minuteElement = document.getElementById("minuteSelect");
  // Loop to generate options from 0 to 23
  for (let i = 0; i <= 59; i++) {
    const option = document.createElement("option");
    option.value = i.toString().padStart(2, "0"); // Add leading zero if needed
    option.textContent = i.toString().padStart(2, "0"); // Add leading zero if needed
    minuteElement.appendChild(option);
  }
}
optionsRenderer();

function dateRenderer() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1; // Months are zero-based, so we add 1
  let day = today.getDate();

  // Adjustig here the month and the day to have leading zeros if needed
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  // Today as Default value for the date input
  document.getElementById("dateInput").value = `${year}-${month}-${day}`;

  // Set the minimum date for the date input to today's date
  document.getElementById("dateInput").min = `${year}-${month}-${day}`;
}
dateRenderer();

// ====================================================== //
// ======== Alram time Logic to Render and set it ======= //
// ====================================================== //

function renderAlarm() {
  const alarmContainer = document.getElementById("alarmContainer");

  //  Creating structure to store a single alarm  //
  const alarmElement = document.createElement("div");
  alarmElement.className = "rowFlex alarmElement";

  const hours = parseInt(document.getElementById("hoursSelect").value);

  const minutes = parseInt(document.getElementById("minuteSelect").value);

  // ------------------Safety Chek if Time is selected or not--------------------- //

  if (isNaN(hours) || isNaN(minutes)) {
    alert("Please Select Time");
    return; // In case not selected any input
  }

  // - For inserting time in alarm section - //
  const timeElement = document.createElement("h3");
  let alarmTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  //For Displaying Date in alarm section
  const alarmDate = document.getElementById("dateInput").value;
  const dateElement = document.createElement("h4");

  // ====================================================== //
  // =============== Setting the alarm Logic ============== //
  // ====================================================== //

  /*
  Creating date with time to get time remaining 
  for alarm to off by difference with time of setting alarm
*/
  const alarmStamp = new Date(alarmDate);
  alarmStamp.setHours(hours); // Set hours
  alarmStamp.setMinutes(minutes); // Set minutes
  alarmStamp.setSeconds(0);

  const dateTimeInput = new Date(
    alarmStamp.getFullYear(),
    alarmStamp.getMonth(),
    alarmStamp.getDate(),
    alarmStamp.getHours(),
    alarmStamp.getMinutes()
  );
  const currentDate = new Date();
  const countDownRemaining = dateTimeInput.getTime() - currentDate.getTime();

  //  Safety check if time provided is past already  //
  if (countDownRemaining <= 0) {
    alert("Time can't be of past");
    return;
  }
  // Storing the reference to clear the setInteval
  clearRef = setTimeout(() => {
    document.getElementById("alarmOutput").style.display = "flex";
    document.getElementById("alarmSound").play();
    startVibrating();
  }, countDownRemaining);
  // ----- Putting the alarm to storage ---- //
  alarmIndex++;
  alarmsList.push({
    id: alarmIndex,
    alarmTime: alarmTime,
    alarmDate: alarmDate,
    clearRef: clearRef,
  });

  // ---- Setting it finally to display ---- //
  timeElement.innerHTML = alarmTime;
  dateElement.innerHTML = alarmDate;

  // Delete button to remove a particular alarm
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    alarmContainer.removeChild(alarmElement);

    //  To clear the alarm from storage too  //
    const indexToDelete = alarmsList.findIndex(
      (alarm) => alarm.alarmTime === alarmTime
    );
    // clearing setTimeout
    clearTimeout(alarmsList[indexToDelete].clearRef);
    // If alarm with matching alarmTime is found, delete it
    if (indexToDelete !== -1) {
      alarmsList.splice(indexToDelete, 1);
    }

    //  To hide the alarmContainer when empty  //
    if (alarmsList.length === 0) {
      alarmContainer.style.display = "none";
    }
  });
  //  To apply Styles to delete button  //
  deleteButton.className = "deletebutton";

  //Populating Single Alarm Div
  alarmElement.appendChild(timeElement);
  alarmElement.appendChild(dateElement);
  alarmElement.appendChild(deleteButton);

  // Populating Alarm container
  alarmContainer.appendChild(alarmElement);

  //  Displaying the hidden display for alarmsList  //
  alarmContainer.style.display = "flex";
}

// ====================================================== //
// ================= Logic to stop Alarm ================ //
// ====================================================== //
function stopAlarm() {
  document.getElementById("alarmSound").pause();
  stopVibrating();
  document.getElementById("alarmOutput").style.display = "none";
}

// ====================================================== //
// =================== Animation Logic ================== //
// ====================================================== //

const image = document.getElementById("clockImg");

function startVibrating() {
  image.style.animation = "vibrate 0.3s infinite";
}
function stopVibrating() {
  image.style.animation = "none";
}
