/** @param {NS} ns */
export async function main(ns) {
  let route = [],
      server = ns.args[0];

  if(ns.serverExists(server)) {
    let out = "";

    findIt(ns, "", "home", server, route);

    for(let path of route) {
      if(out == "") {
        out = path;
      } else {
        out += " => " + path;
      }
    }

    ns.tprint(out);
    ns.print(out);
  } else {
    let format = "Server %s does not exist!";
    ns.tprintf(format, server);
    ns.printf(format, server);
  }
}

function findIt(ns, parent, sv, target, route) {
  const children = ns.scan(sv);
  for(let child of children) {
    if(parent == child) {
      continue;
    }

    if(child == target) {
      route.unshift(child);
      route.unshift(sv);
      return true;
    }

    if(findIt(ns, sv, child, target, route)) {
      route.unshift(sv);
      return true;
    }
  }
  return false;
}