document.addEventListener('DOMContentLoaded', function() {
  restore_options();
  userRailsOauth();
  document.getElementById('myonoffswitch').addEventListener('click', function() {
    save_options();
  });
});

function save_options() {
  // var twitterSwitch = document.getElementById("twitterOn").checked;
  // var faceBookSwitch = document.getElementById("facebookOn").checked;
  // var fbFloorSwitch = document.getElementById("facebookCharFloor").checked;
  // var alwaysUrlSwitch = document.getElementById("alwaysAddUrl").checked;

  chrome.storage.sync.set({
    twitterOn: twitterSwitch,
    facebookOn: faceBookSwitch,
    facebookCharFloor: fbFloorSwitch,
    alwaysAddUrl: alwaysUrlSwitch
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved!';

    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get(null, function(items) {
    //Luke Kedz wrote this callback. It should act like a switch..case for checked
    //boxes.
    document.getElementById("twitterOn").checked = items.twitterOn;
    document.getElementById("facebookOn").checked = items.facebookOn;
    document.getElementById("facebookCharFloor").checked = items.facebookCharFloor;
    document.getElementById("alwaysAddUrl").checked = items.alwaysAddUrl;
  });
};

function userRailsOauth() {
  chrome.identity.getProfileUserInfo(function(userInfo) {
    var message = JSON.stringify(userInfo);

    var promise = new Promise(function(resolve, reject){
      var xml = new XMLHttpRequest();
      xml.open("POST", "http://localhost:3000/api/users", true);
      xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xml.setRequestHeader("Accept", "application/json");
      xml.onload = function() {
        if(xml.status === 200) {
          var responseString = JSON.parse(xml.response);
          chrome.storage.sync.set({
            'chrome_token': responseString.key
          }, function() {
            var status = document.getElementById('status');
            status.textContent = 'Options saved!';
            setTimeout(function() {
              status.textContent = '';
            }, 750);
          });
        } else {
          reject("Your response was bad.")
        };
      };
      xml.send(message);
    });
    return promise;
  });
};