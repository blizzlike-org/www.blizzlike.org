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
        td.innerHTML = core_stdlib_resolve_mode(d[i].icon);
        tr.appendChild(td);
        td = document.createElement('td');
        var population = core_stdlib_resolve_population(d[i].population);
        td.innerHTML = population
        if(population == 'low')
          td.classList.add('green');
        if(population == 'high')
          td.classList.add('red');
        tr.appendChild(td);
        td = document.createElement('td');
        if(d[i].state == 1)
        {
          td.innerHTML = 'online';
          td.classList.add('green');
        }
        else
        {
          td.innerHTML = 'offline';
          td.classList.add('red');
        }
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

window.addEventListener('load', ui_init);
