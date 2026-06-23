window.NET_PRACTICE_CONCRETE = {
  "01": {
    screen: [
      "Deux petits réseaux indépendants, chacun composé de deux PC reliés par un switch.",
      "Certaines IP et certains masques sont déjà imposés. Il faut compléter les cases libres sans créer de doublon."
    ],
    goal: "Vérifier que tu sais placer deux interfaces dans le même sous-réseau.",
    networks: ["A ↔ B = premier réseau local", "C ↔ D = second réseau local"],
    rules: [
      "Un switch relie des machines d’un même réseau ; aucune gateway n’est nécessaire ici.",
      "Les deux IP d’une paire doivent produire la même adresse réseau avec le même masque.",
      "Chaque interface reçoit une IP hôte différente."
    ],
    deductions: [
      {
        look: "PC B vaut 104.97.23.12/24.",
        meaning: "Le /24 conserve les trois premiers octets pour le réseau.",
        deduction: "Le réseau est 104.97.23.0/24 et les hôtes vont de .1 à .254.",
        value: "PC A = 104.97.23.42/24.",
        why: ".42 est libre, n’est ni le réseau .0 ni le broadcast .255, et reste dans le même /24."
      },
      {
        look: "PC C vaut 211.191.37.75/16.",
        meaning: "Le /16 conserve seulement 211.191 pour identifier le réseau.",
        deduction: "Toute adresse 211.191.x.y valide appartient au même /16.",
        value: "PC D = 211.191.80.42/16.",
        why: "L’adresse est différente de C et appartient au réseau 211.191.0.0/16."
      }
    ],
    beginnerFocus: [
      {
        title: "Pourquoi /24 entre A1 et B1 ?",
        intro: "Le masque doit placer A et B dans le même quartier réseau, puisqu’ils sont reliés directement.",
        steps: [
          "Un /24 conserve les trois premiers nombres pour identifier le réseau.",
          "104.97.23.42/24 et 104.97.23.12/24 donnent tous les deux le réseau 104.97.23.0/24.",
          "La plage va de .0 à .255. .0 est le réseau, .255 le broadcast, et .1 à .254 sont utilisables.",
          "Aucune gateway n’est nécessaire : le paquet reste sur ce câble."
        ],
        result: "A1 : 104.97.23.42/24\nB1 : 104.97.23.12/24\nRéseau commun : 104.97.23.0/24"
      },
      {
        title: "Pourquoi /16 entre C1 et D1 ?",
        intro: "Ici, seuls les deux premiers nombres définissent le quartier.",
        steps: [
          "Avec /16, le réseau est 211.191.0.0/16.",
          "Les troisième et quatrième nombres servent à distinguer les machines.",
          "211.191.37.75 et 211.191.80.42 sont donc voisines malgré leurs deux derniers nombres différents."
        ],
        result: "C1 : 211.191.37.75/16\nD1 : 211.191.80.42/16\nRéseau commun : 211.191.0.0/16"
      }
    ],
    solution: "A 104.97.23.42/24 <-> B 104.97.23.12/24\nC 211.191.37.75/16 <-> D 211.191.80.42/16",
    packet: [
      "A compare l’IP de B avec son /24 et constate que B est local.",
      "A envoie la trame au switch, qui la transmet à B.",
      "Le retour suit exactement le même principe."
    ],
    traps: ["Donner la même IP aux deux PC.", "Utiliser .0 ou .255 dans le /24.", "Ajouter une gateway alors qu’aucun routeur n’existe."]
  },
  "02": {
    screen: [
      "Deux liaisons directes entre PC, sans switch et sans routeur.",
      "Le premier lien impose un /27 ; le second peut être organisé en petit réseau point à point."
    ],
    goal: "Savoir calculer les limites d’un bloc et choisir une IP voisine valide.",
    networks: ["A ↔ B = réseau /27", "C ↔ D = petit réseau point à point /30"],
    rules: ["Avec /27, le pas vaut 32.", "Avec /30, chaque bloc contient quatre adresses et seulement deux hôtes utilisables."],
    deductions: [
      {
        look: "PC B vaut 192.168.84.222/27.",
        meaning: "Le masque /27 découpe le dernier octet par blocs de 32.",
        deduction: "222 tombe dans le bloc 192-223 : réseau .192, hôtes .193-.222, broadcast .223.",
        value: "PC A = 192.168.84.193/27.",
        why: ".193 est la première adresse hôte du même bloc et .222 est déjà utilisée."
      },
      {
        look: "La seconde liaison ne relie que deux interfaces.",
        meaning: "Un /30 fournit exactement deux adresses hôtes.",
        deduction: "Le bloc 10.10.10.0/30 contient réseau .0, hôtes .1 et .2, broadcast .3.",
        value: "PC C = 10.10.10.1/30 ; PC D = 10.10.10.2/30.",
        why: "Les deux seules adresses utilisables sont placées sur les deux extrémités du câble."
      }
    ],
    beginnerFocus: [
      {
        title: "Pourquoi /27 pour A1 et B1 ?",
        intro: "Le /27 découpe le dernier nombre en blocs de 32 adresses.",
        steps: [
          "Les blocs commencent à 0, 32, 64, 96, 128, 160, 192 et 224.",
          "L’adresse .222 tombe dans le bloc .192-.223.",
          ".192 est le réseau et .223 le broadcast.",
          "A1 et B1 doivent donc utiliser deux adresses différentes entre .193 et .222."
        ],
        result: "Réseau : 192.168.84.192/27\nA1 : 192.168.84.193\nB1 : 192.168.84.222"
      },
      {
        title: "Pourquoi /30 pour le lien C1-D1 ?",
        intro: "Ce câble ne relie que deux interfaces. Un /30 fournit exactement deux places utilisables.",
        steps: [
          "Un /30 contient quatre adresses.",
          "Dans 10.10.10.0/30, .0 est le réseau et .3 le broadcast.",
          "Il reste exactement .1 et .2 pour C1 et D1.",
          "Un réseau plus grand fonctionnerait, mais réserverait inutilement davantage d’adresses."
        ],
        result: "Réseau : 10.10.10.0/30\nC1 : 10.10.10.1\nD1 : 10.10.10.2"
      }
    ],
    solution: "A 192.168.84.193/27 <-> B 192.168.84.222/27\nC 10.10.10.1/30 <-> D 10.10.10.2/30",
    packet: ["Chaque PC reconnaît l’autre comme local.", "Le paquet traverse directement le câble, sans consulter de routeur."],
    traps: ["Croire qu’un /27 commence toujours à .0.", "Utiliser .192 ou .223 comme IP hôte.", "Placer les deux côtés d’un lien dans deux /30 différents."]
  },
  "03": {
    screen: ["Trois PC partagent le même switch.", "Une adresse en /25 sert de point de départ pour compléter les autres."],
    goal: "Comprendre qu’un switch forme un seul réseau partagé.",
    networks: ["A ↔ switch ↔ B ↔ C = un seul réseau local partagé"],
    rules: ["Toutes les interfaces reliées au switch doivent appartenir au même sous-réseau.", "Un /25 crée les blocs 0-127 et 128-255."],
    deductions: [
      {
        look: "PC A vaut 104.198.73.125/25.",
        meaning: ".125 appartient au premier bloc /25.",
        deduction: "Réseau .0, hôtes .1-.126, broadcast .127.",
        value: "PC B = 104.198.73.42/25 ; PC C = 104.198.73.126/25.",
        why: "Les deux adresses sont libres et restent entre .1 et .126."
      }
    ],
    beginnerFocus: [
      {
        title: "Pourquoi les trois machines utilisent /25 ?",
        intro: "Le switch forme une rue commune. Toutes les machines branchées dessus doivent voir le même quartier.",
        steps: [
          "Un /25 crée deux blocs : .0-.127 et .128-.255.",
          "A1 vaut .125 : il se trouve dans le premier bloc.",
          "B1 et C1 doivent donc rester entre .1 et .126.",
          "Le switch ne change pas de réseau et n’a pas besoin d’une IP pour transmettre les trames."
        ],
        result: "Réseau commun : 104.198.73.0/25\nA1 : .125\nB1 : .42\nC1 : .126"
      }
    ],
    solution: "A 104.198.73.125/25\nB 104.198.73.42/25\nC 104.198.73.126/25",
    packet: ["A identifie B et C comme locaux.", "Le switch transmet les trames entre les trois ports sans route ni gateway."],
    traps: ["Placer un PC en .128/25 : il basculerait dans le réseau suivant.", "Employer .127, qui est le broadcast.", "Donner des masques différents."]
  },
  "04": {
    screen: ["Un PC doit atteindre un autre réseau en passant par un routeur.", "L’interface locale du routeur et le PC doivent d’abord pouvoir se parler directement."],
    goal: "Choisir une gateway locale et distinguer destination finale et prochain saut.",
    networks: ["A ↔ switch ↔ interface locale du routeur = réseau local", "Autres interfaces du routeur = autres réseaux"],
    rules: ["La gateway doit être dans le même sous-réseau que le PC.", "Le next hop est l’interface voisine du routeur, jamais le PC distant."],
    deductions: [
      {
        look: "PC A vaut 72.44.18.132/28.",
        meaning: "Le /28 avance par blocs de 16.",
        deduction: ".132 appartient au bloc .128-.143 : hôtes .129-.142.",
        value: "Interface R1 = 72.44.18.129/28.",
        why: ".129 est une adresse hôte libre du même réseau que A."
      },
      {
        look: "A doit envoyer un paquet hors de 72.44.18.128/28.",
        meaning: "Une destination non locale doit être remise à un routeur.",
        deduction: "La route par défaut de A doit pointer vers son voisin R1.",
        value: "A : 0.0.0.0/0 via 72.44.18.129.",
        why: "A peut joindre .129 directement et lui confier toutes les destinations inconnues."
      }
    ],
    beginnerFocus: [
      {
        title: "Pourquoi /28 autour de l’adresse .132 ?",
        intro: "Le /28 crée des quartiers de 16 adresses. Il permet d’isoler proprement ce LAN des autres interfaces du routeur.",
        steps: [
          "Les blocs /28 commencent à .0, .16, .32, .48, etc.",
          ".132 tombe entre .128 et .143.",
          ".128 est le réseau et .143 le broadcast.",
          "A1, B1 et R1 doivent donc utiliser des adresses différentes entre .129 et .142.",
          "Un masque beaucoup plus large risquerait de faire chevaucher ce LAN avec un autre réseau du même routeur."
        ],
        result: "Réseau : 72.44.18.128/28\nR1 : 72.44.18.129\nB1 : 72.44.18.130\nA1 : 72.44.18.132"
      }
    ],
    solution: "A = 72.44.18.132/28\nR1 = 72.44.18.129/28\nRoute A = 0.0.0.0/0 via 72.44.18.129",
    packet: ["A voit que la destination n’est pas locale.", "A envoie au routeur .129.", "Le routeur poursuit selon sa propre table de routage."],
    traps: ["Mettre comme gateway une IP du réseau distant.", "Utiliser .128 ou .143.", "Confondre le réseau de destination et la gateway."]
  },
  "05": {
    screen: ["Deux LAN sont reliés par un même routeur possédant une interface dans chaque LAN.", "Chaque PC doit connaître sa sortie locale."],
    goal: "Faire communiquer deux réseaux directement connectés au même routeur.",
    networks: ["A ↔ R1 = LAN de A", "B ↔ R2 = LAN de B"],
    rules: ["Le routeur connaît automatiquement les réseaux de ses interfaces.", "Chaque PC utilise l’interface du routeur située dans son propre LAN."],
    deductions: [
      {
        look: "R1 vaut 42.50.60.126/25.",
        meaning: "R1 appartient au réseau 42.50.60.0/25.",
        deduction: "A doit être entre .1 et .125, hors adresses déjà prises.",
        value: "A = 42.50.60.10/25 ; gateway = 42.50.60.126.",
        why: "A et R1 sont voisins dans le même LAN."
      },
      {
        look: "R2 vaut 150.70.130.254/18.",
        meaning: "Avec /18, le troisième octet avance par 64 ; 130 tombe dans 128-191.",
        deduction: "Le réseau est 150.70.128.0/18.",
        value: "B = 150.70.130.10/18 ; gateway = 150.70.130.254.",
        why: "B partage le /18 de R2 et peut lui remettre les réponses."
      }
    ],
    beginnerFocus: [
      {
        title: "Pourquoi A1 utilise /25 et B1 utilise /18 ?",
        intro: "Chaque machine doit reprendre le quartier de l’interface du routeur placée devant elle. Les deux côtés du routeur sont deux réseaux différents.",
        steps: [
          "R1 vaut 42.50.60.126/25. A1 doit donc être dans 42.50.60.0-.127.",
          "R2 vaut 150.70.130.254/18. Avec /18, le troisième nombre avance par blocs de 64.",
          "130 tombe dans le bloc 128-191 : le réseau de B est 150.70.128.0/18.",
          "A utilise R1 comme gateway. B utilise R2. Une machine ne choisit jamais l’interface située de l’autre côté du routeur."
        ],
        result: "LAN A : 42.50.60.0/25\nA1 .10 -> R1 .126\n\nLAN B : 150.70.128.0/18\nB1 150.70.130.10 -> R2 150.70.130.254"
      }
    ],
    solution: "A 42.50.60.10/25 -> gateway 42.50.60.126\nB 150.70.130.10/18 -> gateway 150.70.130.254",
    packet: ["A remet le paquet à R1.", "Le routeur reconnaît le réseau de B comme directement connecté via R2.", "B répond à R2, puis le routeur livre la réponse dans le LAN de A."],
    traps: ["Utiliser l’interface distante du routeur comme gateway.", "Oublier le retour de B.", "Calculer le /18 comme un /24."]
  },
  "06": {
    screen: ["Un serveur dans un LAN, un routeur à deux interfaces et Internet.", "Il faut construire l’aller vers Internet et surtout la route permettant à la réponse de revenir."],
    goal: "Comprendre la route par défaut et la route de retour.",
    networks: ["A ↔ switch ↔ R1 = réseau local", "R2 ↔ Internet = réseau externe"],
    rules: ["Chaque gateway est un voisin local.", "Internet doit connaître le réseau situé derrière le routeur.", "Une route par défaut couvre toute destination non connue."],
    deductions: [
      {
        look: "A vaut 28.141.155.227/25.",
        meaning: "Le /25 sépare le dernier octet en 0-127 et 128-255.",
        deduction: "A appartient à 28.141.155.128/25 ; les hôtes vont de .129 à .254.",
        value: "R1 = 28.141.155.254/25.",
        why: ".254 est libre et dans le même réseau que A."
      },
      {
        look: "A veut joindre une destination extérieure.",
        meaning: "Cette destination n’appartient pas à son /25.",
        deduction: "A doit utiliser le routeur local comme sortie.",
        value: "A : 0.0.0.0/0 via 28.141.155.254.",
        why: "Le routeur .254 est directement joignable depuis A."
      },
      {
        look: "Le routeur est relié à Internet par 163.172.250.12/28 ; le voisin Internet vaut 163.172.250.1.",
        meaning: "Les deux interfaces partagent le réseau public 163.172.250.0/28.",
        deduction: "Le routeur peut confier les destinations inconnues au voisin Internet.",
        value: "Routeur : 0.0.0.0/0 via 163.172.250.1.",
        why: "163.172.250.1 est le prochain saut local sur le lien WAN."
      },
      {
        look: "Une réponse Internet vise 28.141.155.227.",
        meaning: "Internet doit savoir quel routeur dessert 28.141.155.128/25.",
        deduction: "Le réseau du LAN est joignable via l’interface publique du routeur.",
        value: "Internet : 28.141.155.128/25 via 163.172.250.12.",
        why: "163.172.250.12 est le voisin Internet qui connaît directement le LAN."
      }
    ],
    beginnerFocus: [
      {
        title: "Pourquoi /25 entre A1 et R1 ?",
        intro: "A1 et R1 sont sur le même LAN. Leur mask doit placer .227 et .254 dans le même quartier.",
        steps: [
          "Un /25 crée les blocs .0-.127 et .128-.255.",
          ".227 et .254 appartiennent tous les deux au second bloc.",
          ".128 est le réseau et .255 le broadcast.",
          "A1 .227 et R1 .254 sont donc deux adresses hôtes valides du réseau .128/25."
        ],
        result: "LAN : 28.141.155.128/25\nA1 : 28.141.155.227\nR1 : 28.141.155.254"
      },
      {
        title: "Pourquoi /28 entre R2 et Internet ?",
        intro: "Le lien public fourni par l’exercice appartient déjà au réseau 163.172.250.0/28.",
        steps: [
          "Un /28 contient 16 adresses : .0 à .15.",
          ".0 est le réseau et .15 le broadcast.",
          "Internet I1 = .1 et le routeur R2 = .12 sont deux hôtes valides de ce même lien.",
          "Le routeur peut donc remettre directement ses paquets au voisin Internet .1."
        ],
        result: "Lien public : 163.172.250.0/28\nInternet I1 : 163.172.250.1\nRouteur R2 : 163.172.250.12"
      }
    ],
    solution: "A1\nIP : 28.141.155.227\nMask : 255.255.255.128 (/25)\n\nR1\nIP : 28.141.155.254\nMask : 255.255.255.128 (/25)\n\nRoute de A\n0.0.0.0/0 => 28.141.155.254\n\nR2\nIP : 163.172.250.12\nMask : 255.255.255.240 (/28)\n\nRoute du routeur\n0.0.0.0/0 => 163.172.250.1\n\nRoute d’Internet\n28.141.155.128/25 => 163.172.250.12",
    packet: ["A remet le paquet à 28.141.155.254.", "Le routeur le remet au voisin Internet 163.172.250.1.", "Internet traite la destination extérieure.", "La réponse suit la route 28.141.155.128/25 via 163.172.250.12.", "Le routeur livre enfin le paquet à A sur son LAN."],
    traps: ["Oublier la route de retour.", "Mettre la destination Internet comme gateway.", "Donner à Internet une route vers une seule IP au lieu du /25 complet."]
  },
  "07": {
    screen: ["Deux PC sont séparés par deux routeurs.", "Chaque câble constitue un sous-réseau distinct : LAN gauche, transit entre routeurs, LAN droit."],
    goal: "Découper proprement trois liens et installer les routes de bout en bout.",
    networks: ["A ↔ R1 = LAN gauche", "R1 ↔ R2 = réseau de transit", "R2 ↔ C = LAN droit"],
    rules: ["Deux interfaces reliées par un câble doivent partager un réseau.", "Deux câbles différents ne doivent pas partager le même sous-réseau.", "Un /30 est pratique pour un lien à deux interfaces."],
    deductions: [
      {
        look: "R1 côté A vaut 96.198.14.1.",
        meaning: "On cherche un petit réseau /30 contenant 96.198.14.1.",
        deduction: "Le bloc 96.198.14.0 à 96.198.14.3 contient les hôtes .1 et .2.",
        value: "R1 = 96.198.14.1/30 ; A = 96.198.14.2/30.",
        why: "Les deux interfaces occupent les deux hôtes du lien."
      },
      {
        look: "Le transit impose une extrémité .254.",
        meaning: ".254 appartient au bloc /30 .252-.255.",
        deduction: "Les hôtes disponibles sont .253 et .254.",
        value: "R1 = 96.198.14.254/30 ; R2 = 96.198.14.253/30.",
        why: "Les routeurs deviennent voisins directs sur le transit."
      },
      {
        look: "Le LAN droit doit rester distinct.",
        meaning: "Il faut choisir un autre bloc.",
        deduction: "Le bloc 96.198.15.0/30 est indépendant des deux précédents.",
        value: "R2 = 96.198.15.1/30 ; C = 96.198.15.2/30.",
        why: "R2 et C partagent ce troisième réseau sans chevauchement."
      }
    ],
    beginnerFocus: [
      {
        title: "Pourquoi utiliser /30 sur chacun des trois câbles ?",
        intro: "Chaque câble ne relie que deux interfaces. Un petit quartier de deux places utilisables suffit.",
        steps: [
          "Un /30 contient quatre adresses : réseau, deux hôtes, broadcast.",
          "Le câble A1-R11 utilise .0-.3 : .1 et .2 sont les deux hôtes.",
          "Le câble R12-R21 utilise .252-.255 : .253 et .254 sont les deux hôtes.",
          "Le câble R22-C1 utilise un autre bloc, 96.198.15.0-.3 : .1 et .2 sont utilisables.",
          "Les trois câbles ont des blocs différents, donc les routeurs savent par quelle interface sortir."
        ],
        result: "A1-R11 : 96.198.14.0/30\nR12-R21 : 96.198.14.252/30\nR22-C1 : 96.198.15.0/30"
      }
    ],
    solution: "A 96.198.14.2/30 <-> R1 96.198.14.1/30\nR1 96.198.14.254/30 <-> R2 96.198.14.253/30\nR2 96.198.15.1/30 <-> C 96.198.15.2/30\nA default via 96.198.14.1\nR1 route 96.198.15.0/30 via 96.198.14.253\nR2 route 96.198.14.0/30 via 96.198.14.254\nC default via 96.198.15.1",
    packet: ["A -> R1 par le LAN gauche.", "R1 -> R2 par le transit.", "R2 -> C par le LAN droit.", "Le retour utilise les routes symétriques vers A."],
    traps: ["Réutiliser le même /30 sur deux liens.", "Oublier une route sur l’un des routeurs.", "Utiliser .252 ou .255 sur le transit."]
  },
  "08": {
    screen: ["Deux LAN se trouvent derrière R2, puis R1 relie l’ensemble à Internet.", "Internet fournit une route résumée couvrant une plage de 64 adresses."],
    goal: "Découper une plage en sous-réseaux puis annoncer l’ensemble avec une route agrégée.",
    networks: ["D1 ↔ R23 = premier LAN /28", "C1 ↔ R22 = second LAN /28", "R21 ↔ R13 = transit /30", "R12 ↔ Internet = réseau externe"],
    rules: ["Un /26 couvre 64 adresses.", "Les sous-réseaux internes doivent rester à l’intérieur de cette plage.", "R1 peut annoncer le /26 entier au lieu d’une route par LAN."],
    deductions: [
      {
        look: "Internet annonce 146.29.78.0/26.",
        meaning: "La plage disponible va de 146.29.78.0 à 146.29.78.63.",
        deduction: "On peut y placer deux LAN /28 et un transit /30 sans chevauchement.",
        value: "LAN D = .0/28 ; LAN C = .16/28 ; transit = .60/30.",
        why: "Ces blocs occupent .0-.15, .16-.31 et .60-.63, tous inclus dans le /26."
      },
      {
        look: "C et D ont chacun besoin d’une gateway locale.",
        meaning: "R2 doit posséder une interface dans chaque LAN.",
        deduction: "On choisit les premières adresses hôtes pour R2.",
        value: "R23-D1 : .1 et .2 ; R22-C1 : .17 et .18.",
        why: "Chaque PC partage son /28 avec l’interface correspondante de R2."
      },
      {
        look: "R1 et R2 doivent être voisins sur le transit.",
        meaning: "Le /30 .60-.63 fournit .61 et .62.",
        deduction: "R2 utilise .61 et R1 .62.",
        value: "R1 : 146.29.78.0/26 via 146.29.78.61 ; R2 : default via 146.29.78.62.",
        why: "R1 envoie tout le bloc interne à R2, et R2 envoie l’extérieur à R1."
      }
    ],
    beginnerFocus: [
      {
        title: "Pourquoi R22 = .17 et C1 = .18, et pas .3 et .4 ?",
        intro:
          "Parce que chaque câble qui part du routeur doit représenter un quartier réseau différent. On ne choisit pas les nombres simplement parce qu’ils se suivent.",
        steps: [
          "Avec /28, chaque quartier contient 16 adresses.",
          "Le premier quartier va de 146.29.78.0 à 146.29.78.15. .0 est le réseau, .15 est le broadcast, et .1 à .14 sont utilisables.",
          "R23 = 146.29.78.1 et D1 = 146.29.78.2 utilisent déjà ce premier quartier.",
          ".3 et .4 appartiennent encore au même quartier .0-.15. Les utiliser pour R22 et C1 mélangerait deux câbles différents dans le même réseau.",
          "Le quartier /28 suivant commence à 146.29.78.16 et finit à 146.29.78.31.",
          ".16 est l’adresse réseau et .31 le broadcast. Les premières IP utilisables sont donc .17 et .18.",
          "On place R22 en .17 et C1 en .18. Ce choix est facile à lire, mais .20 et .29 auraient aussi fonctionné s’ils étaient libres."
        ],
        result:
          "LAN domicile : 146.29.78.0/28\nR23 = 146.29.78.1\nD1 = 146.29.78.2\n\nLAN bureau : 146.29.78.16/28\nR22 = 146.29.78.17\nC1 = 146.29.78.18"
      },
      {
        title: "Pourquoi /30 entre R13 et R21 ?",
        intro:
          "Ce câble sert uniquement de passage entre deux routeurs. Il n’a besoin que de deux adresses, une à chaque extrémité.",
        steps: [
          "Un /30 contient quatre adresses.",
          "Le bloc choisi est 146.29.78.60 à 146.29.78.63.",
          ".60 est l’adresse réseau : elle nomme le quartier et ne peut pas être attribuée.",
          ".63 est le broadcast : elle ne peut pas être attribuée non plus.",
          "Il reste exactement .61 et .62 pour les deux interfaces du câble.",
          "R21 prend .61 et R13 prend .62. Elles peuvent donc se parler directement.",
          "Le /30 évite de gaspiller un bloc /28 de 16 adresses pour un câble qui ne relie que deux interfaces."
        ],
        result:
          "Transit : 146.29.78.60/30\nR21 : 146.29.78.61/30\nR13 : 146.29.78.62/30\nBroadcast : 146.29.78.63"
      }
    ],
    solution: "D1 146.29.78.2/28 -> R23 146.29.78.1\nC1 146.29.78.18/28 -> R22 146.29.78.17\nR21 146.29.78.61/30 <-> R13 146.29.78.62/30\nR1 : 146.29.78.0/26 via 146.29.78.61\nR2 : default via 146.29.78.62\nInternet : 146.29.78.0/26 via 163.228.250.12",
    packet: ["C vers D : C -> R2 -> D.", "C vers Internet : C -> R2 -> R1 -> Internet.", "Retour : Internet -> R1 grâce au /26, puis R1 -> R2, puis R2 choisit le bon LAN."],
    traps: ["Créer un sous-réseau hors de .0-.63.", "Faire chevaucher les deux /28.", "Annoncer une gateway qui n’est pas voisine."]
  },
  "09": {
    screen: ["Plusieurs réseaux et plusieurs routeurs forment une topologie ramifiée.", "Certaines routes sont trop précises, inutiles ou pointent vers un mauvais voisin."],
    goal: "Lire une table de routage et vérifier chaque chemin, y compris le retour.",
    networks: ["A et B ↔ switch ↔ R1 = LAN partagé", "R1 ↔ R2 = transit", "R2 ↔ C et D = réseaux distants", "R1 ↔ Internet = réseau externe"],
    rules: ["Une route ne sert que si sa destination couvre l’IP recherchée.", "Le next hop doit être voisin.", "La route la plus spécifique gagne sur la route par défaut."],
    deductions: [
      {
        look: "A et B partagent le LAN 80.198.40.0/25.",
        meaning: "Ils communiquent localement jusqu’à ce qu’une destination sorte de ce /25.",
        deduction: "Le routeur du LAN devient leur gateway pour les autres réseaux.",
        value: "A = 80.198.40.10/25 ; B = 80.198.40.20/25 ; gateway = 80.198.40.126.",
        why: "Les trois interfaces sont dans le même réseau et les IP sont uniques."
      },
      {
        look: "Deux routeurs partagent 70.50.17.252/30.",
        meaning: "Les seules IP hôtes sont .253 et .254.",
        deduction: "Chaque routeur utilise une extrémité du transit.",
        value: "R1 = 70.50.17.253/30 ; R2 = 70.50.17.254/30.",
        why: "Ils peuvent se remettre directement les paquets."
      },
      {
        look: "Le LAN C est 70.50.18.0/24.",
        meaning: "R2 connaît ce LAN par son interface locale.",
        deduction: "R1 doit l’atteindre via R2, tandis que R2 doit connaître le retour vers A et B.",
        value: "R1 : 70.50.18.0/24 via 70.50.17.254 ; R2 : 80.198.40.0/25 via 70.50.17.253.",
        why: "Chaque route désigne le réseau distant et le routeur voisin qui y conduit."
      }
    ],
    beginnerFocus: [
      {
        title: "Pourquoi /30 entre R13 et R21 ?",
        intro: "Le transit relie uniquement R1 et R2. Deux adresses utilisables suffisent.",
        steps: [
          "Le bloc 70.50.17.252/30 contient .252, .253, .254 et .255.",
          ".252 est le réseau et .255 le broadcast.",
          ".253 et .254 sont les deux seules IP utilisables.",
          "R1 utilise .253 et R2 .254.",
          "Les LAN de A/B, C et D utilisent d’autres blocs et ne se mélangent pas avec ce transit."
        ],
        result: "Transit : 70.50.17.252/30\nR13 : 70.50.17.253\nR21 : 70.50.17.254"
      },
      {
        title: "Pourquoi /25 pour le LAN de A et B ?",
        intro: "A, B et l’interface R11 sont reliés par le même switch : ils doivent partager un seul quartier.",
        steps: [
          "Un /25 couvre 128 adresses, ici 80.198.40.0 à 80.198.40.127.",
          ".0 est le réseau et .127 le broadcast.",
          "A .10, B .20 et R11 .126 sont trois adresses utilisables du même bloc.",
          "A et B peuvent atteindre directement leur gateway .126."
        ],
        result: "LAN A/B : 80.198.40.0/25\nA1 : .10\nB1 : .20\nR11 : .126"
      }
    ],
    solution: "LAN A/B : 80.198.40.0/25, gateway 80.198.40.126\nTransit : R1 70.50.17.253/30 <-> R2 70.50.17.254/30\nLAN C : 70.50.18.0/24, gateway 70.50.18.254\nR1 route 70.50.18.0/24 via 70.50.17.254\nR2 route 80.198.40.0/25 via 70.50.17.253",
    packet: ["A remet le paquet à sa gateway.", "R1 applique la route vers 70.50.18.0/24 et remet à R2.", "R2 livre à C.", "C répond à R2, qui applique sa route de retour vers 80.198.40.0/25."],
    traps: ["Tester seulement l’aller.", "Laisser une route qui couvre une mauvaise plage.", "Confondre interface de sortie et destination finale."]
  },
  "10": {
    screen: ["La topologie complète combine plusieurs LAN, des transits, Internet et des routes statiques.", "C’est une synthèse : adressage, masques, gateways, agrégation et retour."],
    goal: "Construire un plan cohérent de bout en bout et le prouver par le trajet des paquets.",
    networks: ["H1 et H2 ↔ switch ↔ R1 = LAN principal", "R1 ↔ R2 = transit", "R2 ↔ H3 et H4 = LAN distants", "R1 ↔ Internet = réseau externe"],
    rules: ["Commencer par dessiner un sous-réseau par câble ou LAN.", "Configurer les interfaces avant les routes.", "Ajouter les routes du plus local vers le plus lointain.", "Toujours terminer par le chemin retour."],
    deductions: [
      {
        look: "Toutes les adresses internes doivent tenir dans 80.50.40.0/24.",
        meaning: "Le /24 peut être découpé en plusieurs quartiers de tailles différentes.",
        deduction: "On réserve .0/25 au LAN H1-H2, .128/26 à H4, .192/27 à H3 et .252/30 au transit.",
        value: "Chaque câble reçoit un bloc distinct, sans chevauchement.",
        why: "Les blocs sont assez grands pour leurs équipements et restent tous contenus dans le /24 annoncé à Internet."
      },
      {
        look: "Les routeurs ont besoin d’un lien de transit.",
        meaning: "Deux interfaces suffisent sur ce lien.",
        deduction: "Un /30 séparé est adapté.",
        value: "Transit 80.50.40.252/30 : R2 .253, R1 .254.",
        why: "Les adresses .253 et .254 sont les deux hôtes du bloc."
      },
      {
        look: "Internet doit pouvoir répondre aux deux LAN.",
        meaning: "Une route de retour doit couvrir les réseaux internes annoncés.",
        deduction: "On annonce l’agrégat utile vers l’interface publique du routeur de bord.",
        value: "Internet : 80.50.40.0/24 via l’IP publique de R1.",
        why: "Le /24 couvre les deux /26 internes et permet à R1 de distribuer ensuite le trafic."
      }
    ],
    beginnerFocus: [
      {
        title: "Pourquoi quatre masks différents dans le même niveau ?",
        intro: "Chaque câble a un nombre d’équipements différent. On choisit donc un quartier assez grand, mais sans le faire chevaucher avec le suivant.",
        steps: [
          "Le LAN H1-H2-R11 contient trois interfaces : 80.50.40.0/25 fournit largement assez de places.",
          "Le LAN H4-R23 utilise 80.50.40.128/26 : .128-.191.",
          "Le LAN H3-R22 utilise 80.50.40.192/27 : .192-.223.",
          "Le transit R13-R21 ne relie que deux interfaces : 80.50.40.252/30 suffit.",
          "Tous ces blocs sont différents et restent dans l’agrégat 80.50.40.0/24."
        ],
        result: "H1/H2/R11 : 80.50.40.0/25\nH4/R23 : 80.50.40.128/26\nH3/R22 : 80.50.40.192/27\nR1/R2 : 80.50.40.252/30"
      },
      {
        title: "Pourquoi .253 et .254 sur le transit /30 ?",
        intro: "Le dernier bloc /30 du /24 commence à .252.",
        steps: [
          "80.50.40.252/30 couvre .252 à .255.",
          ".252 est le réseau et .255 le broadcast.",
          ".253 et .254 sont les deux seules IP utilisables.",
          "R21 prend .253 et R13 .254.",
          "R2 utilise ensuite .254 comme prochain voisin pour sa route par défaut."
        ],
        result: "Transit : 80.50.40.252/30\nR21 : 80.50.40.253\nR13 : 80.50.40.254"
      }
    ],
    solution: "LAN H1/H2 : 80.50.40.0/25, R11 .1\nLAN H4 : 80.50.40.128/26, R23 .129, H41 .131\nLAN H3 : 80.50.40.192/27, R22 .193, H31 .194\nTransit : R21 .253/30 <-> R13 .254/30\nR2 default via 80.50.40.254\nR1 routes internes via 80.50.40.253\nR1 default via le voisin Internet\nInternet retour 80.50.40.0/24 via l’IP publique de R1",
    packet: ["A -> gateway R2.", "R2 -> R1 par le transit.", "R1 -> Internet par son lien public.", "Internet -> R1 grâce à la route de retour.", "R1 -> R2 grâce à la route interne.", "R2 -> A sur le LAN correspondant."],
    traps: ["Tout configurer au hasard sans plan d’adressage.", "Créer des sous-réseaux qui se chevauchent.", "Oublier une route sur un équipement intermédiaire.", "Valider sans raconter l’aller et le retour."]
  }
};
