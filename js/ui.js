function ui_create_login_dialog()
{
  var parent = document.getElementById('header');
  var box = document.createElement('div');
  box.id = 'login-dialog';

  var form = document.createElement('form');
  form.id = 'loginacc';
  form.onsubmit = function() { return ui_signin(this); };
  box.appendChild(form);

  var username = document.createElement('input');
  username.type = 'text';
  username.name = 'username';
  username.placeholder = 'Username';
  form.appendChild(username);

  var password = document.createElement('input');
  password.type = 'password';
  password.name = 'password';
  password.placeholder = 'Password';
  form.appendChild(password);

  var submit = document.createElement('input');
  submit.type = 'submit';
  submit.value = 'sign in';
  form.appendChild(submit);

  parent.insertBefore(box, parent.childNodes[0]);
}

function ui_init(event)
{
  console.log('initializing blizzlike-ui');
  ui_refresh_menu();
  ui_load_realms();
}

function ui_load_realms()
{
  var ui_load_realms_cb = function(success, d)
  {
    if(success)
    {
      var realm_table = document.getElementById('realms')
      for(var i = 0; i < d.length; ++i)
      {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerHTML = d[i].name;
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = d[i].mode;
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = d[i].population;
        if(d[i].population == 'low')
          td.classList.add('green');
        if(d[i].population == 'high')
          td.classList.add('red');
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = d[i].state;
        if(d[i].state == 'new player' || d[i].state == 'recommended')
          td.classList.add('green');
        else
          td.classList.add('red');
        tr.appendChild(td);
        realm_table.appendChild(tr);
      }
    }
  }

  core_realm_fetch(ui_load_realms_cb);
}

function ui_refresh_menu()
{
  var token = read_cookie();
  var logon = document.getElementById('login');
  if(token)
  {
    console.log('reuse access token');
    logon.innerHTML = '<button onclick="return ui_signout();">LOGOUT</button>';
  }
  else
  {
    console.log('welcome guest');
    logon.innerHTML = '<button onclick="return ui_toggle_login();">LOGIN</button>';
  }
}

function ui_signin(form)
{
  var data = {
    username: form.username.value,
    password: form.password.value,
  };

  var ui_signin_cb = function(success, d)
  {
    if(success)
    {
      form.username.value = '';
      form.password.value = '';
      ui_refresh_menu();

      var p = document.createElement('p');
      p.id = 'signin_msg';
      p.classList.add('msg');
      p.innerHTML = 'You\'re now signed in.';
      form.parentNode.insertBefore(p, form);
      setTimeout(function() {
        var p = document.getElementById('signin_msg');
        p.parentNode.removeChild(p);
      }, 5000);
    }
    else
    {
      var reason = (d.reason) ? d.reason : 'no reason';
      console.log('SIGNIN_CB: failed: ' + reason)
    }

    if(!d.username)
      form.username.classList.add('error');
    else
      form.username.classList.remove('error');

    if(!d.password)
    {
      form.password.classList.add('error');
    }
    else
    {
      form.password.classList.remove('error');
    }
  }

  core_account_authenticate(data, ui_signin_cb);

  // prevent browser to load form action url
  return false;
}

function ui_signout()
{
}

function ui_signup(form)
{
  var data = {
    username: form.username.value,
    email: form.email.value,
    password: form.password.value,
    repeat: form.repeat.value
  };

  var ui_signup_cb = function(success, d)
  {
    if(success)
    {
      form.username.value = '';
      form.email.value = '';
      form.password.value = '';
      form.repeat.value = '';

      var p = document.createElement('p');
      p.id = 'signup_msg';
      p.classList.add('msg');
      p.innerHTML = 'Your Account has been created. Thank you for signing up.';
      form.parentNode.insertBefore(p, form);
      setTimeout(function() {
        var p = document.getElementById('signup_msg');
        p.parentNode.removeChild(p);
      }, 5000);
    }

    if(!d.username)
      form.username.classList.add('error');
    else
      form.username.classList.remove('error');

    if(!d.email)
      form.email.classList.add('error');
    else
      form.email.classList.remove('error');

    if(!d.password)
    {
      form.password.classList.add('error');
      form.repeat.classList.add('error');
    }
    else
    {
      form.password.classList.remove('error');
      form.repeat.classList.remove('error');
    }
  }

  core_account_create(data, ui_signup_cb);

  // prevent browser to load form action url
  return false;
}

function ui_toggle_login()
{
  var loginbox = document.getElementById('login-dialog');
  if(loginbox !== null)
  {
    loginbox.parentNode.removeChild(loginbox);
  }
  else
  {
    ui_create_login_dialog();
  }

  return false;
}

window.addEventListener('load', ui_init);
