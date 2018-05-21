function read_cookie()
{
  if(document.cookie)
    return document.cookie.split('=')[1]
  return null
}

function validate_email(email)
{
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
}
