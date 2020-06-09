function parsetime(seconds) {
  seconds = Number(seconds)
  var d = Math.floor(seconds / (3600 * 24))
  var h = Math.floor(seconds % (3600 * 24) / 3600)
  var m = Math.floor(seconds % 3600 / 60)
  var s = Math.floor(seconds % 60)

  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : ""
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""
  return dDisplay + hDisplay + mDisplay + sDisplay
}

function createRealm(data, name) {
  const frame = document.createElement('div')

  /* left pane */
  const left = document.createElement('div')
  left.className = "realminfo-left"
  const realmname = document.createElement('span')
  realmname.className = "realminfo-realmname"
  left.append(realmname)
  const uptime = document.createElement('span')
  uptime.className = "realminfo-uptime"
  left.append(uptime)

  /* center pane */
  const center = document.createElement('div')
  center.className = "realminfo-center"
  const mode = document.createElement('span')
  mode.className = "realminfo-mode"
  center.append(mode)
  const horde = document.createElement('span')
  center.append(horde)
  const hordeicon = document.createElement('img')
  hordeicon.src = "img/horde.png"
  hordeicon.style.verticalAlign = "middle"
  center.append(hordeicon)
  const allianceicon = document.createElement('img')
  allianceicon.src = "img/alliance.png"
  allianceicon.style.verticalAlign = "middle"
  center.append(allianceicon)
  const alliance = document.createElement('span')
  center.append(alliance)

  /* right pane */
  const right = document.createElement('div')
  right.className = "realminfo-right"
  const online = document.createElement('span')
  online.className = "realminfo-online"
  right.append(online)
  const characters = document.createElement('span')
  characters.className = "realminfo-characters"
  right.append(characters)
  const accounts = document.createElement('span')
  accounts.className = "realminfo-accounts"
  right.append(accounts)

  /* build frame */
  frame.append(left)
  frame.append(center)
  frame.append(right)

  frame.updateContent = function(data) {
    /* left pane */
    realmname.textContent = data.name
    if (data.state == 1) {
      frame.className = "realminfo realm-online"
      uptime.textContent = parsetime(Math.round((new Date()).getTime() / 1000) - data.starttime)
    } else {
      frame.className = "realminfo realm-offline"
      uptime.textContent = "Offline"
    }

    /* center pane */
    if (data.icon == 1) {
      mode.textContent = "PvP"
    } else if (data.icon == 6) {
      mode.textContent = "RP-PvE"
    } else if (data.icon == 8) {
      mode.textContent = "RP-PvP"
    } else {
      mode.textContent = "PvE"
    }

    const maxplayers = data.alliance + data.horde
    if (maxplayers > 0) {
      alliance.textContent = Math.round(data.alliance / maxplayers * 100) + "%"
      horde.textContent = Math.round(data.horde / maxplayers * 100) + "%"
    } else {
      alliance.textContent = "50%"
      horde.textContent = "50%"
    }

    /* right pane */
    online.textContent = (data.online ? data.online : "0") + " Online"
    characters.textContent = (data.characters ? data.characters : "0") + " Characters"
    accounts.textContent = (data.accounts ? data.accounts : "0") + " Accounts"
  }

  return frame
}

function updateRealmInfo(parent, data) {
  if (typeof parent[data.id] == "undefined") {
    parent[data.id] = createRealm(data)
    parent.append(parent[data.id])
  }

  parent[data.id].updateContent(data)
}

window.setInterval(function() {
  /* assign all realm info blocks to variables */
  let overview = document.getElementById('realminfo-overview')
  let vanilla = document.getElementById('realminfo-vanilla')
  let vanillaptr = document.getElementById('realminfo-vanillaptr')
  let tbc = document.getElementById('realminfo-tbc')
  let tbcptr = document.getElementById('realminfo-tbcptr')
  let wotlk = document.getElementById('realminfo-wotlk')
  let wotlkptr = document.getElementById('realminfo-wotlkptr')

  /* access the blizzlike realm state API */
  let requestURL = 'https://api.beta.blizzlike.org/realmd/realmlist'
  let request = new XMLHttpRequest()
  request.open('GET', requestURL)
  request.responseType = 'json'
  request.send()
  request.onload = function() {
    const data = request.response
    for (let i = 0; i < data.length; i++) {
      /* update overview */
      if (data[i].timezone != 26) {
        updateRealmInfo(overview, data[i])
      }

      /* update vanilla section */
      if (data[i].realmbuilds.search("5875") != -1) {
        if (data[i].timezone == 26) {
          updateRealmInfo(vanillaptr, data[i])
        } else {
          updateRealmInfo(vanilla, data[i])
        }
      }

      /* update tbc section */
      if (data[i].realmbuilds.search("8606") != -1) {
        if (data[i].timezone == 26) {
          updateRealmInfo(tbcptr, data[i])
        } else {
          updateRealmInfo(tbc, data[i])
        }
      }

      /* update wotlk section */
      if (data[i].realmbuilds.search("12340") != -1) {
        if (data[i].timezone == 26) {
          updateRealmInfo(wotlkptr, data[i])
        } else {
          updateRealmInfo(wotlk, data[i])
        }
      }
    }
  }
}, 1000)