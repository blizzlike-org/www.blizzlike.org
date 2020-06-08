/* access the blizzlike realm state API */
const realmlist = document.getElementById('realminfo')
let requestURL = 'https://api.beta.blizzlike.org/realmd/realmlist';
let request = new XMLHttpRequest();
request.open('GET', requestURL);
request.responseType = 'json';
request.send();

function parsetime(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

/* TODO
 *
 * Alliance Characters
 * Horde Characters
 */

request.onload = function() {
  const api = request.response;
  populateRealmInfo(api);
}

function createRealm(data) {
  const frame = document.createElement('div')
  if (data.state == 1) {
    frame.className = "realminfo realm-online";
  } else {
    frame.className = "realminfo realm-offline";
  }

  /* left pane */
  const overview = document.createElement('div');
  overview.className = "realminfo-overview";

  const realmname = document.createElement('span');
  realmname.className = "realminfo-realmname";
  realmname.textContent = data.name

  const uptime = document.createElement('span')
  uptime.className = "realminfo-uptime"

  if (data.state == 1) {
    var now = Math.round((new Date()).getTime() / 1000);
    var server = data.starttime
    uptime.textContent = parsetime(now - server)
  } else {
    uptime.textContent = "Offline"
  }

  overview.append(realmname)
  overview.append(uptime)

  /* center pane */
  const factions = document.createElement('div')
  factions.className = "realminfo-factions"

  const mode = document.createElement('span')
  mode.className = "realminfo-mode"

  switch (data.icon) {
    case 1:
      mode.textContent = "PvP"
      break
    case 8:
      mode.textContent = "RP-PvE"
      break
    case 8:
      mode.textContent = "RP-PvP"
      break
    default:
      mode.textContent = "PvE"
      break
  }

  factions.append(mode)

  const maxplayers = data.alliance + data.horde
  const horde = document.createElement('span')
  if (maxplayers > 0) {
    horde.textContent = Math.round(data.horde / maxplayers * 100) + "%"
  } else {
    horde.textContent = "50%"
  }
  factions.append(horde)

  const hordeicon = document.createElement('img')
  hordeicon.src = "img/horde.png"
  hordeicon.style.verticalAlign = "middle"
  factions.append(hordeicon)

  const allianceicon = document.createElement('img')
  allianceicon.src = "img/alliance.png"
  allianceicon.style.verticalAlign = "middle"
  factions.append(allianceicon)

  const alliance = document.createElement('span')
  if (maxplayers > 0) {
    alliance.textContent = Math.round(data.alliance / maxplayers * 100) + "%"
  } else {
    alliance.textContent = "50%"
  }
  factions.append(alliance)

  /* right pane */
  const stats = document.createElement('div')
  stats.className = "realminfo-stats"

  const online = document.createElement('span')
  online.className = "realminfo-online"
  online.textContent = (data.online ? data.online : "0") + " Online"
  stats.append(online)

  const characters = document.createElement('span')
  characters.className = "realminfo-characters"
  characters.textContent = (data.characters ? data.characters : "0") + " Characters"
  stats.append(characters)

  const accounts = document.createElement('span')
  accounts.className = "realminfo-accounts"
  accounts.textContent = (data.accounts ? data.accounts : "0") + " Accounts"
  stats.append(accounts)

  /* put everything together */
  frame.append(overview)
  frame.append(factions)
  frame.append(stats)
  return frame
}

function populateRealmInfo(jsonObj) {
  const data = jsonObj;
  const overview = document.createElement('div')

  const vanilla = document.createElement('div')
  const vanillaptr = document.createElement('div')

  const tbc = document.createElement('div')
  const tbcptr = document.createElement('div')

  const wotlk = document.createElement('div')
  const wotlkptr = document.createElement('div')

  for (let i = 0; i < data.length; i++) {
    /* add all non-ptr realms to the overview */
    if (data[i].timezone != 26) {
      overview.append(createRealm(data[i]))
    }

    /* update vanilla section */
    if (data[i].realmbuilds.search("5875") != -1) {
      if (data[i].timezone == 26) {
        vanillaptr.append(createRealm(data[i]))
      } else {
        vanilla.append(createRealm(data[i]))
      }
    }

    /* update tbc section */
    if (data[i].realmbuilds.search("8606") != -1) {
      if (data[i].timezone == 26) {
        tbcptr.append(createRealm(data[i]))
      } else {
        tbc.append(createRealm(data[i]))
      }
    }

    /* update wotlk section */
    if (data[i].realmbuilds.search("12340") != -1) {
      if (data[i].timezone == 26) {
        wotlkptr.append(createRealm(data[i]))
      } else {
        wotlk.append(createRealm(data[i]))
      }
    }

    document.getElementById('realminfo-overview').prepend(overview)

    document.getElementById('realminfo-vanilla-stable').prepend(vanilla)
    document.getElementById('realminfo-vanilla-ptr').prepend(vanillaptr)

    document.getElementById('realminfo-tbc-stable').prepend(tbc)
    document.getElementById('realminfo-tbc-ptr').prepend(tbcptr)

    document.getElementById('realminfo-wotlk-stable').prepend(wotlk)
    document.getElementById('realminfo-wotlk-ptr').prepend(wotlkptr)
  }
}