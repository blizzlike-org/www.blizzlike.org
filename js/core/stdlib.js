function core_stdlib_resolve_mode(mode)
{
  console.log('Resolving Realm Mode: ' + mode)
  switch(mode)
  {
    case 0: return 'Normal';
    case 1: return 'PvP';
    case 4: return 'Normal';
    case 6: return 'RP';
    case 8: return 'RP PvP';
  }
}

function core_stdlib_resolve_population(population)
{
  if(population <= 0.5)
    return 'low';
  if(population <= 1.0)
    return 'medium';
  if(population > 1.0)
    return 'high';
}
