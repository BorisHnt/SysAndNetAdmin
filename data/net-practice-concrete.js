window.NET_PRACTICE_CONCRETE = {
  "01": {
    screen: [
      "Deux petits réseaux indépendants, chacun composé de deux PC reliés par un switch.",
      "Certaines IP et certains masques sont déjà imposés. Il faut compléter les cases libres sans créer de doublon."
    ],
    goal: "Vérifier que tu sais placer deux interfaces dans le même sous-réseau.",
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
    solution: "A 192.168.84.193/27 <-> B 192.168.84.222/27\nC 10.10.10.1/30 <-> D 10.10.10.2/30",
    packet: ["Chaque PC reconnaît l’autre comme local.", "Le paquet traverse directement le câble, sans consulter de routeur."],
    traps: ["Croire qu’un /27 commence toujours à .0.", "Utiliser .192 ou .223 comme IP hôte.", "Placer les deux côtés d’un lien dans deux /30 différents."]
  },
  "03": {
    screen: ["Trois PC partagent le même switch.", "Une adresse en /25 sert de point de départ pour compléter les autres."],
    goal: "Comprendre qu’un switch forme un seul réseau partagé.",
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
    solution: "A 104.198.73.125/25\nB 104.198.73.42/25\nC 104.198.73.126/25",
    packet: ["A identifie B et C comme locaux.", "Le switch transmet les trames entre les trois ports sans route ni gateway."],
    traps: ["Placer un PC en .128/25 : il basculerait dans le réseau suivant.", "Employer .127, qui est le broadcast.", "Donner des masques différents."]
  },
  "04": {
    screen: ["Un PC doit atteindre un autre réseau en passant par un routeur.", "L’interface locale du routeur et le PC doivent d’abord pouvoir se parler directement."],
    goal: "Choisir une gateway locale et distinguer destination finale et prochain saut.",
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
    solution: "A = 72.44.18.132/28\nR1 = 72.44.18.129/28\nRoute A = 0.0.0.0/0 via 72.44.18.129",
    packet: ["A voit que la destination n’est pas locale.", "A envoie au routeur .129.", "Le routeur poursuit selon sa propre table de routage."],
    traps: ["Mettre comme gateway une IP du réseau distant.", "Utiliser .128 ou .143.", "Confondre le réseau de destination et la gateway."]
  },
  "05": {
    screen: ["Deux LAN sont reliés par un même routeur possédant une interface dans chaque LAN.", "Chaque PC doit connaître sa sortie locale."],
    goal: "Faire communiquer deux réseaux directement connectés au même routeur.",
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
    solution: "A 42.50.60.10/25 -> gateway 42.50.60.126\nB 150.70.130.10/18 -> gateway 150.70.130.254",
    packet: ["A remet le paquet à R1.", "Le routeur reconnaît le réseau de B comme directement connecté via R2.", "B répond à R2, puis le routeur livre la réponse dans le LAN de A."],
    traps: ["Utiliser l’interface distante du routeur comme gateway.", "Oublier le retour de B.", "Calculer le /18 comme un /24."]
  },
  "06": {
    screen: ["Un serveur dans un LAN, un routeur à deux interfaces et Internet.", "Il faut construire l’aller vers Internet et surtout la route permettant à la réponse de revenir."],
    goal: "Comprendre la route par défaut et la route de retour.",
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
    solution: "A1\nIP : 28.141.155.227\nMask : 255.255.255.128 (/25)\n\nR1\nIP : 28.141.155.254\nMask : 255.255.255.128 (/25)\n\nRoute de A\n0.0.0.0/0 => 28.141.155.254\n\nR2\nIP : 163.172.250.12\nMask : 255.255.255.240 (/28)\n\nRoute du routeur\n0.0.0.0/0 => 163.172.250.1\n\nRoute d’Internet\n28.141.155.128/25 => 163.172.250.12",
    packet: ["A remet le paquet à 28.141.155.254.", "Le routeur le remet au voisin Internet 163.172.250.1.", "Internet traite la destination extérieure.", "La réponse suit la route 28.141.155.128/25 via 163.172.250.12.", "Le routeur livre enfin le paquet à A sur son LAN."],
    traps: ["Oublier la route de retour.", "Mettre la destination Internet comme gateway.", "Donner à Internet une route vers une seule IP au lieu du /25 complet."]
  },
  "07": {
    screen: ["Deux PC sont séparés par deux routeurs.", "Chaque câble constitue un sous-réseau distinct : LAN gauche, transit entre routeurs, LAN droit."],
    goal: "Découper proprement trois liens et installer les routes de bout en bout.",
    rules: ["Deux interfaces reliées par un câble doivent partager un réseau.", "Deux câbles différents ne doivent pas partager le même sous-réseau.", "Un /30 est pratique pour un lien à deux interfaces."],
    deductions: [
      {
        look: "R1 côté A se termine par .1.",
        meaning: "On peut construire un /30 contenant .1.",
        deduction: "Le bloc .0-.3 contient les hôtes .1 et .2.",
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
    solution: "A 96.198.14.2/30 <-> R1 96.198.14.1/30\nR1 96.198.14.254/30 <-> R2 96.198.14.253/30\nR2 96.198.15.1/30 <-> C 96.198.15.2/30\nA default via 96.198.14.1\nR1 route 96.198.15.0/30 via 96.198.14.253\nR2 route 96.198.14.0/30 via 96.198.14.254\nC default via 96.198.15.1",
    packet: ["A -> R1 par le LAN gauche.", "R1 -> R2 par le transit.", "R2 -> C par le LAN droit.", "Le retour utilise les routes symétriques vers A."],
    traps: ["Réutiliser le même /30 sur deux liens.", "Oublier une route sur l’un des routeurs.", "Utiliser .252 ou .255 sur le transit."]
  },
  "08": {
    screen: ["Deux LAN se trouvent derrière R2, puis R1 relie l’ensemble à Internet.", "Internet fournit une route résumée couvrant une plage de 64 adresses."],
    goal: "Découper une plage en sous-réseaux puis annoncer l’ensemble avec une route agrégée.",
    rules: ["Un /26 couvre 64 adresses.", "Les sous-réseaux internes doivent rester à l’intérieur de cette plage.", "R1 peut annoncer le /26 entier au lieu d’une route par LAN."],
    deductions: [
      {
        look: "Internet annonce 72.44.18.0/26.",
        meaning: "La plage disponible va de 72.44.18.0 à 72.44.18.63.",
        deduction: "On peut y placer deux LAN /28 et un transit /30 sans chevauchement.",
        value: "LAN C = .0/28 ; LAN D = .16/28 ; transit = .60/30.",
        why: "Ces blocs occupent .0-.15, .16-.31 et .60-.63, tous inclus dans le /26."
      },
      {
        look: "C et D ont chacun besoin d’une gateway locale.",
        meaning: "R2 doit posséder une interface dans chaque LAN.",
        deduction: "On choisit les premières adresses hôtes pour R2.",
        value: "R2-C .1, C .2 ; R2-D .17, D .18.",
        why: "Chaque PC partage son /28 avec l’interface correspondante de R2."
      },
      {
        look: "R1 et R2 doivent être voisins sur le transit.",
        meaning: "Le /30 .60-.63 fournit .61 et .62.",
        deduction: "R2 utilise .61 et R1 .62.",
        value: "R1 : 72.44.18.0/26 via 72.44.18.61 ; R2 : default via 72.44.18.62.",
        why: "R1 envoie tout le bloc interne à R2, et R2 envoie l’extérieur à R1."
      }
    ],
    solution: "C 72.44.18.2/28 -> 72.44.18.1\nD 72.44.18.18/28 -> 72.44.18.17\nR2 72.44.18.61/30 <-> R1 72.44.18.62/30\nR1 : 72.44.18.0/26 via 72.44.18.61\nR2 : default via 72.44.18.62\nInternet : 72.44.18.0/26 via l’IP publique de R1",
    packet: ["C vers D : C -> R2 -> D.", "C vers Internet : C -> R2 -> R1 -> Internet.", "Retour : Internet -> R1 grâce au /26, puis R1 -> R2, puis R2 choisit le bon LAN."],
    traps: ["Créer un sous-réseau hors de .0-.63.", "Faire chevaucher les deux /28.", "Annoncer une gateway qui n’est pas voisine."]
  },
  "09": {
    screen: ["Plusieurs réseaux et plusieurs routeurs forment une topologie ramifiée.", "Certaines routes sont trop précises, inutiles ou pointent vers un mauvais voisin."],
    goal: "Lire une table de routage et vérifier chaque chemin, y compris le retour.",
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
    solution: "LAN A/B : 80.198.40.0/25, gateway 80.198.40.126\nTransit : R1 70.50.17.253/30 <-> R2 70.50.17.254/30\nLAN C : 70.50.18.0/24, gateway 70.50.18.254\nR1 route 70.50.18.0/24 via 70.50.17.254\nR2 route 80.198.40.0/25 via 70.50.17.253",
    packet: ["A remet le paquet à sa gateway.", "R1 applique la route vers 70.50.18.0/24 et remet à R2.", "R2 livre à C.", "C répond à R2, qui applique sa route de retour vers 80.198.40.0/25."],
    traps: ["Tester seulement l’aller.", "Laisser une route qui couvre une mauvaise plage.", "Confondre interface de sortie et destination finale."]
  },
  "10": {
    screen: ["La topologie complète combine plusieurs LAN, des transits, Internet et des routes statiques.", "C’est une synthèse : adressage, masques, gateways, agrégation et retour."],
    goal: "Construire un plan cohérent de bout en bout et le prouver par le trajet des paquets.",
    rules: ["Commencer par dessiner un sous-réseau par câble ou LAN.", "Configurer les interfaces avant les routes.", "Ajouter les routes du plus local vers le plus lointain.", "Toujours terminer par le chemin retour."],
    deductions: [
      {
        look: "Deux LAN internes doivent tenir dans 80.50.40.0/24.",
        meaning: "Le /24 peut être découpé en plusieurs blocs distincts.",
        deduction: "On réserve 80.50.40.0/26 pour le LAN A et 80.50.40.64/26 pour le LAN B.",
        value: "LAN A : routeur .1, A .10 ; LAN B : routeur .65, B .70.",
        why: "Les blocs .0-.63 et .64-.127 ne se chevauchent pas."
      },
      {
        look: "Les routeurs ont besoin d’un lien de transit.",
        meaning: "Deux interfaces suffisent sur ce lien.",
        deduction: "Un /30 séparé est adapté.",
        value: "Transit 80.50.40.252/30 : R1 .253, R2 .254.",
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
    solution: "LAN A 80.50.40.0/26 : R2 .1, A .10\nLAN B 80.50.40.64/26 : R2 .65, B .70\nTransit 80.50.40.252/30 : R1 .253, R2 .254\nR2 default via 80.50.40.253\nR1 routes internes via 80.50.40.254\nR1 default via le voisin Internet\nInternet retour 80.50.40.0/24 via l’IP publique de R1",
    packet: ["A -> gateway R2.", "R2 -> R1 par le transit.", "R1 -> Internet par son lien public.", "Internet -> R1 grâce à la route de retour.", "R1 -> R2 grâce à la route interne.", "R2 -> A sur le LAN correspondant."],
    traps: ["Tout configurer au hasard sans plan d’adressage.", "Créer des sous-réseaux qui se chevauchent.", "Oublier une route sur un équipement intermédiaire.", "Valider sans raconter l’aller et le retour."]
  }
};
