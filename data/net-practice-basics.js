window.NET_PRACTICE_BASICS = {
  title: "NetPractice sans paniquer",
  intro:
    "NetPractice ne demande pas de deviner. Chaque valeur se déduit en regardant les connexions et les informations déjà présentes.",
  keySentence:
    "On regarde les câbles, on identifie les quartiers réseau, puis on place les routes.",
  ideas: [
    {
      letter: "A",
      title: "IP",
      short: "L’IP dit qui est la machine.",
      body:
        "Imagine l’adresse d’une maison. Une IP identifie une interface réseau précise. Un routeur possède plusieurs interfaces, donc plusieurs IP."
    },
    {
      letter: "B",
      title: "Mask",
      short: "Le mask dit qui est dans le même quartier réseau.",
      body:
        "L’IP donne l’adresse de la maison. Le mask fixe les limites du quartier. Sans le mask, on ne peut pas savoir quelles machines sont voisines."
    },
    {
      letter: "C",
      title: "Même réseau",
      short: "Deux machines peuvent parler directement seulement si elles sont dans le même réseau.",
      body:
        "Deux interfaces reliées par le même câble ou le même switch doivent appartenir au même quartier. Sinon, elles ont besoin d’un routeur entre elles."
    },
    {
      letter: "D",
      title: "Gateway",
      short: "La gateway est la porte de sortie du quartier.",
      body:
        "Pour une machine, la gateway est l’interface de son routeur local. Elle doit être dans le même réseau que la machine, sinon la machine ne peut pas lui remettre le paquet."
    },
    {
      letter: "E",
      title: "Route",
      short: "Une route pointe vers le prochain voisin.",
      body:
        "Une route est un panneau : « pour aller là-bas, passe par ici ». Elle ne donne pas forcément la destination finale. Elle indique le next hop, c’est-à-dire le prochain voisin."
    }
  ],
  referenceCards: [
    {
      title: "IPv4 dans NetPractice",
      body:
        "NetPractice travaille avec des IPv4 : quatre nombres de 0 à 255. Le masque découpe cette IP en deux parties : le réseau, qui doit être commun aux voisin·es, et l’hôte, qui identifie l’interface précise."
    },
    {
      title: "Adresse réseau et broadcast",
      body:
        "Dans un bloc, la première adresse représente le réseau et la dernière représente le broadcast. Elles servent à nommer le bloc, pas à configurer une interface. Les machines utilisent seulement les adresses entre les deux."
    },
    {
      title: "Privé, public et Internet",
      body:
        "Les plages 10.0.0.0/8, 172.16.0.0/12 et 192.168.0.0/16 sont privées. Dans les niveaux avec Internet, évite de placer ces réseaux côté Internet : le bloc Internet attend des routes vers des réseaux publics affichés par l’exercice."
    },
    {
      title: "Switch",
      body:
        "Un switch regroupe plusieurs interfaces dans le même réseau local. Il ne choisit pas de route, ne sert pas de gateway et ne sépare pas les sous-réseaux."
    },
    {
      title: "Routeur",
      body:
        "Un routeur relie plusieurs réseaux. Chaque interface du routeur appartient à un réseau différent ; deux interfaces du même routeur ne doivent pas couvrir des plages qui se chevauchent."
    },
    {
      title: "Destination et next hop",
      body:
        "La destination indique le réseau que l’on veut atteindre. Le next hop indique le prochain voisin direct à qui remettre le paquet. Une route par défaut, 0.0.0.0/0, sert quand aucune route plus précise ne correspond."
    }
  ],
  mentalDiagram: "Machine A\n    |\n  Switch\n    |\n Routeur\n    |\n Internet",
  mentalExplanation: [
    "Machine A ne connaît pas directement Internet.",
    "Elle donne donc le paquet à son routeur local.",
    "Le routeur regarde ses panneaux de direction et l’envoie plus loin.",
    "Internet doit aussi connaître le chemin permettant à la réponse de revenir."
  ],
  route: {
    expression: "destination => next hop",
    destination: "Destination : le réseau ou l’adresse que je veux atteindre.",
    nextHop: "Next hop : le voisin direct auquel je donne le paquet maintenant.",
    example: "0.0.0.0/0 => 192.168.1.254",
    translation:
      "Pour tout ce que je ne connais pas, j’envoie au routeur 192.168.1.254.",
    warning:
      "Le next hop doit être joignable directement. Il doit donc être dans le même réseau local que l’interface qui utilise cette route."
  },
  masks: [
    ["/0", "0.0.0.0", "toutes les IPv4", "route par défaut, pas un LAN"],
    ["/8", "255.0.0.0", "16 777 216", "pas de 256 dans le 2e octet"],
    ["/16", "255.255.0.0", "65 536", "pas de 256 dans le 3e octet"],
    ["/18", "255.255.192.0", "16 384", "pas de 64 dans le 3e octet"],
    ["/22", "255.255.252.0", "1 024", "pas de 4 dans le 3e octet"],
    ["/23", "255.255.254.0", "512", "pas de 2 dans le 3e octet"],
    ["/24", "255.255.255.0", "256", "pas de 256 dans le 4e octet"],
    ["/25", "255.255.255.128", "128", "pas de 128 dans le 4e octet"],
    ["/26", "255.255.255.192", "64", "pas de 64 dans le 4e octet"],
    ["/27", "255.255.255.224", "32", "pas de 32 dans le 4e octet"],
    ["/28", "255.255.255.240", "16", "pas de 16 dans le 4e octet"],
    ["/29", "255.255.255.248", "8", "pas de 8 dans le 4e octet"],
    ["/30", "255.255.255.252", "4", "pas de 4 dans le 4e octet"],
    ["/31", "255.255.255.254", "2", "deux adresses seulement"]
  ],
  maskTip: {
    rule:
      "Repère le premier octet du mask qui n’est ni 255 ni 0. Le pas dans cet octet vaut 256 moins sa valeur.",
    example:
      "/25 : 255.255.255.128\nOctet actif : le 4e\n256 - 128 = 128\nBlocs : .0-.127 puis .128-.255\n\n/18 : 255.255.192.0\nOctet actif : le 3e\n256 - 192 = 64\nBlocs du 3e octet : 0-63, 64-127, 128-191, 192-255"
  },
  guidedExample: {
    ip: "28.141.155.227",
    mask: "255.255.255.128",
    steps: [
      "255.255.255.128 correspond à /25.",
      "Un /25 forme des blocs de 128 adresses.",
      "Les blocs sont 28.141.155.0 à 28.141.155.127, puis 28.141.155.128 à 28.141.155.255.",
      "28.141.155.227 appartient au deuxième bloc.",
      "Son réseau est donc 28.141.155.128/25.",
      "Les adresses utilisables vont de 28.141.155.129 à 28.141.155.254.",
      "28.141.155.128 est l’adresse réseau et 28.141.155.255 le broadcast : elles sont interdites pour une interface.",
      "28.141.155.254 est donc une IP possible pour le routeur local."
    ],
    result:
      "Machine : 28.141.155.227/25\nRéseau : 28.141.155.128/25\nHôtes : 28.141.155.129 à 28.141.155.254\nRouteur possible : 28.141.155.254\nBroadcast : 28.141.155.255"
  },
  method: [
    {
      title: "Je regarde les câbles",
      body: "Je repère quelles interfaces sont directement reliées."
    },
    {
      title: "Je dessine les réseaux locaux",
      body: "Chaque câble entre deux équipements, ou chaque groupe relié par un switch, forme un réseau local."
    },
    {
      title: "Je place les IP voisines",
      body: "Sur un même réseau local, les interfaces doivent appartenir au même bloc et avoir des IP différentes."
    },
    {
      title: "Je place les gateways",
      body: "Une machine sort toujours par l’interface locale de son routeur."
    },
    {
      title: "Je place les routes entre routeurs",
      body: "Chaque route pointe vers le prochain routeur directement joignable."
    },
    {
      title: "Je vérifie le retour",
      body: "Je refais tout le trajet dans l’autre sens. Dans NetPractice, l’aller ne suffit pas : la réponse doit savoir revenir."
    }
  ],
  antiPanic: [
    "Ignore les routes au début.",
    "Regarde seulement les câbles.",
    "Mets les deux bouts d’un câble dans le même réseau.",
    "Vérifie que chaque route pointe vers un voisin direct.",
    "Suis le paquet à l’aller, puis au retour."
  ],
  notes: [
    "En mode training, la forme d’un niveau reste la même. Les IP sont générées à partir du login : même login et même niveau donnent les mêmes valeurs.",
    "Internet représente une destination extérieure. Tu n’as pas besoin d’inventer son IP exacte.",
    "Dans la vraie vie, 8.8.8.8 est un exemple d’adresse Internet. Dans NetPractice, suis uniquement les informations affichées par le bloc Internet."
  ],
  successQuestions: [
    "C’est quoi une IP et un mask ?",
    "Comment savoir si deux IP sont dans le même réseau ?",
    "Pourquoi une gateway doit-elle être dans le réseau local ?",
    "Comment lire 0.0.0.0/0 et destination => next hop ?",
    "Pourquoi le next hop doit-il être un voisin direct ?",
    "Pourquoi faut-il une route de retour ?",
    "Comment choisir une IP valide sans deviner ?"
  ]
};
