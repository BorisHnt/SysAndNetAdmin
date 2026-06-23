window.NET_PRACTICE_EXPLANATIONS = {
  "01": {
    title: "Comprendre pourquoi deux machines peuvent communiquer sans routeur",
    intro: [
      "Ce premier niveau sert à installer le réflexe fondamental de Net Practice : avant de chercher une gateway ou une route, il faut déterminer si la destination est locale.",
      "Deux interfaces reliées directement peuvent communiquer si le calcul « IP ET masque » donne le même réseau des deux côtés. Leurs IP doivent cependant rester différentes et ne pas correspondre au réseau ou au broadcast."
    ],
    observations: [
      "Il existe deux liens totalement indépendants : A-B et C-D.",
      "Aucune gateway n’est affichée, car aucun routeur ne relie ces machines.",
      "Le masque du lien A-B est /24 ; celui du lien C-D est /16.",
      "Une IP est fixe sur chaque lien. C’est elle qui donne les octets réseau à conserver."
    ],
    calculations: [
      {
        title: "Résoudre le lien A-B en /24",
        body: [
          "Un /24 vaut 255.255.255.0. Les 24 premiers bits, donc les trois premiers octets, représentent le réseau.",
          "Si A vaut 104.96.23.13/24, son réseau est 104.96.23.0 et son broadcast 104.96.23.255. B doit donc commencer par 104.96.23."
        ],
        code: "A : 104.96.23.13/24\nRéseau : 104.96.23.0\nPlage : 104.96.23.1 -> 104.96.23.254\nB possible : 104.96.23.42/24"
      },
      {
        title: "Résoudre le lien C-D en /16",
        body: [
          "Un /16 vaut 255.255.0.0. Seuls les deux premiers octets sont imposés par le réseau.",
          "Si D vaut 211.191.65.76/16, C peut changer ses deux derniers octets tant que l’adresse reste dans 211.191.0.1 à 211.191.255.254."
        ],
        code: "D : 211.191.65.76/16\nRéseau : 211.191.0.0\nBroadcast : 211.191.255.255\nC possible : 211.191.80.42/16"
      },
      {
        title: "Contrôler les adresses interdites",
        body: [
          "L’adresse réseau possède tous ses bits hôte à 0. Le broadcast possède tous ses bits hôte à 1.",
          "Ces deux adresses ne peuvent pas être attribuées aux interfaces. Il faut aussi éviter de donner la même IP aux deux extrémités."
        ],
        code: "/24 : .0 interdit, .255 interdit\n/16 : X.Y.0.0 interdit, X.Y.255.255 interdit"
      }
    ],
    packet: [
      "A compare l’IP de B avec son propre masque. Comme le réseau calculé est identique, A considère B comme une destination locale.",
      "A envoie directement sur le câble. B effectue le même raisonnement pour répondre à A.",
      "Le lien C-D fonctionne de la même façon, mais avec une partie hôte de 16 bits au lieu de 8."
    ],
    packetTrace: "A 104.96.23.13/24\n  -> destination B 104.96.23.42 appartient à 104.96.23.0/24\n  -> envoi direct\nB reçoit puis répond directement à A",
    verification: [
      "Les deux IP de chaque lien sont-elles différentes ?",
      "Les deux côtés du lien utilisent-ils le même masque ?",
      "Le calcul du réseau donne-t-il exactement le même résultat ?",
      "Aucune IP n’est-elle une adresse réseau ou broadcast ?",
      "Les valeurs générées supérieures à 255 ont-elles été remplacées ?"
    ]
  },
  "02": {
    title: "Trouver un bloc grâce au pas du masque",
    intro: [
      "Ce niveau demande de quitter le raisonnement approximatif « les premiers octets se ressemblent ». Il faut identifier l’intervalle exact couvert par le masque.",
      "Le premier lien utilise un /27, donc des blocs de 32 adresses. Le second utilise un /30, donc des blocs de 4 adresses."
    ],
    observations: [
      "Sur A-B, l’adresse fixe se termine par .222 et le masque attendu est /27.",
      "Le masque affiché 255.255.255.32 est invalide : les bits à 1 d’un masque doivent être contigus.",
      "Sur C-D, les deux IP initiales commencent par 127, plage réservée au loopback.",
      "Le /30 de C-D ne laisse que deux adresses utilisables."
    ],
    calculations: [
      {
        title: "Calculer le bloc contenant .222 en /27",
        body: [
          "Un /27 laisse 5 bits hôte : 2^5 = 32 adresses par bloc. Le pas est donc 32.",
          "Les départs de blocs sont 0, 32, 64, 96, 128, 160, 192 et 224. Le nombre 222 tombe dans le bloc 192-223."
        ],
        code: "192 <= 222 <= 223\nRéseau : .192\nBroadcast : .223\nHôtes : .193 -> .222"
      },
      {
        title: "Choisir A et réparer le masque de B",
        body: [
          "A doit partager les trois premiers octets de B et choisir un dernier octet dans .193-.222, différent de .222.",
          "Le masque correct est /27 ou 255.255.255.224 des deux côtés."
        ],
        code: "B : 192.168.130.222/27\nA possible : 192.168.130.193/27"
      },
      {
        title: "Construire un lien /30 propre pour C-D",
        body: [
          "Un /30 laisse 2 bits hôte : 2^2 = 4 adresses. Dans chaque bloc, la première est le réseau, les deux suivantes sont utilisables et la dernière est le broadcast.",
          "Choisis un bloc non loopback. Dans 10.10.10.0/30, seules .1 et .2 sont utilisables."
        ],
        code: "10.10.10.0/30\n.0 réseau\n.1 C\n.2 D\n.3 broadcast"
      }
    ],
    packet: [
      "Sur A-B, les deux interfaces calculent le réseau 192.168.130.192/27 et envoient directement.",
      "Sur C-D, les deux interfaces calculent 10.10.10.0/30. Chaque extrémité utilise l’une des deux seules adresses hôte.",
      "Aucun routeur n’intervient, donc une gateway ne réparerait pas un mauvais masque."
    ],
    packetTrace: "C 10.10.10.1/30\n  -> D 10.10.10.2 appartient au même bloc 10.10.10.0/30\n  -> envoi direct\nD répond dans le même bloc",
    verification: [
      "Le masque de B est-il un vrai /27 ?",
      "A et B sont-ils tous deux dans .192-.223 ?",
      "Les adresses 127.x.x.x ont-elles disparu ?",
      "C et D utilisent-ils les deux adresses centrales du même /30 ?",
      "Les adresses réseau et broadcast sont-elles exclues ?"
    ]
  },
  "03": {
    title: "Comprendre qu’un switch ne crée pas de nouveaux réseaux",
    intro: [
      "Un switch relie plusieurs interfaces dans le même LAN. Il transmet des trames, mais ne choisit pas de route IP entre plusieurs sous-réseaux.",
      "A, B et C doivent donc être configurés comme s’ils partageaient un même câble logique."
    ],
    observations: [
      "Les trois PC sont reliés au même switch.",
      "Le switch n’a pas d’adresse IP utile dans l’exercice.",
      "A possède une IP fixe terminant par .125.",
      "C impose un /25, ce qui détermine le découpage à utiliser pour tout le LAN."
    ],
    calculations: [
      {
        title: "Découper le /24 en deux blocs /25",
        body: [
          "Un /25 laisse 7 bits hôte : 2^7 = 128 adresses par bloc.",
          "Les deux blocs sont .0-.127 et .128-.255. L’adresse .125 de A appartient au premier."
        ],
        code: "Bloc 1 : .0 réseau, .1-.126 hôtes, .127 broadcast\nBloc 2 : .128 réseau, .129-.254 hôtes, .255 broadcast"
      },
      {
        title: "Aligner les masques",
        body: [
          "A et B doivent utiliser /25 comme C. Si l’un reste en /24 ou /16, il n’aura pas la même perception du réseau.",
          "Un masque cohérent sur toutes les interfaces simplifie le raisonnement local et évite les destinations vues différemment selon la machine."
        ],
        code: "A : 104.198.76.125/25\nB : 104.198.76.126/25\nC : 104.198.76.120/25"
      },
      {
        title: "Choisir trois IP distinctes",
        body: [
          "La plage utilisable est .1-.126. A occupe déjà .125.",
          "Choisis deux autres valeurs pour B et C. L’ordre importe peu ; l’unicité et l’appartenance au bloc importent."
        ],
        code: "Réseau commun : 104.198.76.0/25\nIP interdites : .0 et .127\nIP déjà prise : .125"
      }
    ],
    packet: [
      "A calcule que B et C appartiennent à son propre /25. Il envoie donc directement sur le LAN.",
      "Le switch transmet la trame vers les ports concernés. Il ne modifie ni l’IP source, ni l’IP destination.",
      "Chaque PC peut répondre directement, car tous calculent le même réseau."
    ],
    packetTrace: "A -> Switch -> B\nA -> Switch -> C\nB -> Switch -> C\nAucune gateway et aucune table de routage",
    verification: [
      "Les trois machines utilisent-elles /25 ?",
      "Les trois premiers octets sont-ils identiques ?",
      "Les derniers octets sont-ils compris entre 1 et 126 ?",
      "Les trois IP sont-elles différentes ?",
      "Aucune route ou gateway inutile n’a-t-elle été inventée ?"
    ]
  },
  "04": {
    title: "Intégrer une interface de routeur dans un LAN sans chevauchement",
    intro: [
      "Le routeur possède plusieurs interfaces. Celle qui est reliée au switch doit partager le LAN de A et B, mais ne doit pas chevaucher les réseaux de ses autres interfaces.",
      "L’adresse fixe .133 de B et son /26 fournissent un bloc compact qui s’insère entre les autres réseaux."
    ],
    observations: [
      "A, B et R1 sont reliés au même switch.",
      "B possède l’adresse 73.53.112.133.",
      "Les autres interfaces fixes du routeur utilisent des plages situées plus bas et plus haut dans le même dernier octet.",
      "Le masque proposé /23 pour R1 est beaucoup trop large et ferait correspondre plusieurs interfaces du routeur."
    ],
    calculations: [
      {
        title: "Trouver le bloc de .133 en /26",
        body: [
          "Un /26 laisse 6 bits hôte : 2^6 = 64 adresses. Le pas est 64.",
          "133 tombe entre 128 et 191. Le réseau vaut .128, le broadcast .191 et les hôtes .129-.190."
        ],
        code: "128 <= 133 <= 191\n73.53.112.128/26\nHôtes : 73.53.112.129 -> 73.53.112.190"
      },
      {
        title: "Attribuer l’interface LAN du routeur",
        body: [
          "Choisis pour R1 une adresse libre du bloc, par exemple .129.",
          "Cette adresse devient la présence du routeur sur le LAN. Même si aucune sortie vers un autre réseau n’est demandée ici, les PC doivent pouvoir joindre cette interface."
        ],
        code: "R1 LAN : 73.53.112.129/26\nA : 73.53.112.132/26"
      },
      {
        title: "Configurer B et éliminer le chevauchement",
        body: [
          "A reçoit une autre adresse libre, par exemple .132, avec le même /26.",
          "Un /23 couvrirait une plage beaucoup plus large et entrerait en conflit avec les autres interfaces du routeur. Le /26 évite cette ambiguïté."
        ],
        code: "B : 73.53.112.133/26\nRéseau local unique : 73.53.112.128/26"
      }
    ],
    packet: [
      "A, B et R1 calculent tous le réseau 73.53.112.128/26.",
      "Le trafic entre eux reste sur le switch. Aucun passage par une autre interface du routeur n’est nécessaire.",
      "Comme une seule interface du routeur correspond à ce réseau, le simulateur ne rencontre pas d’ambiguïté."
    ],
    packetTrace: "A -> Switch -> B\nA -> Switch -> interface LAN R1\nB -> Switch -> interface LAN R1",
    verification: [
      "A, B et R1 utilisent-ils exactement /26 ?",
      "Les IP sont-elles dans .129-.190 ?",
      "Les trois IP sont-elles distinctes ?",
      "Le masque trop large de R1 a-t-il été remplacé ?",
      "Aucune autre interface du routeur ne couvre-t-elle ce même bloc ?"
    ]
  },
  "05": {
    title: "Passer d’un LAN à l’autre grâce aux gateways",
    intro: [
      "Ce niveau introduit le routage réel : A et B ne sont pas sur le même lien. Chacun doit atteindre l’interface locale du routeur, puis le routeur transmet vers son autre interface.",
      "Le routeur connaît automatiquement les réseaux connectés directement. Ce sont donc surtout les IP et les routes des hôtes qu’il faut construire."
    ],
    observations: [
      "R1 fait face à A avec une IP et un masque fixes.",
      "R2 fait face à B avec une autre IP et un autre masque fixes.",
      "A et B contiennent des valeurs initiales qui ne correspondent pas nécessairement aux réseaux du routeur.",
      "A possède une route entièrement modifiable ; B possède une route par défaut dont la gateway est modifiable."
    ],
    calculations: [
      {
        title: "Construire le LAN de A autour de R1",
        body: [
          "Calcule le réseau de R1 avec son masque. Si R1 vaut 76.5.75.126/25, le réseau est 76.5.75.0/25.",
          "A doit recevoir une IP de .1 à .125, car .126 est déjà utilisée par R1 et .127 est le broadcast."
        ],
        code: "R1 : 76.5.75.126/25\nA : 76.5.75.125/25\nGateway locale A : 76.5.75.126"
      },
      {
        title: "Construire le LAN de B autour de R2",
        body: [
          "Un /18 possède un pas de 64 dans le troisième octet. Si R2 vaut 144.197.75.254/18, 75 tombe dans le bloc 64-127.",
          "B doit donc utiliser 144.197.x.y avec un troisième octet entre 64 et 127 et une adresse différente de R2."
        ],
        code: "R2 : 144.197.75.254/18\nRéseau : 144.197.64.0/18\nB possible : 144.197.75.253/18"
      },
      {
        title: "Écrire les routes des hôtes",
        body: [
          "A peut utiliser une route spécifique vers le réseau de B ou une route par défaut. Dans les deux cas, le next hop est R1.",
          "B utilise sa route par défaut via R2. La gateway n’est jamais l’IP distante de A : c’est toujours le voisin local."
        ],
        code: "A : default via 76.5.75.126\nB : default via 144.197.75.254"
      }
    ],
    packet: [
      "A constate que B n’est pas dans son /25 et consulte sa table de routage. La route par défaut lui indique R1.",
      "R1 reçoit le paquet. Il voit que le réseau de B est directement connecté à son interface R2 et transmet sur ce lien.",
      "B répond via sa propre gateway R2. Le routeur utilise alors son interface R1 pour revenir vers A."
    ],
    packetTrace: "A -> gateway R1\nR1 -> réseau directement connecté de B via R2\nB reçoit\nB -> gateway R2\nRouteur -> réseau directement connecté de A via R1\nA reçoit",
    verification: [
      "A partage-t-il un réseau avec R1 ?",
      "B partage-t-il un réseau avec R2 ?",
      "Les gateways sont-elles les interfaces locales du routeur ?",
      "Les routes couvrent-elles réellement le réseau distant ?",
      "Le chemin retour de B vers A est-il possible ?"
    ]
  },
  "06": {
    title: "Construire un aller et un retour entre un LAN et Internet",
    intro: [
      "Atteindre Internet exige une chaîne complète : serveur vers routeur, routeur vers Internet, puis une route de retour d’Internet vers le LAN.",
      "L’exemple utilise 28.141.155.227/25 pour rendre chaque calcul visible. Dans ton exercice, remplace ces nombres par ceux affichés, mais conserve exactement la même méthode."
    ],
    observations: [
      "Le serveur A possède l’adresse 28.141.155.227.",
      "Le routeur possède une interface publique 163.172.250.12/28 reliée au voisin Internet 163.172.250.1.",
      "La destination extérieure représente Internet ; son adresse précise n’est pas une gateway à saisir.",
      "Le simulateur refuse de router les plages privées depuis Internet."
    ],
    calculations: [
      {
        title: "Déterminer le LAN du serveur",
        body: [
          "Avec /25, les blocs sont .0-.127 et .128-.255. L’adresse .227 appartient au second bloc.",
          "Le réseau du serveur est donc 28.141.155.128/25, avec des hôtes .129-.254."
        ],
        code: "Serveur : 28.141.155.227/25\nRéseau : 28.141.155.128\nHôtes : 28.141.155.129 à 28.141.155.254\nBroadcast : 28.141.155.255"
      },
      {
        title: "Créer la gateway locale",
        body: [
          "L’interface LAN du routeur doit appartenir au même /25. 28.141.155.254 est libre et se trouve dans la plage hôte.",
          "Le serveur utilise cette adresse comme next hop de sa route par défaut."
        ],
        code: "Routeur LAN : 28.141.155.254/25\nServeur : default via 28.141.155.254"
      },
      {
        title: "Faire sortir le routeur vers Internet",
        body: [
          "Le routeur et Internet partagent le lien public 163.172.250.0/28.",
          "La route par défaut du routeur couvre toute destination extérieure et pointe vers l’interface Internet voisine 163.172.250.1."
        ],
        code: "Routeur WAN : 163.172.250.12/28\nRoute routeur : default via 163.172.250.1"
      },
      {
        title: "Écrire la route de retour",
        body: [
          "Internet doit savoir que 28.141.155.128/25 se trouve derrière le routeur.",
          "La gateway de cette route est l’interface publique du routeur, 163.172.250.12."
        ],
        code: "Internet : 28.141.155.128/25 via 163.172.250.12"
      }
    ],
    packet: [
      "Le serveur remet le paquet destiné à Internet à sa gateway 28.141.155.254.",
      "Le routeur applique sa route par défaut et remet le paquet à 163.172.250.1.",
      "Pour répondre, Internet consulte sa route vers 28.141.155.128/25 et renvoie le paquet à 163.172.250.12, puis le routeur livre localement au serveur."
    ],
    packetTrace: "Serveur -> 28.141.155.254\nRouteur -> 163.172.250.1\nDestination extérieure atteinte\nRetour Internet -> 163.172.250.12\nRouteur -> Serveur sur 28.141.155.128/25",
    verification: [
      "Le serveur et l’interface LAN sont-ils dans le même /25 ?",
      "La route du serveur pointe-t-elle vers le routeur local ?",
      "La route par défaut du routeur couvre-t-elle la destination extérieure ?",
      "Internet possède-t-il une route de retour vers le bon /25 ?",
      "Le LAN utilise-t-il une plage publique acceptée par le simulateur ?"
    ]
  },
  "07": {
    title: "Découper une chaîne de quatre équipements en trois réseaux",
    intro: [
      "Un câble entre deux interfaces définit un segment. Ici, trois câbles signifient trois sous-réseaux différents : A-R1, R1-R2 et R2-C.",
      "Dans ce tirage, les masques imposés sont des /28. Chaque segment a plus d’adresses que nécessaire, mais chaque câble reste dans son propre sous-réseau."
    ],
    observations: [
      "R1 possède une interface fixe se terminant par .1 face à A.",
      "R1 possède une interface fixe .254 face à R2.",
      "Aucune interface ne doit appartenir simultanément à deux segments.",
      "Toutes les routes affichées sont modifiables et peuvent devenir des routes par défaut."
    ],
    calculations: [
      {
        title: "Segment A-R1",
        body: [
          "L’adresse 93.198.14.1 appartient au bloc 93.198.14.0/28.",
          "Les hôtes utilisables vont de .1 à .14. R1 occupe .1, donc A peut prendre .2."
        ],
        code: "Réseau : 93.198.14.0/28\nR1 : 93.198.14.1\nA : 93.198.14.2"
      },
      {
        title: "Segment R1-R2",
        body: [
          "L’adresse .254 appartient au bloc .240-.255 en /28.",
          "Les adresses utilisables sont .241 à .254. R1 occupe .254, R2 prend .253."
        ],
        code: "Réseau : 93.198.14.240/28\nR2 : 93.198.14.253\nR1 : 93.198.14.254"
      },
      {
        title: "Segment R2-C",
        body: [
          "Il faut un troisième bloc qui ne chevauche pas les deux précédents.",
          "Le troisième bloc est 1.2.3.240/28, avec R2 en .252 et C en .253."
        ],
        code: "Réseau : 1.2.3.240/28\nR2 : 1.2.3.252\nC : 1.2.3.253"
      },
      {
        title: "Configurer les routes",
        body: [
          "A et C utilisent leur routeur local comme gateway.",
          "R1 envoie les destinations inconnues à R2 ; R2 envoie les destinations inconnues à R1. Comme il n’existe qu’un chemin, des routes par défaut suffisent."
        ],
        code: "A default via 93.198.14.1\nR1 default via 93.198.14.253\nR2 default via 93.198.14.254\nC default via 1.2.3.252"
      }
    ],
    packet: [
      "A remet le paquet à R1, car C n’est pas dans son /28.",
      "R1 applique sa route vers R2. R2 reconnaît ensuite le réseau de C comme directement connecté.",
      "Le retour suit exactement le chemin inverse grâce aux routes par défaut de C et R2."
    ],
    packetTrace: "A -> R1 93.198.14.1\nR1 -> R2 93.198.14.253\nR2 -> C sur 1.2.3.240/28\nC -> R2 1.2.3.252\nR2 -> R1 93.198.14.254\nR1 -> A",
    verification: [
      "As-tu créé exactement trois sous-réseaux ?",
      "Chaque paire reliée partage-t-elle le même /28 ?",
      "Les trois blocs sont-ils distincts ?",
      "Chaque gateway est-elle directement joignable ?",
      "Les routes permettent-elles le retour de C vers A ?"
    ]
  },
  "08": {
    title: "Découper un préfixe annoncé en plusieurs sous-réseaux",
    intro: [
      "Le niveau fournit un indice très fort : Internet sait joindre 146.29.78.0/26. Les réseaux internes accessibles depuis Internet doivent donc rester entre 146.29.78.0 et 146.29.78.63.",
      "Il faut réaliser un plan VLSM : plusieurs sous-réseaux de tailles différentes, sans chevauchement, tous contenus dans le même agrégat."
    ],
    observations: [
      "R1 est relié à Internet par un réseau public fixe.",
      "R1 et R2 ont besoin d’un petit réseau de transit.",
      "C et D sont chacun reliés directement à une interface différente de R2.",
      "La route de retour Internet couvre un /26 : c’est la frontière du plan d’adressage interne."
    ],
    calculations: [
      {
        title: "Visualiser l’espace disponible",
        body: [
          "146.29.78.0/26 contient 64 adresses : 146.29.78.0 à 146.29.78.63.",
          "Il faut y placer deux LAN et un transit. Une répartition possible est /28, /28 et /30."
        ],
        code: "Agrégat : 146.29.78.0/26\nDisponible : 146.29.78.0 -> 146.29.78.63\nBesoin : LAN C + LAN D + transit"
      },
      {
        title: "Réserver les deux LAN",
        body: [
          "73.53.112.0/28 couvre .0-.15, avec .1-.14 utilisables.",
          "73.53.112.16/28 couvre .16-.31, avec .17-.30 utilisables. Ces deux blocs sont distincts."
        ],
        code: "LAN C : 73.53.112.0/28, R2=.1, C=.2\nLAN D : 73.53.112.16/28, R2=.17, D=.18"
      },
      {
        title: "Placer le transit R1-R2",
        body: [
          "Le bloc 146.29.78.60/30 utilise .60-.63 et reste dans le /26.",
          "La gateway fixe de certaines routes permet de déduire quelle extrémité doit recevoir .61 ou .62."
        ],
        code: "Transit : 146.29.78.60/30\nR2 : 146.29.78.61\nR1 : 146.29.78.62"
      },
      {
        title: "Configurer l’agrégation et les routes",
        body: [
          "R1 n’a pas besoin d’une route par LAN : il peut envoyer tout 146.29.78.0/26 vers R2.",
          "R2 utilise R1 comme route par défaut. Internet utilise l’interface publique de R1 pour tout le /26."
        ],
        code: "R1 : 146.29.78.0/26 via 146.29.78.61\nR2 : default via 146.29.78.62\nInternet : 146.29.78.0/26 via 163.228.250.12"
      }
    ],
    packet: [
      "C envoie D à sa gateway R2. R2 constate que le LAN D est directement connecté et transmet localement.",
      "Pour Internet, C envoie à R2, R2 applique sa route par défaut vers R1, puis R1 envoie sur son lien public.",
      "Internet répond grâce à la route agrégée /26 vers R1. R1 transmet l’agrégat à R2, qui choisit finalement le LAN précis."
    ],
    packetTrace: "C -> R2 -> D\nC -> R2 -> R1 -> Internet\nInternet -> R1 grâce à 146.29.78.0/26\nR1 -> R2 grâce à 146.29.78.0/26\nR2 -> LAN C ou LAN D",
    verification: [
      "Tous les sous-réseaux sont-ils inclus dans .0-.63 ?",
      "Les deux LAN et le transit se chevauchent-ils ?",
      "Chaque hôte possède-t-il la gateway de son interface R2 locale ?",
      "R1 route-t-il l’agrégat vers R2 ?",
      "Internet route-t-il ce même agrégat vers l’interface publique de R1 ?"
    ]
  },
  "09": {
    title: "Raisonner avec plusieurs routes et plusieurs familles d’adresses",
    intro: [
      "Ce niveau rassemble presque tous les pièges précédents : LAN switché, deux routeurs, Internet, plusieurs réseaux distants et routes évaluées dans l’ordre.",
      "La bonne méthode consiste à résoudre d’abord chaque lien local, puis à construire la table de routage de l’intérieur vers l’extérieur."
    ],
    observations: [
      "A, B et R1 partagent un switch : ils forment un même LAN.",
      "R1-R2 est un transit distinct.",
      "C et D sont sur deux interfaces différentes de R2, donc sur deux LAN distincts.",
      "Internet exige des routes de retour explicites et n’accepte pas de route par défaut.",
      "La gateway de D est fixe : son réseau doit être construit autour de cette valeur."
    ],
    calculations: [
      {
        title: "Construire le LAN A-B-R1",
        body: [
          "Utilise la famille 42.5.4.x révélée par les valeurs générées.",
          "Un /25 permet de placer A, B et R1 dans 42.5.4.0/25, avec R1 comme gateway locale."
        ],
        code: "R1 LAN : 42.5.4.1/25\nA : 42.5.4.2/25\nB : 42.5.4.42/25\nA/B default via 42.5.4.1"
      },
      {
        title: "Construire le transit R1-R2",
        body: [
          "Avec R1 en 192.168.1.2, le bloc /30 naturel est 192.168.1.0/30.",
          "R2 utilise l’autre adresse disponible, 192.168.1.1."
        ],
        code: "192.168.1.0 réseau\n192.168.1.1 R2\n192.168.1.2 R1\n192.168.1.3 broadcast"
      },
      {
        title: "Construire les LAN C et D",
        body: [
          "C peut utiliser 76.3.4.0/24 avec R2 comme gateway.",
          "Pour D, utilise le réseau 113.187.64.0/18 : la gateway imposée 113.187.77.249 appartient à ce bloc, donc D peut rester en 113.187.77.250/18."
        ],
        code: "LAN C : 76.3.4.0/24, R2=.1, C=.2\nLAN D : 113.187.64.0/18, R2=113.187.77.249, D=113.187.77.250"
      },
      {
        title: "Ordonner les routes sur R1",
        body: [
          "Les routes spécifiques vers C et D doivent être placées avant la route par défaut vers Internet.",
          "Sinon une route plus large peut capturer le trafic avant la bonne route, car le moteur utilise la première correspondance."
        ],
        code: "R1 : réseau C via 192.168.1.1\nR1 : réseau D via 192.168.1.1\nR1 : default via 163.172.250.1"
      },
      {
        title: "Construire les retours Internet",
        body: [
          "Internet doit connaître le LAN A-B, le LAN C et le LAN D.",
          "Chaque route utilise l’interface publique de R1, 163.172.250.12, comme next hop."
        ],
        code: "Internet -> LAN A-B via 163.172.250.12\nInternet -> LAN C via 163.172.250.12\nInternet -> LAN D via 163.172.250.12"
      }
    ],
    packet: [
      "Pour A vers D, A remet à R1. R1 choisit la route spécifique vers le LAN D, transmet à R2, puis R2 livre sur son interface locale.",
      "Pour C vers Internet, C remet à R2, R2 utilise sa route par défaut vers R1 et R1 utilise sa route Internet.",
      "Le retour Internet suit une route explicite vers le réseau concerné, puis R1 et éventuellement R2 distribuent jusqu’à l’hôte."
    ],
    packetTrace: "A -> R1 -> route spécifique D -> R2 -> D\nC -> R2 -> default R1 -> Internet\nInternet -> route retour C -> R1 -> R2 -> C",
    verification: [
      "Le LAN switché possède-t-il un masque commun ?",
      "Le transit R1-R2 est-il un bloc distinct et valide ?",
      "C et D sont-ils sur deux réseaux différents ?",
      "La gateway fixe de D est-elle respectée ?",
      "Les routes spécifiques précèdent-elles la route par défaut ?",
      "Internet possède-t-il une route de retour pour chaque réseau attendu ?"
    ]
  },
  "10": {
    title: "Construire un plan hiérarchique complet et résumable",
    intro: [
      "Le dernier niveau reprend la même architecture générale que le niveau 9, mais les adresses fixes suggèrent un plan plus élégant : tous les réseaux internes peuvent être rangés dans 130.137.107.0/24.",
      "L’objectif n’est pas seulement de faire communiquer les machines. Il faut créer des sous-réseaux distincts que R1 et Internet peuvent résumer proprement."
    ],
    observations: [
      "H1, H2 et R1 partagent un switch.",
      "H4 impose le bloc 130.137.107.128/26 grâce à son IP .131 et sa gateway fixe .129.",
      "R1-R2 peut utiliser les adresses fixes .254 et .253 dans le bloc .252/30.",
      "H3 doit recevoir un réseau public inclus dans le /24, pas conserver son 192.168.x.x initial.",
      "Internet possède une route trop petite en /31 qu’il faut remplacer par l’agrégat interne."
    ],
    calculations: [
      {
        title: "Réserver le LAN principal en /25",
        body: [
          "130.137.107.0/25 couvre .0-.127. R1 occupe .1 et H1 possède déjà .2.",
          "H2 peut prendre n’importe quelle autre adresse de .3 à .126 avec /25 et utiliser .1 comme gateway."
        ],
        code: "LAN principal : 130.137.107.0/25\nR1=.1, H1=.2, H2=.3\nBroadcast=.127"
      },
      {
        title: "Réserver le LAN H4 en /26",
        body: [
          "130.137.107.128/26 couvre .128-.191.",
          "La gateway fixe .129 appartient à ce bloc et doit être attribuée à l’interface R2. H4=.131 est déjà valide."
        ],
        code: "LAN H4 : 130.137.107.128/26\nR2=.129\nH4=.131\nBroadcast=.191"
      },
      {
        title: "Réserver le LAN H3 en /27",
        body: [
          "130.137.107.192/27 couvre .192-.223 et ne chevauche pas les deux réseaux précédents.",
          "Attribue par exemple .193 à R2 et .194 à H3. H3 utilise .193 comme gateway."
        ],
        code: "LAN H3 : 130.137.107.192/27\nR2=.193\nH3=.194\nBroadcast=.223"
      },
      {
        title: "Placer le transit dans le dernier /30",
        body: [
          "130.137.107.252/30 couvre .252-.255. Les deux adresses utilisables sont .253 et .254.",
          "Elles correspondent précisément aux valeurs fixes de R2 et R1."
        ],
        code: "Transit : 130.137.107.252/30\nR2=.253\nR1=.254"
      },
      {
        title: "Écrire les routes hiérarchiques",
        body: [
          "R1 possède déjà une route vers 130.137.107.128/26 via R2. Ajoute une route vers 130.137.107.192/27 via le même next hop.",
          "R2 utilise R1 comme route par défaut. Internet peut annoncer une seule route 130.137.107.0/24 vers l’interface publique de R1."
        ],
        code: "R1 -> 130.137.107.128/26 via 130.137.107.253\nR1 -> 130.137.107.192/27 via 130.137.107.253\nR2 -> default via 130.137.107.254\nInternet -> 130.137.107.0/24 via 163.172.250.12"
      }
    ],
    packet: [
      "H2 vers H4 : H2 remet à R1 .1. R1 choisit la route /26 via R2 .253. R2 livre directement sur le LAN H4.",
      "H3 vers Internet : H3 remet à R2 .193. R2 utilise sa route par défaut vers R1 .254. R1 sort vers Internet.",
      "Internet répond avec l’agrégat 130.137.107.0/24. R1 reçoit le paquet puis choisit la route locale ou spécifique la plus adaptée."
    ],
    packetTrace: "H2 -> R1 -> route 130.137.107.128/26 -> R2 -> H4\nH3 -> R2 -> default R1 -> Internet\nInternet -> 130.137.107.0/24 -> R1\nR1 -> /25 local, /26 via R2 ou /27 via R2",
    verification: [
      "Les quatre sous-réseaux occupent-ils des intervalles distincts ?",
      "Tous sont-ils inclus dans 130.137.107.0/24 ?",
      "H2 utilise-t-il R1 comme gateway ?",
      "H3 et H4 utilisent-ils chacun l’interface R2 de leur propre LAN ?",
      "R1 possède-t-il les routes spécifiques vers les LAN derrière R2 ?",
      "R2 utilise-t-il R1 comme route par défaut ?",
      "Internet annonce-t-il l’agrégat /24 vers l’interface publique de R1 ?"
    ]
  }
};
