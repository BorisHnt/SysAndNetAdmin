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
    ["/24", "255.255.255.0", "256"],
    ["/25", "255.255.255.128", "128"],
    ["/26", "255.255.255.192", "64"],
    ["/27", "255.255.255.224", "32"],
    ["/28", "255.255.255.240", "16"],
    ["/29", "255.255.255.248", "8"],
    ["/30", "255.255.255.252", "4"]
  ],
  maskTip: {
    rule: "Taille du bloc = 256 - dernier nombre du mask.",
    example:
      "Mask : 255.255.255.128\n256 - 128 = 128\nLes réseaux avancent donc par blocs de 128 adresses."
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
