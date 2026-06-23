window.NET_PRACTICE_VISUALS = {
  "01": {
    summary: "Deux câbles indépendants donnent deux réseaux indépendants.",
    subnets: [
      {
        id: "lan-ab",
        label: "Réseau A ↔ B",
        cidr: "104.97.23.0/24",
        nodes: ["A", "B"],
        links: [["A", "B"]],
        interfaces: [["A1", "104.97.23.42/24"], ["B1", "104.97.23.12/24"]],
        common: "104.97.23",
        range: "104.97.23.1 à 104.97.23.254",
        forbidden: ".0 est le réseau ; .255 est le broadcast.",
        why: "Avec /24, les trois premiers nombres doivent être identiques. A1 et B1 partagent 104.97.23."
      },
      {
        id: "lan-cd",
        label: "Réseau C ↔ D",
        cidr: "211.191.0.0/16",
        nodes: ["C", "D"],
        links: [["C", "D"]],
        interfaces: [["C1", "211.191.37.75/16"], ["D1", "211.191.80.42/16"]],
        common: "211.191",
        range: "211.191.0.1 à 211.191.255.254",
        forbidden: "211.191.0.0 est le réseau ; 211.191.255.255 est le broadcast.",
        why: "Avec /16, seuls les deux premiers nombres identifient le réseau. Les deux derniers peuvent différer."
      }
    ]
  },
  "02": {
    summary: "Le masque fixe les limites exactes de chaque lien.",
    subnets: [
      {
        id: "lan-ab",
        label: "Bloc /27 de A et B",
        cidr: "192.168.84.192/27",
        nodes: ["A", "B"],
        links: [["A", "B"]],
        interfaces: [["A1", "192.168.84.193/27"], ["B1", "192.168.84.222/27"]],
        common: "192.168.84",
        range: "192.168.84.193 à 192.168.84.222",
        forbidden: ".192 est le réseau ; .223 est le broadcast.",
        why: "Un /27 avance par 32. L’adresse .222 tombe dans le bloc .192-.223."
      },
      {
        id: "link-cd",
        label: "Lien point à point /30",
        cidr: "10.10.10.0/30",
        nodes: ["C", "D"],
        links: [["C", "D"]],
        interfaces: [["C1", "10.10.10.1/30"], ["D1", "10.10.10.2/30"]],
        common: "10.10.10",
        range: "10.10.10.1 et 10.10.10.2",
        forbidden: ".0 est le réseau ; .3 est le broadcast.",
        why: "Le câble relie deux interfaces. Un /30 fournit exactement deux adresses utilisables."
      }
    ]
  },
  "03": {
    summary: "Le switch place A, B et C dans une seule rue commune.",
    subnets: [
      {
        id: "switched-lan",
        label: "LAN partagé par le switch",
        cidr: "104.198.73.0/25",
        nodes: ["A", "B", "C", "S"],
        links: [["S", "A"], ["S", "B"], ["S", "C"]],
        interfaces: [["A1", "104.198.73.125/25"], ["B1", "104.198.73.42/25"], ["C1", "104.198.73.126/25"]],
        common: "104.198.73",
        range: "104.198.73.1 à 104.198.73.126",
        forbidden: ".0 est le réseau ; .127 est le broadcast.",
        why: "Le switch ne change pas de réseau. Les trois machines doivent calculer le même réseau .0/25."
      }
    ]
  },
  "04": {
    summary: "Le LAN du switch doit rester séparé des autres interfaces du routeur.",
    subnets: [
      {
        id: "main-lan",
        label: "LAN A, B et R1",
        cidr: "72.44.18.128/28",
        nodes: ["A", "B", "S", "R"],
        links: [["R", "S"], ["S", "A"], ["S", "B"]],
        interfaces: [["R1", "72.44.18.129/28"], ["B1", "72.44.18.130/28"], ["A1", "72.44.18.132/28"]],
        common: "72.44.18",
        range: "72.44.18.129 à 72.44.18.142",
        forbidden: ".128 est le réseau ; .143 est le broadcast.",
        why: "L’adresse .132 tombe dans le bloc /28 .128-.143. Ce petit bloc évite de chevaucher les autres interfaces du routeur."
      }
    ]
  },
  "05": {
    summary: "Le routeur relie deux quartiers ; chaque machine utilise la porte située dans son propre quartier.",
    subnets: [
      {
        id: "lan-a",
        label: "LAN de A",
        cidr: "42.50.60.0/25",
        nodes: ["A", "R"],
        links: [["R", "A"]],
        interfaces: [["A1", "42.50.60.10/25"], ["R1", "42.50.60.126/25"]],
        common: "42.50.60",
        range: "42.50.60.1 à 42.50.60.126",
        forbidden: ".0 est le réseau ; .127 est le broadcast.",
        why: "A doit joindre R1 directement avant de lui confier le paquet."
      },
      {
        id: "lan-b",
        label: "LAN de B",
        cidr: "150.70.128.0/18",
        nodes: ["B", "R"],
        links: [["R", "B"]],
        interfaces: [["B1", "150.70.130.10/18"], ["R2", "150.70.130.254/18"]],
        common: "150.70",
        range: "150.70.128.1 à 150.70.191.254",
        forbidden: "150.70.128.0 est le réseau ; 150.70.191.255 est le broadcast.",
        why: "Avec /18, le troisième nombre avance par 64. 130 appartient au bloc 128-191."
      }
    ]
  },
  "06": {
    summary: "Un LAN privé au sens du schéma, un lien public, puis une route de retour.",
    subnets: [
      {
        id: "server-lan",
        label: "LAN du serveur",
        cidr: "28.141.155.128/25",
        nodes: ["A", "S", "R"],
        links: [["R", "S"], ["S", "A"]],
        interfaces: [["A1", "28.141.155.227/25"], ["R1", "28.141.155.254/25"]],
        common: "28.141.155",
        range: "28.141.155.129 à 28.141.155.254",
        forbidden: ".128 est le réseau ; .255 est le broadcast.",
        why: "A1 et sa gateway R1 doivent être voisines. .227 et .254 appartiennent au même bloc /25."
      },
      {
        id: "public-link",
        label: "Lien routeur ↔ Internet",
        cidr: "163.172.250.0/28",
        nodes: ["R", "I"],
        links: [["I", "R"]],
        interfaces: [["I1", "163.172.250.1/28"], ["R2", "163.172.250.12/28"]],
        common: "163.172.250",
        range: "163.172.250.1 à 163.172.250.14",
        forbidden: ".0 est le réseau ; .15 est le broadcast.",
        why: "R2 remet les paquets au voisin Internet I1. Les deux IP doivent appartenir au même lien."
      }
    ]
  },
  "07": {
    summary: "Trois câbles, donc trois petits réseaux différents.",
    subnets: [
      {
        id: "left-lan",
        label: "A ↔ R1",
        cidr: "96.198.14.0/30",
        nodes: ["A", "R1"],
        links: [["A", "R1"]],
        interfaces: [["R11", "96.198.14.1/30"], ["A1", "96.198.14.2/30"]],
        common: "96.198.14",
        range: ".1 et .2",
        forbidden: ".0 réseau ; .3 broadcast.",
        why: "Deux extrémités seulement : /30 fournit exactement deux places."
      },
      {
        id: "transit",
        label: "Transit R1 ↔ R2",
        cidr: "96.198.14.252/30",
        nodes: ["R1", "R2"],
        links: [["R1", "R2"]],
        interfaces: [["R21", "96.198.14.253/30"], ["R12", "96.198.14.254/30"]],
        common: "96.198.14",
        range: ".253 et .254",
        forbidden: ".252 réseau ; .255 broadcast.",
        why: "Ce bloc /30 est distinct du LAN gauche et réserve deux adresses aux routeurs."
      },
      {
        id: "right-lan",
        label: "R2 ↔ C",
        cidr: "96.198.15.0/30",
        nodes: ["R2", "C"],
        links: [["R2", "C"]],
        interfaces: [["R22", "96.198.15.1/30"], ["C1", "96.198.15.2/30"]],
        common: "96.198.15",
        range: ".1 et .2",
        forbidden: ".0 réseau ; .3 broadcast.",
        why: "Le troisième câble doit avoir son propre bloc, différent des deux précédents."
      }
    ]
  },
  "08": {
    summary: "Deux LAN /28, un transit /30 et un lien public, tous visibles séparément.",
    subnets: [
      {
        id: "home-lan",
        label: "LAN domicile",
        cidr: "146.29.78.0/28",
        nodes: ["D", "R2"],
        links: [["R2", "D"]],
        interfaces: [["R23", "146.29.78.1/28"], ["D1", "146.29.78.2/28"]],
        common: "146.29.78",
        range: ".1 à .14",
        forbidden: ".0 réseau ; .15 broadcast.",
        why: "Ce premier câble utilise le premier bloc /28."
      },
      {
        id: "office-lan",
        label: "LAN bureau",
        cidr: "146.29.78.16/28",
        nodes: ["C", "R2"],
        links: [["R2", "C"]],
        interfaces: [["R22", "146.29.78.17/28"], ["C1", "146.29.78.18/28"]],
        common: "146.29.78",
        range: ".17 à .30",
        forbidden: ".16 réseau ; .31 broadcast.",
        why: ".3 et .4 sont encore dans le LAN domicile. Le câble du bureau prend donc le bloc suivant."
      },
      {
        id: "transit",
        label: "Transit R1 ↔ R2",
        cidr: "146.29.78.60/30",
        nodes: ["R1", "R2"],
        links: [["R1", "R2"]],
        interfaces: [["R21", "146.29.78.61/30"], ["R13", "146.29.78.62/30"]],
        common: "146.29.78",
        range: ".61 et .62",
        forbidden: ".60 réseau ; .63 broadcast.",
        why: "Le transit ne relie que deux interfaces. /30 donne exactement les deux places nécessaires."
      },
      {
        id: "public-link",
        label: "Lien public",
        cidr: "163.228.250.0/28",
        nodes: ["R1", "I"],
        links: [["R1", "I"]],
        interfaces: [["I1", "163.228.250.1/28"], ["R12", "163.228.250.12/28"]],
        common: "163.228.250",
        range: ".1 à .14",
        forbidden: ".0 réseau ; .15 broadcast.",
        why: "R1 doit joindre directement le voisin Internet avant d’utiliser sa route par défaut."
      }
    ]
  },
  "09": {
    summary: "Le réseau ramifié devient lisible quand chaque câble reçoit une couleur.",
    subnets: [
      {
        id: "ab-lan",
        label: "LAN A/B",
        cidr: "80.198.40.0/25",
        nodes: ["A", "B", "S", "R1"],
        links: [["A", "S"], ["B", "S"], ["S", "R1"]],
        interfaces: [["A1", "80.198.40.10/25"], ["B1", "80.198.40.20/25"], ["R11", "80.198.40.126/25"]],
        common: "80.198.40",
        range: ".1 à .126",
        forbidden: ".0 réseau ; .127 broadcast.",
        why: "Le switch place A, B et leur gateway R11 dans le même LAN."
      },
      {
        id: "transit",
        label: "Transit R1/R2",
        cidr: "70.50.17.252/30",
        nodes: ["R1", "R2"],
        links: [["R1", "R2"]],
        interfaces: [["R13", "70.50.17.253/30"], ["R21", "70.50.17.254/30"]],
        common: "70.50.17",
        range: ".253 et .254",
        forbidden: ".252 réseau ; .255 broadcast.",
        why: "Deux routeurs seulement : /30 évite de réserver un grand LAN."
      },
      {
        id: "c-lan",
        label: "LAN C",
        cidr: "70.50.18.0/24",
        nodes: ["R2", "C"],
        links: [["R2", "C"]],
        interfaces: [["C1", "70.50.18.10/24"], ["R22", "70.50.18.254/24"]],
        common: "70.50.18",
        range: ".1 à .254",
        forbidden: ".0 réseau ; .255 broadcast.",
        why: "C utilise l’interface R22 située sur son propre câble."
      },
      {
        id: "d-lan",
        label: "LAN D",
        cidr: "44.60.70.0/24",
        nodes: ["R2", "D"],
        links: [["R2", "D"]],
        interfaces: [["R23", "44.60.70.1/24"], ["D1", "44.60.70.10/24"]],
        common: "44.60.70",
        range: ".1 à .254",
        forbidden: ".0 réseau ; .255 broadcast.",
        why: "D possède son propre câble et donc son propre réseau, différent du LAN C."
      },
      {
        id: "public-link",
        label: "Lien Internet",
        cidr: "163.172.250.0/28",
        nodes: ["R1", "I"],
        links: [["R1", "I"]],
        interfaces: [["I1", "163.172.250.1/28"], ["R12", "163.172.250.12/28"]],
        common: "163.172.250",
        range: ".1 à .14",
        forbidden: ".0 réseau ; .15 broadcast.",
        why: "Le routeur de bordure et Internet sont voisins sur ce lien."
      }
    ]
  },
  "10": {
    summary: "Un /24 est découpé en LAN de tailles différentes et un petit transit.",
    subnets: [
      {
        id: "main-lan",
        label: "LAN H1/H2",
        cidr: "80.50.40.0/25",
        nodes: ["H1", "H2", "S1", "R1"],
        links: [["H1", "S1"], ["H2", "S1"], ["S1", "R1"]],
        interfaces: [["R11", "80.50.40.1/25"], ["H11", "80.50.40.2/25"], ["H21", "80.50.40.42/25"]],
        common: "80.50.40",
        range: ".1 à .126",
        forbidden: ".0 réseau ; .127 broadcast.",
        why: "Ce LAN contient trois interfaces et occupe la première moitié du /24."
      },
      {
        id: "h4-lan",
        label: "LAN H4",
        cidr: "80.50.40.128/26",
        nodes: ["R2", "H4"],
        links: [["R2", "H4"]],
        interfaces: [["R23", "80.50.40.129/26"], ["H41", "80.50.40.131/26"]],
        common: "80.50.40",
        range: ".129 à .190",
        forbidden: ".128 réseau ; .191 broadcast.",
        why: "Le /26 réserve le bloc .128-.191 sans chevaucher le LAN principal."
      },
      {
        id: "h3-lan",
        label: "LAN H3",
        cidr: "80.50.40.192/27",
        nodes: ["R2", "H3"],
        links: [["R2", "H3"]],
        interfaces: [["R22", "80.50.40.193/27"], ["H31", "80.50.40.194/27"]],
        common: "80.50.40",
        range: ".193 à .222",
        forbidden: ".192 réseau ; .223 broadcast.",
        why: "Le /27 occupe le bloc suivant et laisse la fin du /24 disponible au transit."
      },
      {
        id: "transit",
        label: "Transit R1/R2",
        cidr: "80.50.40.252/30",
        nodes: ["R1", "R2"],
        links: [["R1", "R2"]],
        interfaces: [["R21", "80.50.40.253/30"], ["R13", "80.50.40.254/30"]],
        common: "80.50.40",
        range: ".253 et .254",
        forbidden: ".252 réseau ; .255 broadcast.",
        why: "Le dernier /30 fournit exactement deux adresses aux deux routeurs."
      },
      {
        id: "public-link",
        label: "Lien Internet",
        cidr: "163.172.250.0/28",
        nodes: ["R1", "I"],
        links: [["I", "R1"]],
        interfaces: [["I1", "163.172.250.1/28"], ["R12", "163.172.250.12/28"]],
        common: "163.172.250",
        range: ".1 à .14",
        forbidden: ".0 réseau ; .15 broadcast.",
        why: "Internet utilise ce lien pour atteindre le routeur de bordure."
      }
    ]
  }
};
