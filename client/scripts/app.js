const app = {};

app.init = () => {
  app.fetch();
};

app.friends = {};

app.rooms = {};

app.handleUsernameClick = (div) => {
  const className = div.innerHTML;
  if (app.friends[className]) {
    delete app.friends[className];
    $("." + className).css("font-weight", "normal");
  } else {
    app.friends[className] = className;
    console.log(app.friends);
    $("." + className).css("font-weight", "Bold");
  }
};

app.handleSubmit = () => {
  let foundRoom = $(".subtitle").html();
  console.log(foundRoom, 1)
  let message = {
    username: location.search.slice(10),
    text: document.getElementById("comment").value,
    roomname: foundRoom
  };
  $("#comment").val('');
  app.send(message);
  // if in room run select room else run fetch
  if (foundRoom !== undefined) {
    console.log('aeurhakeurhakuerhakeurh')
    app.selectRoom(foundRoom);
  } else {
    app.fetch();
  }
};

app.createRoom = () => {
  let room = document.getElementById("createroom").value;
  $("#createroom").val('');
  if (!app.rooms[room]) {
    app.renderRoom(room);
    app.rooms[room] = room;
  }
  app.selectRoom(room);
}

app.server = 'http://parse.nyc.hackreactor.com/chatterbox/classes/messages'

app.send = (message) => {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: message,
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = () => {
  app.clearMessages();
  $.ajax({
    url: app.server,
    type: 'GET',
    data: { "order": "-createdAt" },
    success: function (data) {
      console.log('chatterbox: Messages recieved');
      let messages = data.results;
      messages.reverse();
      messages.forEach((message) => {
        app.renderMessage(message);
        if (message.roomname && !app.rooms[message.roomname]) {
          let room = message.roomname;
          app.rooms[room] = room;
          app.renderRoom(room);
        }
      });
      for (let friend in app.friends) {
        $("." + friend).css("font-weight", "Bold");
      }
    },
    error: function (data) {
      console.error('chatterbox: Failed to recieve messages', data);
    }
  });
};

app.clearMessages = () => {
  $("#chats").empty();
}

app.renderMessage = (message) => {
  let username = encodeURI(message.username);
  let text = encodeURI(message.text);
  let createdAt = message.createdAt;
  
  $('#chats').prepend("<div class='panel panel-default'><div class='panel-body'>" +
  "<div class='username " + 
   username + 
   " btn btn-link' onclick=app.handleUsernameClick(this) id=" +
   username + 
   ">" + 
  username + 
  "</div><div class='usermessage'>" + 
  text +
  "</div><div class='usermessagedate'>" + 
  createdAt +
  "</div></div></div>");
}

app.renderRoom = (room) => {
  $(".dropdown-menu").append($('<li><a id='+ room + ' href="#" onclick=app.selectRoom(this.id)>' + room + '</a></li>'));
}

app.selectRoom = (room) => {
  app.clearMessages();
  $(".subtitle").remove();
  console.log(room)
  if (room === "allrooms") {
    console.log("all rooms")
    app.fetch();
  } else {
    console.log('else')
    $("#title").append("<h3 class='subtitle' id='" + room + "'>" + room + "<h3>");
    $.ajax({
        url: app.server,
        type: 'GET',
        data: { "order": "-createdAt" },
        success: function (data) {
          console.log('chatterbox: Messages recieved');
          let messages = data.results;
          messages.reverse();
          messages.forEach((message) => {
            if (message.roomname === room) {
              app.renderMessage(message);
            }
            if (message.roomname && !app.rooms[message.roomname]) {
              let room = message.roomname;
              app.rooms[room] = room;
              app.renderRoom(room);
            }
          });
          for (let friend in app.friends) {
            $("." + friend).css("font-weight", "Bold");
          }
        },
        error: function (data) {
          console.error('chatterbox: Failed to recieve messages', data);
        }
      });
  }
}

app.init();