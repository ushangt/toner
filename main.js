var gmail;
var $;

function refresh(f) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}


var main = function(){
  gmail = new Gmail();
  console.log('Hello,', gmail.get.user_email());
  registerToComposeEvent(gmail)
}

function registerToSendEvent(gmail){
    gmail.observe.before('send_message', function(url, body, data, xhr){
        var body_params = xhr.xhrParams.body_params;
        console.log(data);
        console.log(data.body);
    });

}

function registerToComposeEvent(gmail){
    // DOM observers
    gmail.observe.on("compose", function(compose, type) {

        // type can be compose, reply or forward
        console.log('api.dom.compose object:', compose, 'type is:', type );  // gmail.dom.compose object
        // Add compose button
        addComposeButton(gmail);
    });
}

function addComposeButton(gmail){
    var compose_ref = gmail.dom.composes()[0];
    gmail.tools.add_compose_button(compose_ref, '<button class="T-I J-J5-Ji T-I-atl L3 T-I-Zf-aw2"> Analyse </button>', function() {
        // Code here
        //Fire webservice call and show results
        console.log(compose_ref.$el.context.innerText);
        callWatsonAPI(compose_ref.$el.context.innerText);
    }, '');
}

function callWatsonAPI(text){
    var data = {
        "text" : text
    };
    jQuery.ajax({
        type: "POST",
        url: "https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2016-05-19",
        data: data,
        dataType: "json",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',

        },
        success: function(success_data){
            console.log(success_data);
        }
    });
}

refresh(main);
