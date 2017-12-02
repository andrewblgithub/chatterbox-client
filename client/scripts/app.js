const app = {};

app.init = () => {
  app.fetch();
};

app.friends = {};

app.handleUsernameClick = (div) => {
  const className = div.innerHTML;
  app.friends[className] = className;
  console.log(app.friends);
  $("." + className).css("font-weight", "Bold");
};

app.handleSubmit = () => {
  let message = {
    username: location.search.slice(10),
    text: document.getElementById("comment").value,
    roomname: "lobby"
  };
  console.log(message);
  console.log(new Date());
  app.send(message);
  app.renderMessage(message);
};

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
  $.ajax({
    url: app.server,
    type: 'GET',
    data: { "order": "-createdAt" },
    success: function (data) {
      console.log(data);
      console.log('chatterbox: Messages recieved');
      let messages = data.results;
      messages.reverse();
      messages.forEach((message) => {
        app.renderMessage(message);
      });
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
  let username = message.username;
  let text = message.text;
  let createdAt = message.createdAt;
  // if (message.createdAt) {
  //   let createdAt = message.createdAt;
  // } else {
  //   let createdAt = new Date();
  // }
  //change data format;
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

app.renderRoom = (lobby) => {
  $("#roomSelect").append($('<a href="#">' + lobby + '</a>'));
}

app.init();