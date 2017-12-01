const app = {};

app.init = () => {}

app.send = () => {
  $.ajax({
    //url: 'http://parse.nyc.hackreactor.com/chatterbox/classes/messages',
    type: 'POST'
    //data: {};
  })
}

app.fetch = () => {
  $.ajax({
    type: 'GET'
  })
}

//http://parse.nyc.hackreactor.com/chatterbox/classes/messages
