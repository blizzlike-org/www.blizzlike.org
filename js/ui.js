function ui_init(event)
{
  console.log('initializing blizzlike-ui');
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
      p.innerHTML = 'thank you for signing up.';
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

window.addEventListener('load', ui_init);
