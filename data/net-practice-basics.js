window.NET_PRACTICE_BASICS = {
  title: "Les bases indispensables avant Net Practice",
  intro:
    "Avant de remplir une case, il faut savoir ce que représente chaque information. Cette courte progression part d’un réseau concret et donne les réflexes nécessaires pour lire les dix niveaux.",
  lessons: [
    {
      letter: "A",
      title: "Une IP identifie une interface",
      novice:
        "Une adresse IP fonctionne comme l’adresse d’une maison. Elle permet de désigner une interface précise sur un réseau.",
      example:
        "PC A : 28.141.155.227\nRouteur : 28.141.155.254\nCes deux adresses sont différentes : elles désignent deux interfaces différentes.",
      technical:
        "Une adresse IPv4 contient 32 bits, écrits sous la forme de quatre nombres de 0 à 255. Dans Net Practice, chaque case IP appartient à une interface, pas à l’équipement entier.",
      remember:
        "Deux interfaces présentes sur le même réseau ne doivent jamais avoir la même IP."
    },
    {
      letter: "B",
      title: "Le masque indique la taille du quartier",
      novice:
        "Si l’IP est l’adresse de la maison, le masque délimite le quartier. Deux maisons peuvent se parler directement seulement si elles se trouvent dans le même quartier.",
      example:
        "28.141.155.227/25 et 28.141.155.254/25 sont dans le même quartier : 28.141.155.128 à 28.141.155.255.",
      technical:
        "Le /25 signifie que 25 bits décrivent le réseau et que 7 bits restent disponibles. Il existe donc 2⁷ = 128 adresses dans le bloc.",
      remember:
        "Une IP seule ne suffit pas. Il faut toujours la lire avec son masque."
    },
    {
      letter: "C",
      title: "Réseau, hôtes et broadcast",
      novice:
        "La première adresse nomme le quartier. La dernière sert à parler à tout le quartier. Les adresses entre les deux peuvent être attribuées aux machines.",
      example:
        "Pour 28.141.155.227/25 :\nRéseau : 28.141.155.128\nHôtes : 28.141.155.129 à 28.141.155.254\nBroadcast : 28.141.155.255",
      technical:
        "Pour /25, le pas vaut 256 - 128 = 128 dans le dernier octet. Les blocs sont donc 0-127 puis 128-255.",
      remember:
        "On n’attribue ni l’adresse réseau ni l’adresse de broadcast à une interface."
    },
    {
      letter: "D",
      title: "Le switch relie, le routeur fait changer de réseau",
      novice:
        "Un switch ressemble à une multiprise réseau : il relie les machines d’un même quartier. Un routeur ressemble à un carrefour : il permet de sortir vers un autre quartier.",
      example:
        "PC A -> switch -> PC B : même réseau.\nPC A -> routeur -> autre réseau : changement de réseau.",
      technical:
        "Le switch commute des trames dans un même domaine de niveau 2. Le routeur examine l’IP de destination et choisit une interface ou un next hop.",
      remember:
        "Un switch n’est pas une gateway et ne permet pas, à lui seul, de franchir un sous-réseau."
    },
    {
      letter: "E",
      title: "La gateway est la sortie locale",
      novice:
        "Quand la destination n’est pas dans son quartier, la machine confie le paquet à la porte de sortie du quartier : sa gateway.",
      example:
        "PC A : 28.141.155.227/25\nGateway : 28.141.155.254\nLa gateway est joignable directement, car elle appartient au même /25.",
      technical:
        "Le next hop d’une route doit être une interface voisine, accessible sur un réseau directement connecté.",
      remember:
        "La gateway n’est pas la destination finale. C’est le prochain équipement auquel remettre le paquet."
    },
    {
      letter: "F",
      title: "Une route est un panneau de direction",
      novice:
        "Une route dit : « pour atteindre cette destination, passe par cette sortie ». La route par défaut dit : « pour tout ce que je ne connais pas, utilise cette sortie ».",
      example:
        "0.0.0.0/0 via 28.141.155.254\nTout réseau non local est confié au routeur 28.141.155.254.",
      technical:
        "Le routeur retient la route la plus spécifique parmi celles qui correspondent à la destination. /0 correspond à toutes les IPv4 et sert de dernier recours.",
      remember:
        "Destination = réseau recherché. Gateway = voisin auquel le paquet est remis."
    },
    {
      letter: "G",
      title: "L’aller ne suffit jamais",
      novice:
        "Un échange fonctionne seulement si le paquet peut partir et si la réponse sait revenir. Une route de retour est donc aussi importante que la route d’aller.",
      example:
        "Internet : 28.141.155.128/25 via 163.172.250.12\nInternet sait que les réponses destinées au LAN doivent revenir vers l’interface publique du routeur.",
      technical:
        "Chaque équipement traversé doit posséder une route applicable à la destination. Le chemin retour peut être différent, mais il doit exister.",
      remember:
        "Après chaque configuration, raconte le trajet aller puis le trajet retour, équipement par équipement."
    }
  ],
  masks: [
    ["/24", "255.255.255.0", "256", "254", "0"],
    ["/25", "255.255.255.128", "128", "126", "0, 128"],
    ["/26", "255.255.255.192", "64", "62", "0, 64, 128, 192"],
    ["/27", "255.255.255.224", "32", "30", "0, 32, 64, 96, 128, 160, 192, 224"],
    ["/28", "255.255.255.240", "16", "14", "multiples de 16"],
    ["/29", "255.255.255.248", "8", "6", "multiples de 8"],
    ["/30", "255.255.255.252", "4", "2", "multiples de 4"]
  ],
  questions: [
    {
      title: "Comment savoir si deux IP sont dans le même réseau ?",
      answer:
        "Calcule le bloc de chaque IP avec le même masque. Si les deux donnent la même adresse réseau, elles peuvent communiquer directement."
    },
    {
      title: "Pourquoi calculer 256 moins le dernier octet du masque ?",
      answer:
        "Le résultat donne le pas entre deux réseaux lorsque la coupure se trouve dans cet octet. Avec 255.255.255.224, 256 - 224 = 32 : les réseaux commencent à 0, 32, 64, 96, etc."
    },
    {
      title: "Quelle IP choisir pour un routeur ?",
      answer:
        "N’importe quelle adresse hôte libre du sous-réseau convient. On choisit souvent la première ou la dernière adresse utilisable pour rendre le plan facile à lire."
    },
    {
      title: "Que vérifier avant de lancer le check ?",
      answer:
        "Réseaux sans chevauchement, IP uniques, aucune adresse réseau ou broadcast utilisée, gateway locale, routes d’aller et de retour, puis trajet complet du paquet."
    }
  ]
};
