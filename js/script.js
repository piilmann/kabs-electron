let $ = require("jquery")

var beerCart = 0;
var ciderCart = 0;
var sodaCart = 0;
var cocioCart = 0;
var username;
var id;

const sqlite3 = require('sqlite3').verbose();


//Init
$(document).ready(function(){
  $("#buyitemscontainer").hide();
  //$("#numpadcontainer").hide();
});

function loginDB(password) {
  // Database
  const db = new sqlite3.Database('db/kabsDatabase.db', (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  let sql = `SELECT Id id, Name name, Beer beer, Cider cider, Soda soda, Cocio cocio FROM users WHERE password  = ?`;
  var params = [password]

  db.get(sql, params, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    if(row != undefined){
      //logged in
      username = row.name;
      id = row.id;
      updateStats(row.beer, row.cider, row.soda, row.cocio);
      toggleScreen();
    } else {
      wrongPass();
      console.log(`No user found with the password: ${password}`)
    }
  });
  db.close();
}

function buyItems(){
  if(beerCart > 0 || ciderCart > 0 || sodaCart > 0 || cocioCart > 0){
    // Database
    const db = new sqlite3.Database('db/kabsDatabase.db', (err) => {
      if (err) {
        console.error(err.message);
      }
    });

    let sql = `UPDATE users SET Beer = Beer + ?, Cider = Cider + ?, Soda = Soda + ?, Cocio = Cocio + ? WHERE Id  = ?`;
    var data = [beerCart, ciderCart, sodaCart, cocioCart, id]

    db.run(sql, data, function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);

    });
    db.close();
    resetCart();
  }
}

function wrongPass(){
  var div = $("#inputBoxes");
  div.animate({left: '10px'}, 60);
  div.animate({left: '-10px'}, 60);
  div.animate({left: '10px'}, 60);
  div.animate({left: '-10px'}, 60);
  div.animate({left: '0px'}, 60);
}

function toggleScreen() {
  if($("#buyitemscontainer").is(":visible")){
    $("#buyitemscontainer").hide();
    $("#numpadcontainer").show();
  } else {
    $("#buyitemscontainer").show();
    $("#numpadcontainer").hide();
    $("#username").html("Hej "+username+"! <3")
  }
}

moveOnMax = function (field, nextFieldID) {
  if (field.value != '') {
      document.getElementById(nextFieldID).focus();
  }
}

addNumber = function (field) {
  if (!$("#1").val()){
    $("#1").val(field.name).addClass("dot");
  } else if (!$("#2").val()){
    $("#2").val(field.name).addClass("dot");
  } else if (!$("#3").val()){
    $("#3").val(field.name).addClass("dot");
  } else if (!$("#4").val()){
    $("#4").val(field.name).addClass("dot");
    checkUser();
  }
}

deleteAll = function() {
  $("#1").val('').removeClass("dot");
  $("#2").val('').removeClass("dot");
  $("#3").val('').removeClass("dot");
  $("#4").val('').removeClass("dot");
}

removeNumber = function() {
  if ($('#4').val()) {
    $("#4").val('').removeClass("dot");
  } else if ($('#3').val()) {
    $("#3").val('').removeClass("dot");
  } else if ($('#2').val()) {
    $("#2").val('').removeClass("dot");
  } else if ($('#1').val()) {
    $("#1").val('').removeClass("dot");
  }
}

checkUser = function() {
  var result = $("#1").val() + $("#2").val() + $("#3").val() + $("#4").val();
  loginDB(result);
  //toggleScreen();
  deleteAll();
  //$("#userLoggedIn").html("Bruger logged in: " + result)
}

$(document).keyup(function (e) {
  if (e.keyCode == 8) {
    removeNumber();
  }
});

function addToCart(id){
  switch(id) {
      case 1:
          beerCart++;
          refreshStatus();
          break;
      case 2:
          ciderCart++;
          refreshStatus();
          break;
      case 3:
          sodaCart++;
          refreshStatus();
          break;
      case 4:
          cocioCart++;
          refreshStatus();
          break;
  }
}

function refreshStatus(){
  if(beerCart != 0){
      $("#beerCount").html("Øl: " + beerCart)
  } else {
      $("#beerCount").html("");
  }

  if(ciderCart != 0){
      $("#ciderCount").html("Cider: " + ciderCart)
  } else {
      $("#ciderCount").html("");
  }

  if(sodaCart != 0){
      $("#sodaCount").html("Sodavand: " + sodaCart)
  } else {
      $("#sodaCount").html("");
  }

  if(cocioCart != 0){
      $("#cocioCount").html("Cocio: " + cocioCart)
  } else {
      $("#cocioCount").html("");
  }
}

function updateStats(beer, cider, soda, cocio){
  $("#beerTotal").html("Øl: "+beer);
  $("#ciderTotal").html("Cider: "+cider);
  $("#sodaTotal").html("Sodavand: "+soda);
  $("#cocioTotal").html("Cocio: "+cocio);
}

function resetCart(){
  beerCart = 0;
  ciderCart = 0;
  sodaCart = 0;
  cocioCart = 0;
  refreshStatus();
}
