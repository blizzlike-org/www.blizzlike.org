function _ajax_call(endpoint, method, callback, data)
{
  var xhr = new XMLHttpRequest();
  var body = (data) ? JSON.stringify(data) : null;

  xhr.onload = function()
  {
    var d = {};

    console.log('API: ' + this.status + ' [' + method + '] ' + endpoint);
    if(this.getResponseHeader('Content-Type') == 'application/json' &&
        this.responseText)
      d = JSON.parse(this.responseText);

    callback(this.status, d);
  }

  xhr.open(method, config.api.url + endpoint, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(body);
}

function core_account_create(data, callback)
{
  var validation = {
    username: true,
    email: true,
    password: true
  }

  var cb = function(status, data)
  {
    var success = (status == 201) ? true : false;
    callback(success, data);
  }

  if(!data.username)
    validation.username = false;

  if(!data.email || !validate_email(data.email))
    validation.email = false;

  if(!data.password || !data.repeat ||
      data.password != data.repeat)
    validation.password = false;

  if(validation.username && validation.email &&
      validation.password)
  {
    delete data.repeat;
    _ajax_call('/v1/account', 'POST', cb, data);
  }
  else
  {
    callback(false, validation);
  }
}

function core_realm_fetch(callback)
{
  var cb = function(status, data)
  {
    var success = (status == 200) ? true : false;
    callback(success, data);
  }

  _ajax_call('/v1/realm', 'GET', cb, null);
}
