window.NET_PRACTICE_LEVELS = [
  {
    number: "01",
    title: "Deux réseaux directs",
    focus: "Reconnaître un même sous-réseau",
    diagram: {
      ratio: "16 / 8",
      nodes: [
        { id: "A", type: "pc", label: "PC A", detail: "IP à corriger", x: 28, y: 70 },
        { id: "B", type: "pc", label: "PC B", detail: "/24 fixe", x: 28, y: 28 },
        { id: "C", type: "pc", label: "PC C", detail: "/16 fixe", x: 72, y: 70 },
        { id: "D", type: "pc", label: "PC D", detail: "IP à corriger", x: 72, y: 28 }
      ],
      links: [["A", "B"], ["C", "D"]]
    },
    topology: [
      [
        { type: "pc", label: "PC A", detail: "IP à corriger" },
        { type: "pc", label: "PC B", detail: "/24 fixe" }
      ],
      [
        { type: "pc", label: "PC C", detail: "/16 fixe" },
        { type: "pc", label: "PC D", detail: "IP à corriger" }
      ]
    ],
    principle: [
      "Il n’y a ni switch ni routeur : chaque paire est reliée directement.",
      "Les deux interfaces d’un lien doivent donc appartenir au même sous-réseau et utiliser des adresses différentes.",
      "Le premier lien travaille en /24 : les trois premiers octets doivent être identiques.",
      "Le second lien travaille en /16 : seuls les deux premiers octets définissent le réseau."
    ],
    method: [
      "Sur le lien A-B, relève l’IP fixe de B et recopie ses trois premiers octets dans A.",
      "Choisis pour A un dernier octet entre 1 et 254, différent de celui de B.",
      "Sur le lien C-D, relève les deux premiers octets de C et utilise-les pour D.",
      "Choisis ensuite deux octets hôte valides sans reprendre exactement l’adresse de C."
    ],
    example:
      "B = 104.97.23.12/24\nA possible = 104.97.23.42/24\n\nC = 211.191.37.75/16\nD possible = 211.191.80.42/16",
    why: [
      "Avec /24, A et B calculent tous deux le réseau 104.97.23.0.",
      "Avec /16, C et D calculent tous deux le réseau 211.191.0.0.",
      "La destination étant locale, aucun next hop ni aucune route n’est nécessaire."
    ],
    traps: [
      "Ne conserve pas une valeur générée supérieure à 255.",
      "N’utilise ni l’adresse réseau ni l’adresse broadcast.",
      "Deux IP identiques sur le même lien provoquent un conflit."
    ]
  },
  {
    number: "02",
    title: "Blocs /27 et liens /30",
    focus: "Calculer une plage précise",
    diagram: {
      ratio: "16 / 8",
      nodes: [
        { id: "A", type: "pc", label: "PC A", detail: "/27", x: 28, y: 70 },
        { id: "B", type: "pc", label: "PC B", detail: "masque à corriger", x: 28, y: 28 },
        { id: "C", type: "pc", label: "PC C", detail: "/30", x: 72, y: 70 },
        { id: "D", type: "pc", label: "PC D", detail: "/30", x: 72, y: 28 }
      ],
      links: [["A", "B"], ["C", "D"]]
    },
    topology: [
      [
        { type: "pc", label: "PC A", detail: "/27" },
        { type: "pc", label: "PC B", detail: "masque à corriger" }
      ],
      [
        { type: "pc", label: "PC C", detail: "/30" },
        { type: "pc", label: "PC D", detail: "/30" }
      ]
    ],
    principle: [
      "Le premier lien impose un /27, soit des blocs de 32 adresses.",
      "Le second lien impose un /30, soit des blocs de 4 adresses avec seulement deux adresses utilisables.",
      "Les adresses initiales en 127.x.x.x sont du loopback et doivent être remplacées."
    ],
    method: [
      "Pour B en .222/27, cherche le multiple de 32 inférieur ou égal à 222 : 192.",
      "Le bloc vaut donc .192 à .223 ; réseau .192, broadcast .223, hôtes .193 à .222.",
      "Attribue à A une adresse libre de cette plage et remplace le masque invalide de B par /27.",
      "Pour C-D, choisis n’importe quel bloc /30 non loopback, puis utilise les deux adresses du milieu."
    ],
    example:
      "B = 192.168.84.222/27\nA possible = 192.168.84.193/27\n\nRéseau choisi pour C-D = 10.10.10.0/30\nC = 10.10.10.1/30\nD = 10.10.10.2/30",
    why: [
      "A et B appartiennent au même intervalle .192-.223.",
      "Dans 10.10.10.0/30, .0 est le réseau et .3 le broadcast ; .1 et .2 peuvent communiquer directement."
    ],
    traps: [
      "255.255.255.32 n’est pas un masque valide ; /27 vaut 255.255.255.224.",
      "Une adresse 127.x.x.x n’est pas une adresse de LAN utilisable ici.",
      "Un /30 n’accepte que deux interfaces utilisables."
    ]
  },
  {
    number: "03",
    title: "Trois machines sur un switch",
    focus: "Un seul LAN partagé",
    diagram: {
      ratio: "16 / 9",
      nodes: [
        { id: "A", type: "pc", label: "PC A", detail: "IP fixe", x: 72, y: 76 },
        { id: "B", type: "pc", label: "PC B", detail: "IP + masque", x: 72, y: 22 },
        { id: "C", type: "pc", label: "PC C", detail: "/25 fixe", x: 24, y: 52 },
        { id: "S", type: "switch", label: "Switch", detail: "LAN partagé", x: 53, y: 50 }
      ],
      links: [["S", "A"], ["S", "B"], ["S", "C"]]
    },
    topology: [
      [
        { type: "pc", label: "PC A", detail: "IP fixe" },
        { type: "switch", label: "Switch", detail: "niveau 2" },
        { type: "pc", label: "PC B", detail: "IP + masque" }
      ],
      [
        { type: "switch", label: "Switch", detail: "même segment" },
        { type: "pc", label: "PC C", detail: "/25 fixe" }
      ]
    ],
    principle: [
      "Un switch étend un même domaine de niveau 2 : A, B et C doivent partager le même sous-réseau.",
      "Le masque fixe de C est /25. Il donne deux blocs : .0-.127 et .128-.255.",
      "L’adresse fixe de A se termine par .125 : elle appartient au premier bloc /25."
    ],
    method: [
      "Conserve les trois premiers octets de l’adresse fixe de A.",
      "Mets A et B en /25 pour respecter le masque fixe de C.",
      "Choisis pour B et C des adresses distinctes dans la plage .1-.126.",
      "Le switch ne reçoit ni IP utile, ni gateway, ni route."
    ],
    example:
      "A = 104.198.73.125/25\nB possible = 104.198.73.42/25\nC possible = 104.198.73.126/25\nRéseau commun = 104.198.73.0/25",
    why: [
      "Chaque machine calcule le même réseau .0/25.",
      "Le switch diffuse les trames sur le LAN ; aucun routage n’intervient.",
      "Les trois IP sont utilisables et différentes."
    ],
    traps: [
      "Ne place pas C dans le bloc .128-.255.",
      "Un switch ne permet pas de mélanger plusieurs sous-réseaux sans routeur.",
      "Évite .0 et .127 dans ce bloc."
    ]
  },
  {
    number: "04",
    title: "LAN avec une interface de routeur",
    focus: "Choisir un sous-réseau sans chevauchement",
    diagram: {
      ratio: "16 / 9",
      nodes: [
        { id: "A", type: "pc", label: "PC A", detail: ".132 fixe", x: 78, y: 76 },
        { id: "B", type: "pc", label: "PC B", detail: "à configurer", x: 72, y: 22 },
        { id: "S", type: "switch", label: "Switch", detail: "LAN", x: 56, y: 50 },
        { id: "R", type: "router", label: "Routeur R1", detail: "interface LAN", x: 25, y: 50 }
      ],
      links: [["R", "S"], ["S", "A"], ["S", "B"]]
    },
    topology: [
      [
        { type: "pc", label: "PC A", detail: ".132 fixe" },
        { type: "switch", label: "Switch", detail: "LAN" },
        { type: "pc", label: "PC B", detail: "à configurer" }
      ],
      [
        { type: "switch", label: "Switch", detail: "même LAN" },
        { type: "router", label: "Routeur R1", detail: "interface LAN" }
      ]
    ],
    principle: [
      "A, B et l’interface R1 reliée au switch doivent être dans le même réseau.",
      "A se termine par .132 et propose un /28 : le bloc correspondant est .128-.143.",
      "Les autres interfaces fixes du routeur occupent déjà les blocs bas et haut du même /24 ; le /28 central évite leur chevauchement."
    ],
    method: [
      "Calcule le bloc de A : pas de 16, donc .128 à .143.",
      "Conserve A en /28.",
      "Attribue à R1 et B deux adresses différentes parmi .129-.142.",
      "Utilise aussi /28 sur B et R1."
    ],
    example:
      "A = X.Y.Z.132/28\nR1 possible = X.Y.Z.129/28\nB possible = X.Y.Z.130/28\nRéseau = X.Y.Z.128\nBroadcast = X.Y.Z.143",
    why: [
      "Les trois équipements voient le LAN X.Y.Z.128/28 comme directement connecté.",
      "Le routeur peut être joint par A et B sans route explicite.",
      "Le /28 n’empiète ni sur le bloc .0-.127 ni sur le bloc .192-.255 des autres interfaces."
    ],
    traps: [
      "Un /23 sur R1 chevaucherait plusieurs interfaces du routeur.",
      "Ne choisis pas .128 ou .143.",
      "Le routeur ne doit pas avoir deux interfaces capables de joindre la même destination locale."
    ]
  },
  {
    number: "05",
    title: "Deux LAN reliés par un routeur",
    focus: "Configurer les gateways des hôtes",
    diagram: {
      ratio: "16 / 9",
      nodes: [
        { id: "A", type: "pc", label: "Machine A", detail: "LAN A", x: 78, y: 76 },
        { id: "B", type: "pc", label: "Machine B", detail: "LAN B", x: 72, y: 22 },
        { id: "R", type: "router", label: "Routeur", detail: "R1 / R2", x: 35, y: 50 }
      ],
      links: [["R", "A"], ["R", "B"]]
    },
    topology: [
      [
        { type: "pc", label: "Machine A", detail: "LAN A" },
        { type: "router", label: "Routeur", detail: "R1 / R2" },
        { type: "pc", label: "Machine B", detail: "LAN B" }
      ]
    ],
    principle: [
      "Le routeur possède une interface fixe dans chacun des deux réseaux.",
      "Chaque machine doit d’abord partager le sous-réseau de l’interface du routeur qui lui fait face.",
      "Pour joindre l’autre LAN, chaque machine envoie vers sa gateway locale.",
      "Le routeur connaît automatiquement ses deux réseaux directement connectés."
    ],
    method: [
      "Calcule le réseau de R1 avec son masque /25, puis choisis une IP libre de ce réseau pour A.",
      "Calcule le réseau de R2 avec son masque /18, puis choisis une IP libre de ce réseau pour B.",
      "Sur A, configure une route vers le réseau de B ou une route par défaut via l’IP de R1.",
      "Sur B, conserve la route par défaut et remplace sa gateway par l’IP de R2."
    ],
    example:
      "R1 = 42.50.60.126/25\nA = 42.50.60.10/25\ngateway A = 42.50.60.126\n\nR2 = 150.70.130.254/18\nB = 150.70.130.10/18\ngateway B = 150.70.130.254",
    why: [
      "A atteint R1 localement, puis le routeur transmet sur son interface R2.",
      "B utilise R2 pour le chemin retour.",
      "Aucune route statique n’est nécessaire sur le routeur pour ses réseaux directement connectés."
    ],
    traps: [
      "La gateway d’un hôte doit être dans son propre sous-réseau.",
      "Ne recopie pas les adresses initiales fictives si elles ne correspondent pas aux interfaces fixes.",
      "Vérifie le chemin retour, pas seulement A vers B."
    ]
  },
  {
    number: "06",
    title: "Sortir vers Internet",
    focus: "Route par défaut et route de retour",
    diagram: {
      ratio: "16 / 9",
      nodes: [
        { id: "I", type: "internet", label: "Internet", detail: "8.8.8.8", x: 18, y: 24 },
        { id: "R", type: "router", label: "Routeur", detail: "LAN + WAN", x: 42, y: 52 },
        { id: "S", type: "switch", label: "Switch", detail: "LAN interne", x: 68, y: 52 },
        { id: "A", type: "pc", label: "Serveur A", detail: "réseau interne", x: 82, y: 78 }
      ],
      links: [["I", "R"], ["R", "S"], ["S", "A"]]
    },
    topology: [
      [
        { type: "pc", label: "Serveur A", detail: "LAN interne" },
        { type: "switch", label: "Switch", detail: "LAN" },
        { type: "router", label: "Routeur", detail: "LAN + WAN" },
        { type: "internet", label: "Internet", detail: "8.8.8.8" }
      ]
    ],
    principle: [
      "Le serveur se trouve dans la moitié haute d’un /24 car son dernier octet vaut .227.",
      "Avec /25, son réseau est donc N.N.N.128/25.",
      "Le routeur doit servir de gateway au serveur et posséder une route vers Internet.",
      "Internet doit connaître une route de retour vers le réseau du serveur."
    ],
    method: [
      "Mets le serveur en /25.",
      "Configure l’interface LAN du routeur avec une adresse de .129 à .254, différente de .227.",
      "Mets sur le serveur une route par défaut via cette interface LAN.",
      "Sur le routeur, utilise une route par défaut ou une route couvrant 8.8.8.8 via 163.172.250.1.",
      "Sur Internet, remplace la route /31 par N.N.N.128/25 via 163.172.250.12."
    ],
    example:
      "A = P.Q.R.227/25\nRouteur LAN = P.Q.R.254/25\nRoute A = 0.0.0.0/0 via P.Q.R.254\nRoute routeur = 0.0.0.0/0 via 163.172.250.1\nRoute Internet = P.Q.R.128/25 via 163.172.250.12",
    why: [
      "Le serveur remet tout trafic non local à son routeur.",
      "Le routeur envoie 8.8.8.8 vers l’interface Internet.",
      "La route de retour d’Internet couvre exactement le LAN du serveur."
    ],
    traps: [
      "Une route /31 ne couvre pas le réseau interne.",
      "Le next hop Internet doit être l’interface voisine, pas 8.8.8.8.",
      "Internet refuse de router les plages privées dans ce simulateur."
    ]
  },
  {
    number: "07",
    title: "Deux routeurs en chaîne",
    focus: "Trois sous-réseaux et quatre gateways",
    diagram: {
      ratio: "16 / 9",
      nodes: [
        { id: "A", type: "pc", label: "PC A", detail: "LAN gauche", x: 80, y: 22 },
        { id: "R1", type: "router", label: "Routeur R1", detail: "tech", x: 38, y: 25 },
        { id: "R2", type: "router", label: "Routeur R2", detail: "administration", x: 38, y: 72 },
        { id: "C", type: "pc", label: "PC C", detail: "LAN droit", x: 80, y: 75 }
      ],
      links: [["A", "R1"], ["R1", "R2"], ["R2", "C"]]
    },
    topology: [
      [
        { type: "pc", label: "PC A", detail: "LAN gauche" },
        { type: "router", label: "Routeur R1", detail: "deux interfaces" },
        { type: "router", label: "Routeur R2", detail: "deux interfaces" },
        { type: "pc", label: "PC C", detail: "LAN droit" }
      ]
    ],
    principle: [
      "La topologie contient trois liens, donc trois sous-réseaux distincts.",
      "Les /30 sont adaptés : deux adresses utilisables par lien.",
      "Chaque hôte pointe vers son routeur local.",
      "Chaque routeur peut utiliser l’autre routeur comme route par défaut, car le réseau distant est directement connecté à ce voisin."
    ],
    method: [
      "Pour A-R1, exploite R1 = X.198.14.1 avec le bloc X.198.14.0/30 ; A peut prendre .2.",
      "Pour R1-R2, exploite R1 = X.198.14.254 avec le bloc .252/30 ; R2 peut prendre .253.",
      "Pour R2-C, crée un troisième bloc, par exemple X.198.15.0/30 avec R2 .1 et C .2.",
      "Configure les routes par défaut : A vers R1, C vers R2, R1 vers R2 et R2 vers R1."
    ],
    example:
      "A = X.198.14.2/30 -> gateway X.198.14.1\nR1-R2 = X.198.14.254/30 <-> X.198.14.253/30\nR2-C = X.198.15.1/30 <-> X.198.15.2/30\nC gateway = X.198.15.1",
    why: [
      "Chaque routeur connaît ses deux liens locaux.",
      "R1 envoie le LAN droit à R2 ; R2 envoie le LAN gauche à R1.",
      "Les trois blocs /30 ne se chevauchent pas."
    ],
    traps: [
      "Les deux interfaces d’un même routeur ne doivent pas partager le même sous-réseau.",
      "Une gateway 0.0.0.0 est invalide.",
      "Sur .252/30, .252 est le réseau et .255 le broadcast."
    ]
  },
  {
    number: "08",
    title: "VLSM et agrégation vers Internet",
    focus: "Découper un /26 en plusieurs réseaux",
    diagram: {
      ratio: "16 / 10",
      nodes: [
        { id: "I", type: "internet", label: "Internet", detail: "route agrégée", x: 82, y: 18 },
        { id: "R1", type: "router", label: "R1", detail: "bordure", x: 48, y: 22 },
        { id: "R2", type: "router", label: "R2", detail: "transit", x: 48, y: 58 },
        { id: "C", type: "pc", label: "PC C", detail: "sous-réseau 1", x: 75, y: 82 },
        { id: "D", type: "pc", label: "PC D", detail: "sous-réseau 2", x: 20, y: 82 }
      ],
      links: [["I", "R1"], ["R1", "R2"], ["R2", "C"], ["R2", "D"]]
    },
    topology: [
      [
        { type: "internet", label: "Internet", detail: "route agrégée" },
        { type: "router", label: "R1", detail: "bordure" },
        { type: "router", label: "R2", detail: "transit" },
        { type: "pc", label: "PC C", detail: "sous-réseau 1" }
      ],
      [
        { type: "router", label: "R2", detail: "même routeur" },
        { type: "pc", label: "PC D", detail: "sous-réseau 2" }
      ]
    ],
    principle: [
      "Internet possède une route fixe vers un préfixe P.Q.R.0/26.",
      "Toutes les adresses internes doivent donc pouvoir être regroupées dans ce /26.",
      "Il faut découper ce bloc en LAN C, LAN D et lien de transit R1-R2 sans chevauchement.",
      "R1 annonce l’agrégat vers R2 et Internet annonce le même agrégat vers R1."
    ],
    method: [
      "Réserve P.Q.R.0/28 pour C : R2 = .1, C = .2.",
      "Réserve P.Q.R.16/28 pour D : R2 = .17, D = .18.",
      "Réserve P.Q.R.60/30 pour le transit : R2 = .61, R1 = .62.",
      "Sur R1, route P.Q.R.0/26 via .61 ; sur R2, route par défaut via .62.",
      "Sur Internet, garde P.Q.R.0/26 et utilise l’IP publique de R1 comme gateway."
    ],
    example:
      "C = P.Q.R.2/28 -> gateway P.Q.R.1\nD = P.Q.R.18/28 -> gateway P.Q.R.17\nR2-R1 = P.Q.R.61/30 <-> P.Q.R.62/30\nR1: P.Q.R.0/26 via P.Q.R.61\nR2: default via P.Q.R.62\nInternet: P.Q.R.0/26 via 163.A.250.12",
    why: [
      "Les trois sous-réseaux tiennent dans P.Q.R.0-.63.",
      "R1 résume tous les réseaux internes par une seule route /26.",
      "Internet peut répondre à C et D avec une route unique."
    ],
    traps: [
      "Ne fais pas chevaucher le transit avec un LAN.",
      "La gateway fixe de R2 révèle l’adresse à attribuer à R1 sur le transit.",
      "Une route Internet vers un réseau privé serait rejetée par le simulateur."
    ]
  },
  {
    number: "09",
    title: "Routes spécifiques et ordre de lecture",
    focus: "Plusieurs LAN et routes de retour Internet",
    diagram: {
      ratio: "16 / 12",
      nodes: [
        { id: "A", type: "pc", label: "PC A", detail: "LAN switché", x: 14, y: 68 },
        { id: "B", type: "pc", label: "PC B", detail: "LAN switché", x: 14, y: 24 },
        { id: "S", type: "switch", label: "Switch", detail: "A + B", x: 33, y: 46 },
        { id: "R1", type: "router", label: "R1", detail: "bordure", x: 53, y: 38 },
        { id: "I", type: "internet", label: "Internet", detail: "routes retour", x: 78, y: 16 },
        { id: "R2", type: "router", label: "R2", detail: "distribution", x: 53, y: 72 },
        { id: "C", type: "pc", label: "PC C", detail: "LAN C", x: 82, y: 65 },
        { id: "D", type: "pc", label: "PC D", detail: "LAN D", x: 72, y: 90 }
      ],
      links: [["A", "S"], ["B", "S"], ["S", "R1"], ["R1", "I"], ["R1", "R2"], ["R2", "C"], ["R2", "D"]]
    },
    topology: [
      [
        { type: "pc", label: "PC A", detail: "LAN switché" },
        { type: "switch", label: "Switch", detail: "A + B" },
        { type: "pc", label: "PC B", detail: "LAN switché" }
      ],
      [
        { type: "switch", label: "Switch", detail: "LAN A-B" },
        { type: "router", label: "R1", detail: "Internet + transit" },
        { type: "router", label: "R2", detail: "LAN C + D" },
        { type: "pc", label: "PC C / D", detail: "deux LAN" }
      ],
      [
        { type: "internet", label: "Internet", detail: "routes explicites" },
        { type: "router", label: "R1", detail: "bordure" }
      ]
    ],
    principle: [
      "Le niveau combine un LAN switché, un transit inter-routeurs, deux LAN distants et Internet.",
      "Les routes sont lues dans l’ordre et seule la première correspondance est utilisée.",
      "Internet ne peut pas utiliser de route par défaut dans le simulateur : il lui faut des routes de retour explicites.",
      "Les préfixes générés fournissent des familles d’adresses permettant de construire les réseaux."
    ],
    method: [
      "Place A, B et R1 dans E.198.F.0/25 ; A et B utilisent R1 comme gateway.",
      "Place R1-R2 dans J.K.17.252/30 avec R1 .254 et R2 .253.",
      "Place C dans J.K.18.0/24 derrière R2.",
      "Pour D, relève la gateway G1.G2.G3.G4 imposée dans sa route. Attribue cette IP à R2 et place D dans le même sous-réseau, par exemple G1.G2.G3.0/24.",
      "Sur R1, crée une route vers chacun des réseaux C et D via R2, avant la route par défaut Internet.",
      "Sur R2, utilise R1 comme route par défaut.",
      "Sur Internet, renseigne trois routes de retour : LAN A-B, LAN C et le réseau construit autour de la gateway fixe de D."
    ],
    example:
      "LAN A-B = E.198.F.0/25, R1 = .1\nTransit = J.K.17.252/30, R1 = .254, R2 = .253\nLAN C = J.K.18.0/24\nGateway D imposée = G1.G2.G3.G4\nR2-D = G1.G2.G3.G4/24, D = même /24 avec une autre IP\nInternet -> E.198.F.0/22, J.K.18.0/24 et G1.G2.G3.0/24 via 163.172.250.12",
    why: [
      "R1 sait distinguer les deux réseaux derrière R2 avant d’utiliser sa route Internet.",
      "R2 renvoie tout réseau inconnu à R1.",
      "Internet possède une route de retour pour chaque famille interne publique, y compris le réseau dicté par la gateway fixe de D."
    ],
    traps: [
      "La route de B vers 8.8.8.8 doit devenir une route utile, généralement default.",
      "Place toujours les routes spécifiques avant une route plus large.",
      "N’utilise pas 10.0.0.0/8 si C doit communiquer avec Internet : le simulateur refuse les réseaux privés.",
      "Ne modifie pas mentalement la gateway fixe de D : c’est le réseau D qui doit s’adapter autour d’elle."
    ]
  },
  {
    number: "10",
    title: "Synthèse complète",
    focus: "Plan d’adressage hiérarchique dans un /24",
    diagram: {
      ratio: "16 / 12",
      nodes: [
        { id: "H1", type: "pc", label: "H1", detail: "LAN switché", x: 82, y: 62 },
        { id: "H2", type: "pc", label: "H2", detail: "LAN switché", x: 82, y: 22 },
        { id: "S1", type: "switch", label: "Switch", detail: "H1 + H2", x: 65, y: 42 },
        { id: "R1", type: "router", label: "R1", detail: "bordure", x: 42, y: 46 },
        { id: "I", type: "internet", label: "Internet", detail: "agrégat /24", x: 16, y: 20 },
        { id: "R2", type: "router", label: "R2", detail: "distribution", x: 42, y: 75 },
        { id: "H3", type: "pc", label: "H3", detail: "LAN dédié", x: 72, y: 84 },
        { id: "H4", type: "pc", label: "H4", detail: "LAN /26 fixe", x: 18, y: 88 }
      ],
      links: [["H1", "S1"], ["H2", "S1"], ["S1", "R1"], ["I", "R1"], ["R1", "R2"], ["R2", "H3"], ["R2", "H4"]]
    },
    topology: [
      [
        { type: "pc", label: "H1", detail: "LAN switché" },
        { type: "switch", label: "Switch", detail: "H1 + H2" },
        { type: "pc", label: "H2", detail: "LAN switché" }
      ],
      [
        { type: "switch", label: "Switch", detail: "LAN principal" },
        { type: "router", label: "R1", detail: "bordure" },
        { type: "router", label: "R2", detail: "distribution" },
        { type: "pc", label: "H3", detail: "LAN dédié" }
      ],
      [
        { type: "internet", label: "Internet", detail: "agrégat /24" },
        { type: "router", label: "R1", detail: "liaison publique" }
      ],
      [
        { type: "router", label: "R2", detail: "distribution" },
        { type: "pc", label: "H4", detail: "LAN /26 fixe" }
      ]
    ],
    principle: [
      "Les adresses fixes suggèrent de ranger tous les réseaux internes dans A.B.C.0/24.",
      "Le LAN H1-H2 occupe A.B.C.0/25.",
      "Le LAN H4 occupe A.B.C.128/26.",
      "Le LAN H3 peut occuper A.B.C.192/27 et le transit R1-R2 A.B.C.252/30.",
      "Internet peut alors résumer tous les réseaux internes par A.B.C.0/24."
    ],
    method: [
      "Configure H2 dans A.B.C.0/25 avec la gateway fixe A.B.C.1.",
      "Mets R1-R2 en /30 : R1 A.B.C.254, R2 A.B.C.253.",
      "Configure l’interface R2-H4 en A.B.C.129/26 pour correspondre à la gateway fixe de H4.",
      "Configure R2-H3 en A.B.C.193/27 et H3 en A.B.C.194/27 avec gateway .193.",
      "Sur R1, route A.B.C.192/27 via .253 ; la route fixe A.B.C.128/26 couvre H4.",
      "Sur R2, route par défaut via .254.",
      "Sur Internet, remplace le /31 par A.B.C.0/24 via 163.172.250.12."
    ],
    example:
      "H1/H2/R1 = A.B.C.0/25\nH4/R2 = A.B.C.128/26\nH3/R2 = A.B.C.192/27\nR1/R2 = A.B.C.252/30\nInternet return = A.B.C.0/24 via 163.172.250.12",
    why: [
      "Chaque lien dispose d’un sous-réseau distinct.",
      "Les sous-réseaux internes sont tous inclus dans le même /24 sans chevauchement.",
      "R1 et Internet peuvent utiliser une agrégation, tandis que R2 distribue vers les LAN précis."
    ],
    traps: [
      "Ne laisse pas H3 en 192.168.x.x : Internet rejetterait le chemin retour privé.",
      "Le masque de R1 .254 doit être /30 pour rejoindre uniquement R2 .253.",
      "La route Internet /31 initiale est trop petite ; elle doit couvrir l’agrégat interne."
    ]
  }
];
