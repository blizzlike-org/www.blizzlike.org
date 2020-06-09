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
  const overview = document.createElement('div')
  overview.className = "realminfo-overview"
  const realmname = document.createElement('span')
  realmname.className = "realminfo-realmname"
  overview.append(realmname)
  const uptime = document.createElement('span')
  uptime.className = "realminfo-uptime"
  overview.append(uptime)

  /* center pane */
  const factions = document.createElement('div')
  factions.className = "realminfo-factions"
  const mode = document.createElement('span')
  mode.className = "realminfo-mode"
  factions.append(mode)
  const horde = document.createElement('span')
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
  factions.append(alliance)

  /* right pane */
  const stats = document.createElement('div')
  stats.className = "realminfo-stats"
  const online = document.createElement('span')
  online.className = "realminfo-online"
  stats.append(online)
  const characters = document.createElement('span')
  characters.className = "realminfo-characters"
  stats.append(characters)
  const accounts = document.createElement('span')
  accounts.className = "realminfo-accounts"
  stats.append(accounts)

  /* build frame */
  frame.append(overview)
  frame.append(factions)
  frame.append(stats)

  /* update all values once a second */
  window.setInterval(function() {
    const data = frame.data

    /* update online state */
    if (data.state == 1) {
      frame.className = "realminfo realm-online"
      var now = Math.round((new Date()).getTime() / 1000)
      var server = data.starttime
      uptime.textContent = parsetime(now - server)
    } else {
      frame.className = "realminfo realm-offline"
      uptime.textContent = "Offline"
    }

    realmname.textContent = data.name
    online.textContent = (data.online ? data.online : "0") + " Online"

    characters.textContent = (data.characters ? data.characters : "0") + " Characters"
    accounts.textContent = (data.accounts ? data.accounts : "0") + " Accounts"

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

    const maxplayers = data.alliance + data.horde
    if (maxplayers > 0) {
      alliance.textContent = Math.round(data.alliance / maxplayers * 100) + "%"
      horde.textContent = Math.round(data.horde / maxplayers * 100) + "%"
    } else {
      alliance.textContent = "50%"
      horde.textContent = "50%"
    }
  }, 1000)

  return frame
}

function updateRealmInfo(parent, data) {
  if (typeof parent[data.id] == "undefined") {
    parent[data.id] = createRealm(data)
    parent.append(parent[data.id])
  }

  parent[data.id].data = data
}

window.setInterval(function() {
  /* assign all realm info blocks to variables */
  const overview = document.getElementById('realminfo-overview')
  const vanilla = document.getElementById('realminfo-vanilla-stable')
  const vanillaptr = document.getElementById('realminfo-vanilla-ptr')
  const tbc = document.getElementById('realminfo-tbc-stable')
  const tbcptr = document.getElementById('realminfo-tbc-ptr')
  const wotlk = document.getElementById('realminfo-wotlk-stable')
  const wotlkptr = document.getElementById('realminfo-wotlk-ptr')

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