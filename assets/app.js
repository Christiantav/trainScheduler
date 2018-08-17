$( document ).ready(function() {
  
var config = {
    apiKey: "AIzaSyDwXkyXdC5pARfHCpnCrGvCGuthZeiLDm4",
    authDomain: "trainscheduler-ce2fd.firebaseapp.com",
    databaseURL: "https://trainscheduler-ce2fd.firebaseio.com",
    storageBucket: "trainscheduler-ce2fd.appspot.com"
};

firebase.initializeApp(config);

var trainInformation = firebase.database();  

  // Save a new recommendation to the database using the input in the for
$("#submitTrain").on("click", function(){

  // Get input values from each of the form elements
  var train = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrainTime = $("#firstTrainTime").val().trim();
  var frequency = $("#frequency").val().trim();

  console.log("Hello");

  // Push a new train information set to the database using those values
   var newTrainInformation = {
    train: train,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency
  };

  trainInformation.ref().push(newTrainInformation);

  // Logs everything to console
  console.log(newTrainInformation.train);
  console.log(newTrainInformation.destination);
  console.log(newTrainInformation.firstTrainTime);
  console.log(newTrainInformation.frequency);


  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrainTime").val("");
  $("#frequency").val("");

  return false;

});

trainInformation.ref().on("child_added", function(childSnapshot, prevChildKey) {

  
    // Store everything into a variable.
    var trainName = childSnapshot.val().train;
    var trainDestination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstTrainTime;
    var trainFrequency = childSnapshot.val().frequency;
  
    var trainTimeFormat = firstTrain.split(":");
    var trainTime = moment().hours(trainTimeFormat[0]).minutes(trainTimeFormat[1]);
    var now = moment.max(moment(), trainTime);
    var trainMinutes;
    var trainArrival;
  
    // If the first train is later than the current time, sent arrival to the first train time
    if (now === trainTime) {
      trainArrival = trainTime.format("hh:mm A");
      trainMinutes = trainTime.diff(moment(), "minutes");
    } else {
  
      // Calculate the minutes until arrival using hardcore math
      // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
      // and find the modulus between the difference and the frequency.
      var differenceTimes = moment().diff(trainTime, "minutes");
      var remainingMinutes = differenceTimes % trainFrequency;
      trainMinutes = trainFrequency - remainingMinutes;
      // To calculate the arrival time, add the tMinutes to the current time
      trainArrival = moment().add(trainMinutes, "m").format("hh:mm A");
    }
    console.log("trainMinutes:", trainMinutes);
    console.log("trainArrival:", trainArrival);
  
  $("#trainTable").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + " mins" + "</td><td>" + trainArrival + "</td><td>" + trainMinutes + "</td></tr>");
});
});