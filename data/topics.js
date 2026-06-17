window.SYSADMIN_TOPICS = [
  {
    "id": "born2beroot",
    "number": "01",
    "title": "01 - Born2beRoot",
    "shortTitle": "01 Serveur",
    "focus": "VM, sécurité, monitoring",
    "status": "Sujet analysé",
    "summary": "Mettre en place une première machine serveur propre, sécurisée et explicable : installation minimale, partitions chiffrées avec LVM, utilisateurs, sudo, SSH, pare-feu, politique de mots de passe, script de monitoring, README de défense et signature du disque.",
    "objectives": [
      "Savoir prouver l’état de chaque exigence avec une commande, pas seulement dire que c’est configuré.",
      "Comprendre les choix Debian/Rocky, AppArmor/SELinux, UFW/firewalld et VirtualBox/UTM.",
      "Préparer les opérations demandées en défense : créer un utilisateur, changer le hostname, vérifier SSH, firewall, sudo et cron.",
      "Garder une soumission minimale : README, signature du disque, aucune VM dans le dépôt."
    ],
    "concepts": [
      {
        "title": "VM minimale sans interface graphique",
        "tags": [
          "VirtualBox",
          "UTM",
          "serveur",
          "TTY"
        ],
        "body": [
          "Le projet attend une machine virtuelle serveur, pas un poste de travail complet.",
          "Une installation minimale réduit la surface d’attaque et force à comprendre les commandes système.",
          "Pendant la défense, il faut pouvoir expliquer pourquoi le serveur n’a pas besoin d’interface graphique."
        ],
        "code": "hostnamectl\nuname -a\nlsblk",
        "mistake": "Installer un environnement desktop complet par confort.",
        "tip": "Prépare les commandes qui prouvent l’OS, le noyau, le hostname et la structure disque."
      },
      {
        "title": "Debian ou Rocky : choix assumé",
        "tags": [
          "Debian",
          "Rocky",
          "distribution"
        ],
        "body": [
          "Le sujet laisse choisir entre deux familles de distribution.",
          "Debian est souvent plus directe pour ce projet ; Rocky demande de maîtriser SELinux et firewalld.",
          "Le README doit expliquer le choix, les avantages et les limites."
        ],
        "code": "cat /etc/os-release",
        "mistake": "Choisir une distribution sans pouvoir comparer les implications.",
        "tip": "Prépare un paragraphe court : gestionnaire de paquets, sécurité, firewall, documentation."
      },
      {
        "title": "LVM et partitions chiffrées",
        "tags": [
          "LVM",
          "chiffrement",
          "partitions"
        ],
        "body": [
          "LVM ajoute une couche flexible entre disques physiques, groupes de volumes et volumes logiques.",
          "Le chiffrement protège les données si le disque est récupéré hors de la VM.",
          "Il faut savoir lire la structure avec les outils système, pas seulement montrer l’installateur."
        ],
        "code": "lsblk\nsudo lvdisplay\nsudo vgdisplay",
        "mistake": "Ne pas savoir expliquer la différence entre partition, volume physique, volume group et logical volume.",
        "tip": "Dessine rapidement la chaîne disque -> chiffrement -> LVM -> points de montage."
      },
      {
        "title": "AppArmor ou SELinux",
        "tags": [
          "AppArmor",
          "SELinux",
          "MAC"
        ],
        "body": [
          "Ces outils ajoutent un contrôle d’accès obligatoire en plus des permissions Unix classiques.",
          "Sur Debian, AppArmor est le réflexe attendu ; sur Rocky, SELinux doit être actif et cohérent.",
          "La défense peut demander de vérifier l’état du module de sécurité."
        ],
        "code": "sudo aa-status\ngetenforce",
        "mistake": "Confondre pare-feu et contrôle d’accès obligatoire.",
        "tip": "Explique simplement : le firewall contrôle le réseau, AppArmor/SELinux contrôlent ce que les processus peuvent faire."
      },
      {
        "title": "SSH sur un port dédié, sans root",
        "tags": [
          "SSH",
          "sshd",
          "port 4242"
        ],
        "body": [
          "SSH doit permettre l’administration distante tout en limitant les risques.",
          "Le service écoute sur le port demandé et la connexion directe en root est refusée.",
          "Il faut savoir modifier et redémarrer sshd proprement."
        ],
        "code": "sudo systemctl status ssh\nsudo ss -tlnp | grep 4242\nsudo grep -E 'Port|PermitRootLogin' /etc/ssh/sshd_config",
        "mistake": "Changer le port SSH mais oublier d’ouvrir le pare-feu.",
        "tip": "Teste toujours service + port écouté + règle firewall + connexion utilisateur."
      },
      {
        "title": "UFW ou firewalld",
        "tags": [
          "UFW",
          "firewalld",
          "firewall"
        ],
        "body": [
          "Le pare-feu doit être actif dès le démarrage.",
          "Seul le port nécessaire à l’administration distante doit rester ouvert.",
          "La commande dépend de la distribution choisie."
        ],
        "code": "sudo ufw status verbose\nsudo firewall-cmd --list-all",
        "mistake": "Autoriser trop de ports pour éviter les problèmes de connexion.",
        "tip": "Garde une règle minimale et sais expliquer pourquoi chaque port est ouvert."
      },
      {
        "title": "Hostname et utilisateur principal",
        "tags": [
          "hostname",
          "useradd",
          "groups"
        ],
        "body": [
          "La VM doit avoir un nom conforme au login demandé.",
          "Un utilisateur non-root doit exister et appartenir aux groupes attendus.",
          "Pendant la défense, on peut te demander de créer un nouvel utilisateur et de l’ajouter à un groupe."
        ],
        "code": "hostnamectl\nid $USER\nsudo adduser trainee\nsudo usermod -aG sudo,user42 trainee",
        "mistake": "Modifier /etc/hostname sans vérifier /etc/hosts ou sans redémarrer le service concerné.",
        "tip": "Prépare aussi les commandes deluser, groupadd, usermod et getent group."
      },
      {
        "title": "Politique de mots de passe",
        "tags": [
          "PAM",
          "login.defs",
          "pwquality"
        ],
        "body": [
          "La politique mélange expiration, délai de changement, avertissement et complexité.",
          "Les règles globales se trouvent souvent dans login.defs et PAM.",
          "Les comptes déjà créés doivent aussi respecter la politique."
        ],
        "code": "sudo chage -l username\nsudo grep -E 'PASS_MAX_DAYS|PASS_MIN_DAYS|PASS_WARN_AGE' /etc/login.defs",
        "mistake": "Configurer la politique après la création des utilisateurs sans corriger les comptes existants.",
        "tip": "Vérifie root et l’utilisateur principal avec chage -l."
      },
      {
        "title": "Configuration sudo stricte",
        "tags": [
          "sudoers",
          "secure_path",
          "logs"
        ],
        "body": [
          "sudo doit limiter les tentatives, afficher un message d’erreur personnalisé et journaliser les actions.",
          "Les entrées et sorties peuvent être loguées dans un dossier dédié.",
          "secure_path réduit les risques liés à un PATH manipulé."
        ],
        "code": "sudo visudo\nsudo -l\nsudo ls /var/log/sudo",
        "mistake": "Modifier sudoers directement avec un éditeur normal et casser sudo.",
        "tip": "Utilise toujours visudo, puis teste sudo -l avec l’utilisateur concerné."
      },
      {
        "title": "monitoring.sh",
        "tags": [
          "bash",
          "wall",
          "cron",
          "monitoring"
        ],
        "body": [
          "Le script doit afficher périodiquement les informations système sur les terminaux.",
          "Il faut comprendre chaque commande : architecture, CPU, RAM, disque, LVM, connexions, réseau et sudo.",
          "cron permet de planifier l’exécution sans modifier le script."
        ],
        "code": "sudo crontab -l\nsudo systemctl status cron\nwall \"test broadcast\"",
        "mistake": "Écrire un script qui affiche les bonnes lignes mais sans savoir d’où vient chaque valeur.",
        "tip": "Commente mentalement chaque commande : source de donnée, formatage, limite."
      },
      {
        "title": "Signature du disque",
        "tags": [
          "signature.txt",
          "sha1",
          "soumission"
        ],
        "body": [
          "Le dépôt ne doit pas contenir la VM ni son disque.",
          "La soumission repose sur une signature du disque virtuel.",
          "Démarrer ou modifier la VM peut changer la signature : il faut gérer ce point avant l’évaluation."
        ],
        "code": "sha1sum machine.vdi > signature.txt",
        "mistake": "Relancer la VM après avoir généré la signature sans la recalculer.",
        "tip": "Garde une copie stable du disque ou recalcule la signature au dernier moment."
      },
      {
        "title": "README de défense",
        "tags": [
          "README",
          "documentation",
          "défense"
        ],
        "body": [
          "Le README doit expliquer le but, les choix techniques, les ressources et l’usage de l’IA si applicable.",
          "Il doit aussi comparer les alternatives demandées : distributions, sécurité, firewall et virtualisation.",
          "Un bon README prépare les réponses de défense."
        ],
        "code": "README.md\nsignature.txt",
        "mistake": "Faire un README de commandes sans explication des choix.",
        "tip": "Structure le README comme une défense écrite : choix, installation, vérifications, sources, limites."
      },
      {
        "title": "apt vs aptitude",
        "tags": [
          "apt",
          "aptitude",
          "paquets"
        ],
        "body": [
          "apt est l’outil courant en ligne de commande pour installer, mettre à jour et supprimer des paquets Debian.",
          "aptitude est un gestionnaire plus haut niveau, avec une interface interactive et un solveur de dépendances différent.",
          "En défense, il faut surtout savoir expliquer que les deux gèrent des paquets mais n’ont pas exactement le même usage.",
          "La question sert à vérifier que tu comprends ton système, pas à réciter une préférence absolue."
        ],
        "code": "apt list --installed | head\napt-cache policy sudo\naptitude --version",
        "mistake": "Répondre seulement “apt est plus moderne” sans parler de dépendances, interface ou usage.",
        "tip": "Prépare une réponse en deux phrases : apt pour les commandes quotidiennes, aptitude pour une gestion plus interactive/assistée."
      },
      {
        "title": "systemctl et journalctl",
        "tags": [
          "systemd",
          "services",
          "logs"
        ],
        "body": [
          "systemctl inspecte et pilote les services gérés par systemd.",
          "journalctl lit les logs associés au système et aux unités systemd.",
          "Pour chaque service important, tu dois savoir vérifier s’il est actif, activé au démarrage et pourquoi il échoue.",
          "SSH, cron, UFW/firewalld et AppArmor/SELinux sont les vérifications classiques."
        ],
        "code": "sudo systemctl status ssh\nsudo systemctl is-enabled ssh\nsudo journalctl -u ssh --no-pager -n 30",
        "mistake": "Redémarrer un service en boucle sans lire ses logs.",
        "tip": "Diagnostic simple : status pour l’état, is-enabled pour le démarrage, journalctl pour la cause."
      },
      {
        "title": "Créer un utilisateur en défense",
        "tags": [
          "adduser",
          "groupes",
          "défense"
        ],
        "body": [
          "La défense peut demander de créer un nouvel utilisateur et de l’ajouter à un groupe.",
          "Il faut savoir vérifier les groupes réels de l’utilisateur après modification.",
          "Selon la politique PAM, le mot de passe choisi doit respecter les contraintes configurées.",
          "L’ajout au groupe sudo donne des droits via la configuration sudoers, pas par magie."
        ],
        "code": "sudo adduser testuser\nsudo usermod -aG sudo,user42 testuser\nid testuser\ngetent group user42",
        "mistake": "Oublier l’option -a avec usermod -G et remplacer les groupes existants.",
        "tip": "Pour ajouter un groupe sans retirer les autres : usermod -aG groupe utilisateur."
      },
      {
        "title": "Changer le hostname proprement",
        "tags": [
          "hostnamectl",
          "hosts",
          "défense"
        ],
        "body": [
          "Le hostname doit suivre la convention demandée et peut être modifié pendant la défense.",
          "hostnamectl change le nom système de manière propre sur systemd.",
          "Le fichier /etc/hosts doit rester cohérent pour éviter des résolutions locales étranges.",
          "Après modification, il faut vérifier que le changement est visible."
        ],
        "code": "sudo hostnamectl set-hostname login42\nhostnamectl\ncat /etc/hosts",
        "mistake": "Changer seulement le prompt du shell et croire que le hostname système a changé.",
        "tip": "Vérifie hostnamectl, hostname et /etc/hosts après la modification."
      },
      {
        "title": "Arrêter le monitoring sans modifier le script",
        "tags": [
          "cron",
          "monitoring",
          "défense"
        ],
        "body": [
          "Le script de monitoring est lancé périodiquement par cron ou une planification équivalente.",
          "La défense peut demander de l’interrompre sans éditer le script lui-même.",
          "Il faut donc agir sur la planification ou le service qui le déclenche.",
          "Savoir revenir en arrière est aussi important que savoir l’arrêter."
        ],
        "code": "sudo crontab -l\nsudo crontab -e\nsudo systemctl status cron",
        "mistake": "Supprimer ou renommer monitoring.sh pour stopper les messages.",
        "tip": "Désactive la ligne cron, explique la périodicité, puis restaure-la si demandé."
      },
      {
        "title": "Checklist de défense Born2beRoot",
        "tags": [
          "checklist",
          "défense",
          "audit"
        ],
        "body": [
          "Avant l’évaluation, prépare une suite courte de commandes qui prouvent chaque exigence.",
          "L’objectif est de répondre vite sans fouiller tout le système.",
          "Chaque commande doit être comprise : une sortie que tu ne sais pas expliquer devient un risque.",
          "Garde aussi une réponse claire sur les choix de distribution, virtualisation et sécurité."
        ],
        "code": "hostnamectl\nlsblk\nsudo ufw status verbose\nsudo systemctl status ssh\nid $USER\nsudo -l\nsudo crontab -l",
        "mistake": "Avoir une configuration correcte mais aucun moyen rapide de la démontrer.",
        "tip": "Transforme le README en script mental de défense : exigence, commande, preuve, explication."
      }
    ]
  },
  {
    "id": "net-practice",
    "number": "02",
    "title": "02 - Net_Practice",
    "shortTitle": "02 Réseau",
    "focus": "TCP/IP, masques, routes",
    "status": "Sujet analysé",
    "summary": "Résoudre les configurations Net_Practice en raisonnant sur TCP/IP : adresses, masques, plages utilisables, gateways, routeurs, switches, routes explicites et exports. L’interface net_practice.1.9 est intégrée ici comme outil d’entraînement, pas comme page séparée.",
    "objectives": [
      "Calculer réseau, broadcast et plage utilisable à partir d’une IP et d’un masque.",
      "Valider qu’une gateway est joignable localement avant de l’utiliser comme next hop.",
      "Comprendre les routes d’aller et de retour entre hosts, routeurs et Internet simulé.",
      "Utiliser l’interface net_practice.1.9 pour s’entraîner, vérifier et exporter les dix configurations."
    ],
    "concepts": [
      {
        "title": "Préambule : comment raisonner dans Net_Practice",
        "tags": [
          "méthode",
          "TCP/IP",
          "raisonnement"
        ],
        "body": [
          "Net_Practice ne teste pas seulement des réponses, il teste un raisonnement réseau.",
          "Chaque champ doit être justifiable : IP, masque, gateway, route et destination.",
          "La bonne méthode consiste à découper le schéma en segments, calculer les réseaux locaux, puis seulement ajouter les routes.",
          "Si une interface locale est mal adressée, aucune route ne peut corriger le problème.",
          "Le but est de savoir expliquer pourquoi chaque paquet peut partir et revenir."
        ],
        "code": "1. Identifier les segments\n2. Calculer les sous-réseaux\n3. Placer les IP utilisables\n4. Vérifier les gateways locales\n5. Ajouter les routes aller et retour",
        "mistake": "Commencer par remplir les routes sans avoir validé les IP et les masques.",
        "tip": "Répète toujours la question : cette interface peut-elle parler localement à sa gateway ?"
      },
      {
        "title": "Puissances de 2 utiles",
        "tags": [
          "calcul",
          "puissances de 2",
          "adresses"
        ],
        "body": [
          "IPv4 utilise 32 bits : chaque bit peut valoir 0 ou 1.",
          "Le nombre d’adresses d’un bloc dépend du nombre de bits hôte restants.",
          "La formule de base est 2 puissance bits hôte.",
          "Les hôtes utilisables valent souvent ce total moins 2, car l’adresse réseau et l’adresse broadcast sont réservées.",
          "Les petites puissances doivent devenir automatiques : 2, 4, 8, 16, 32, 64, 128, 256."
        ],
        "code": "2^1 = 2\n2^2 = 4\n2^3 = 8\n2^4 = 16\n2^5 = 32\n2^6 = 64\n2^7 = 128\n2^8 = 256",
        "mistake": "Oublier de retirer réseau et broadcast quand on compte les hôtes utilisables.",
        "tip": "Pour un /30 : 32 - 30 = 2 bits hôte, donc 2^2 = 4 adresses, donc 2 hôtes utilisables."
      },
      {
        "title": "CIDR /XX : correspondance bits, masque et taille",
        "tags": [
          "CIDR",
          "/XX",
          "masque"
        ],
        "body": [
          "Le /XX indique combien de bits appartiennent au réseau.",
          "Plus le nombre après le slash est grand, plus le réseau est petit.",
          "Les bits restants servent aux hôtes.",
          "Un /24 laisse 8 bits hôte, donc 256 adresses.",
          "Un /30 laisse 2 bits hôte, donc seulement 4 adresses."
        ],
        "code": "/24 = 255.255.255.0   = 256 adresses, 254 hôtes\n/25 = 255.255.255.128 = 128 adresses, 126 hôtes\n/26 = 255.255.255.192 = 64 adresses, 62 hôtes\n/27 = 255.255.255.224 = 32 adresses, 30 hôtes\n/28 = 255.255.255.240 = 16 adresses, 14 hôtes\n/29 = 255.255.255.248 = 8 adresses, 6 hôtes\n/30 = 255.255.255.252 = 4 adresses, 2 hôtes",
        "mistake": "Croire que /30 veut dire 30 hôtes.",
        "tip": "Lis /XX comme : XX bits réseau, donc 32 - XX bits hôte."
      },
      {
        "title": "Calculer réseau, broadcast et plage utilisable",
        "tags": [
          "réseau",
          "broadcast",
          "plage"
        ],
        "body": [
          "L’adresse réseau est la première adresse du bloc.",
          "L’adresse broadcast est la dernière adresse du bloc.",
          "Les adresses utilisables sont entre les deux.",
          "Pour trouver le réseau, repère la taille du bloc, puis l’intervalle dans lequel tombe l’IP.",
          "La gateway doit être une adresse utilisable dans le même bloc que l’interface qui l’utilise."
        ],
        "code": "IP: 192.168.1.70/26\nTaille du bloc: 64\nBlocs: .0-.63, .64-.127, .128-.191, .192-.255\nRéseau: 192.168.1.64\nBroadcast: 192.168.1.127\nUtilisables: 192.168.1.65 à 192.168.1.126",
        "mistake": "Attribuer .64 ou .127 à une machine dans cet exemple.",
        "tip": "Quand tu connais le bloc, écris mentalement : première adresse = réseau, dernière = broadcast."
      },
      {
        "title": "Correspondance binaire des octets de masque",
        "tags": [
          "binaire",
          "masque",
          "octets"
        ],
        "body": [
          "Un octet IPv4 contient 8 bits.",
          "Les valeurs des bits sont 128, 64, 32, 16, 8, 4, 2 et 1.",
          "Un masque met les bits réseau à 1 puis les bits hôte à 0.",
          "C’est pour cela que les octets de masque courants sont 0, 128, 192, 224, 240, 248, 252, 254 et 255.",
          "Comprendre cette table aide à convertir rapidement un /XX en masque décimal."
        ],
        "code": "128 64 32 16 8 4 2 1\n/25 -> 255.255.255.128\n/26 -> 255.255.255.192\n/27 -> 255.255.255.224\n/28 -> 255.255.255.240\n/29 -> 255.255.255.248\n/30 -> 255.255.255.252",
        "mistake": "Inventer des masques impossibles comme 255.255.255.250.",
        "tip": "Un octet de masque valide doit suivre la suite : 0, 128, 192, 224, 240, 248, 252, 254, 255."
      },
      {
        "title": "PC, interface et gateway",
        "tags": [
          "PC",
          "host",
          "gateway"
        ],
        "body": [
          "Dans Net_Practice, un PC représente un hôte avec une interface réseau.",
          "Son IP doit appartenir à la plage utilisable de son réseau local.",
          "Sa gateway doit être une interface de routeur présente sur le même segment local.",
          "Le PC n’a pas besoin de route détaillée vers chaque réseau si une gateway par défaut correcte suffit.",
          "Si le PC et sa gateway ne sont pas dans le même sous-réseau, le paquet ne peut même pas atteindre le routeur."
        ],
        "code": "PC: 10.0.1.42/24\nGateway valide: 10.0.1.1\nGateway invalide: 10.0.2.1",
        "mistake": "Mettre comme gateway l’adresse finale à atteindre au lieu du routeur local.",
        "tip": "La gateway d’un PC est presque toujours la patte du routeur branchée sur son réseau local."
      },
      {
        "title": "Switch : même réseau, pas de routage",
        "tags": [
          "switch",
          "LAN",
          "niveau 2"
        ],
        "body": [
          "Un switch relie plusieurs interfaces dans le même réseau local.",
          "Il ne change pas les IP, ne choisit pas de route et ne remplace pas une gateway.",
          "Tous les équipements branchés sur le même switch doivent être cohérents avec le même sous-réseau.",
          "Un switch peut relier plusieurs PC et une interface de routeur.",
          "Pour sortir du LAN, les hôtes passent par le routeur, pas par le switch lui-même."
        ],
        "code": "PC A: 192.168.10.10/24\nPC B: 192.168.10.20/24\nRouteur LAN: 192.168.10.1/24\nTous peuvent partager le même switch.",
        "mistake": "Créer deux sous-réseaux différents sur un simple switch et attendre que ça communique.",
        "tip": "Switch = câble intelligent dans un même LAN. Routeur = passage entre LAN différents."
      },
      {
        "title": "Routeur, interfaces et next hop",
        "tags": [
          "routeur",
          "interface",
          "next hop"
        ],
        "body": [
          "Un routeur possède plusieurs interfaces, souvent une par réseau connecté.",
          "Chaque interface doit avoir une IP utilisable dans le réseau de son segment.",
          "Une route indique une destination et un next hop.",
          "Le next hop doit être joignable depuis l’interface de sortie du routeur.",
          "Un routeur peut connaître un réseau directement connecté sans route explicite supplémentaire, mais il a besoin de routes pour les réseaux non connectés."
        ],
        "code": "R1 eth0: 192.168.1.1/24\nR1 eth1: 10.0.0.1/30\nRoute vers 172.16.0.0/24 via 10.0.0.2",
        "mistake": "Mettre un next hop qui n’est pas dans un réseau directement joignable par le routeur.",
        "tip": "Pour chaque route, demande : le routeur sait-il joindre le next hop sans utiliser cette même route ?"
      },
      {
        "title": "Routes : destination, masque et route par défaut",
        "tags": [
          "route",
          "0.0.0.0/0",
          "destination"
        ],
        "body": [
          "Une route ne dit pas où est une machine unique seulement, elle peut désigner un réseau entier.",
          "La destination est écrite sous forme réseau/masque.",
          "La route par défaut 0.0.0.0/0 attrape tout ce qui n’a pas de route plus précise.",
          "Quand plusieurs routes correspondent, la plus spécifique gagne.",
          "Le chemin retour doit être configuré avec la même rigueur que le chemin aller."
        ],
        "code": "Destination précise: 192.168.20.0/24 via 10.0.0.2\nRoute par défaut: 0.0.0.0/0 via 10.0.0.2\nPlus spécifique: /24 gagne sur /0",
        "mistake": "Ajouter une route par défaut partout pour masquer un mauvais plan d’adressage.",
        "tip": "Utilise une route par défaut quand tout le reste doit sortir par le même routeur ; sinon préfère une route précise."
      },
      {
        "title": "Bonnes pratiques de résolution",
        "tags": [
          "bonnes pratiques",
          "debug",
          "méthode"
        ],
        "body": [
          "Travaille par couches : d’abord IP et masques, ensuite gateways, ensuite routes.",
          "Ne change qu’un petit groupe de champs à la fois.",
          "Garde des sous-réseaux aussi petits que nécessaire pour éviter les chevauchements.",
          "Vérifie chaque liaison dans les deux sens.",
          "Quand un check échoue, lis l’erreur comme un indice sur la couche en faute."
        ],
        "code": "Checklist rapide:\n- IP utilisable ?\n- Masque cohérent ?\n- Pas de chevauchement ?\n- Gateway locale ?\n- Route aller ?\n- Route retour ?",
        "mistake": "Changer plusieurs IP, masques et routes après chaque erreur.",
        "tip": "Un bon dépannage doit pouvoir expliquer ce qui a changé et pourquoi."
      },
      {
        "title": "Pièges et mauvaises pratiques fréquentes",
        "tags": [
          "pièges",
          "mauvaises pratiques",
          "erreurs"
        ],
        "body": [
          "Un masque trop large peut faire croire qu’une adresse distante est locale.",
          "Deux réseaux qui se chevauchent rendent le routage ambigu.",
          "Une gateway hors réseau local est inutilisable.",
          "Une adresse réseau ou broadcast ne doit pas être donnée à un PC ou un routeur.",
          "Le fait qu’un chemin aller existe ne prouve jamais que le retour existe."
        ],
        "code": "À éviter:\n- 10.0.0.0/24 et 10.0.0.128/25 dans le même plan\n- Gateway 192.168.2.1 pour un PC en 192.168.1.42/24\n- Host configuré sur l’adresse .0 ou .255 d’un /24",
        "mistake": "Réparer un symptôme avec un masque plus large au lieu de corriger le réseau.",
        "tip": "Si élargir le masque semble tout résoudre, vérifie immédiatement les chevauchements."
      },
      {
        "title": "Adresse IP et masque",
        "tags": [
          "IPv4",
          "masque",
          "CIDR"
        ],
        "body": [
          "Une adresse IP identifie une interface, pas une machine entière.",
          "Le masque indique quelle partie correspond au réseau et quelle partie correspond aux hôtes.",
          "Deux interfaces communiquent directement seulement si elles partagent un sous-réseau compatible."
        ],
        "code": "192.168.1.42/24\nréseau: 192.168.1.0\nhôtes: 192.168.1.1 à 192.168.1.254",
        "mistake": "Comparer seulement les trois premiers octets sans tenir compte du masque.",
        "tip": "Convertis mentalement les masques courants : /24, /25, /26, /27, /28, /30."
      },
      {
        "title": "Réseau, broadcast, hôtes utilisables",
        "tags": [
          "network",
          "broadcast",
          "range"
        ],
        "body": [
          "L’adresse réseau représente le sous-réseau lui-même.",
          "L’adresse broadcast représente tous les hôtes du sous-réseau.",
          "Aucune des deux ne doit être donnée à une interface hôte."
        ],
        "code": "/30 donne 4 adresses : réseau, 2 hôtes utilisables, broadcast",
        "mistake": "Attribuer l’adresse réseau ou broadcast à un host ou une passerelle.",
        "tip": "Sur /30, les deux adresses du milieu sont presque toujours les seules utilisables."
      },
      {
        "title": "Passerelle par défaut",
        "tags": [
          "gateway",
          "default route",
          "route"
        ],
        "body": [
          "La passerelle est l’adresse d’un routeur accessible depuis le sous-réseau local.",
          "Elle sert à joindre les réseaux qui ne sont pas directement connectés.",
          "Une gateway hors sous-réseau local est invalide."
        ],
        "code": "host: 10.0.0.10/24\ngateway possible: 10.0.0.1\npas possible: 10.0.1.1",
        "mistake": "Mettre comme gateway une adresse qui n’est pas dans le réseau de l’interface.",
        "tip": "Avant de définir une route, vérifie que la gateway est joignable localement."
      },
      {
        "title": "Routeur et interfaces",
        "tags": [
          "router",
          "interface",
          "réseaux"
        ],
        "body": [
          "Un routeur relie plusieurs réseaux grâce à plusieurs interfaces.",
          "Chaque interface du routeur appartient au sous-réseau du segment auquel elle est connectée.",
          "Le routeur peut transmettre entre ses réseaux si les routes sont cohérentes."
        ],
        "code": "R1 eth0: 192.168.1.1/24\nR1 eth1: 10.0.0.1/24",
        "mistake": "Mettre deux interfaces d’un même routeur dans le même sous-réseau sans nécessité.",
        "tip": "Nomme mentalement chaque lien : réseau A, réseau B, réseau C."
      },
      {
        "title": "Switch",
        "tags": [
          "switch",
          "LAN",
          "niveau 2"
        ],
        "body": [
          "Un switch relie des machines dans un même réseau local.",
          "Il ne remplace pas une gateway pour sortir vers un autre sous-réseau.",
          "Dans les exercices, il sert surtout à regrouper des hosts sur un segment commun."
        ],
        "code": "Host A -- Switch -- Host B\nMême sous-réseau requis pour parler directement.",
        "mistake": "Attendre d’un switch qu’il route entre deux sous-réseaux.",
        "tip": "Switch = même réseau. Routeur = passage entre réseaux."
      },
      {
        "title": "Routes explicites",
        "tags": [
          "route",
          "destination",
          "next hop"
        ],
        "body": [
          "Une route indique vers quel next hop envoyer un réseau de destination.",
          "La route par défaut couvre tout ce qui n’a pas de route plus précise.",
          "Les routeurs intermédiaires doivent aussi connaître le chemin retour."
        ],
        "code": "destination: 0.0.0.0/0\nnext hop: 192.168.1.1",
        "mistake": "Configurer l’aller mais oublier la route de retour.",
        "tip": "Pour chaque ping mental, vérifie aller et retour."
      },
      {
        "title": "Sous-réseaux qui se chevauchent",
        "tags": [
          "overlap",
          "subnet",
          "erreur"
        ],
        "body": [
          "Deux réseaux qui se chevauchent créent une ambiguïté de routage.",
          "Un routeur ou une interface peut alors croire qu’une adresse est locale alors qu’elle ne devrait pas l’être.",
          "Les niveaux avancés piègent souvent sur les masques trop larges."
        ],
        "code": "10.0.0.0/24 chevauche 10.0.0.128/25",
        "mistake": "Choisir un masque large pour “faire passer” plus d’adresses.",
        "tip": "Vérifie que chaque segment a une plage distincte et minimale."
      },
      {
        "title": "Réseaux privés",
        "tags": [
          "RFC1918",
          "private",
          "public"
        ],
        "body": [
          "Les plages privées sont réservées aux réseaux internes.",
          "Elles reviennent souvent dans les exercices et ne sont pas routées directement sur Internet réel.",
          "Il faut aussi reconnaître quand une adresse appartient à une plage publique simulée."
        ],
        "code": "10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16",
        "mistake": "Croire que toute adresse en 172.* est privée.",
        "tip": "La plage privée 172 commence à 172.16 et finit à 172.31."
      },
      {
        "title": "Méthode de résolution d’un niveau",
        "tags": [
          "méthode",
          "levels",
          "debug"
        ],
        "body": [
          "Commence par identifier les segments physiques : hosts, switches, interfaces de routeur.",
          "Calcule ensuite le sous-réseau de chaque segment.",
          "Ajoute les gateways et routes seulement quand les adresses locales sont cohérentes."
        ],
        "code": "1. Segment\n2. Masque\n3. Plage valide\n4. Gateway\n5. Route retour",
        "mistake": "Modifier tous les champs en même temps et ne plus savoir ce qui a corrigé ou cassé.",
        "tip": "Procède de gauche à droite, puis vérifie chaque lien avec un raisonnement aller-retour."
      },
      {
        "title": "Export des configurations",
        "tags": [
          "export",
          "submission",
          "10 levels"
        ],
        "body": [
          "Chaque niveau réussi doit être exporté dans un fichier dédié.",
          "Le login saisi dans l’interface compte pour générer la bonne configuration.",
          "La soumission attend un fichier par niveau à la racine du dépôt."
        ],
        "code": "level1.json\nlevel2.json\n...\nlevel10.json",
        "mistake": "Réussir un niveau puis passer au suivant sans exporter.",
        "tip": "Après chaque réussite : exporter, renommer clairement, vérifier que le fichier est à la racine."
      },
      {
        "title": "Défense : niveaux 6 à 10",
        "tags": [
          "défense",
          "random",
          "évaluation"
        ],
        "body": [
          "La défense peut demander de résoudre des niveaux aléatoires parmi les plus avancés.",
          "Il faut donc maîtriser les calculs plutôt qu’apprendre les réponses par coeur.",
          "Les erreurs de gateway et de masque sont les plus fréquentes."
        ],
        "code": "gateway locale ?\nmasque cohérent ?\nroute retour ?",
        "mistake": "Mémoriser des configurations statiques au lieu de comprendre le calcul.",
        "tip": "Entraîne-toi à expliquer chaque champ modifié en une phrase."
      },
      {
        "title": "Interface net_practice : Structure du dossier",
        "tags": [
          "HTML",
          "JS",
          "levels",
          "interface"
        ],
        "body": [
          "Le dossier contient une page d’accueil, dix pages de niveaux, des scripts JavaScript de simulation et des images réseau.",
          "Chaque niveau est associé à sa page et à son script.",
          "Le coeur de l’exercice reste la configuration dans l’interface."
        ],
        "code": "index.html\nlevel1.html ... level10.html\njs/level1.js ... js/level10.js",
        "mistake": "Modifier les fichiers de l’outil au lieu de résoudre les configurations.",
        "tip": "Considère ce dossier comme un simulateur fourni, pas comme du code à corriger."
      },
      {
        "title": "Interface net_practice : Lancer l’interface",
        "tags": [
          "browser",
          "run.sh",
          "local",
          "interface"
        ],
        "body": [
          "L’interface peut être ouverte dans un navigateur.",
          "Selon le navigateur, un petit serveur local peut être nécessaire pour éviter des restrictions de sécurité.",
          "Le dossier contient aussi un script de lancement prévu à cet effet."
        ],
        "code": "cd net_practice\n./run.sh\n# puis ouvrir l’URL indiquée",
        "mistake": "Ouvrir un fichier directement puis conclure que l’outil est cassé à cause d’une restriction navigateur.",
        "tip": "Si le chargement local échoue, lance le serveur fourni et utilise l’URL locale."
      },
      {
        "title": "Interface net_practice : Login dans l’interface",
        "tags": [
          "login",
          "config",
          "export",
          "interface"
        ],
        "body": [
          "Le login saisi sert à générer la configuration personnelle.",
          "Il doit être entré avant de résoudre et exporter les niveaux.",
          "Une mauvaise saisie peut produire des fichiers qui ne correspondent pas à l’attendu."
        ],
        "code": "Entrer le login\nRésoudre\nExporter",
        "mistake": "Exporter des configurations sans avoir renseigné le bon login.",
        "tip": "Avant le niveau 1, vérifie le login affiché ou utilisé par l’interface."
      },
      {
        "title": "Interface net_practice : Check again",
        "tags": [
          "validation",
          "feedback",
          "debug",
          "interface"
        ],
        "body": [
          "Le bouton de vérification indique si la configuration est cohérente.",
          "Les erreurs doivent guider le raisonnement : IP invalide, gateway manquante, route incohérente.",
          "Il faut corriger la cause, pas seulement essayer des valeurs au hasard."
        ],
        "code": "Check again -> lire l’erreur -> corriger un champ -> vérifier",
        "mistake": "Changer plusieurs champs après chaque erreur sans comprendre le diagnostic.",
        "tip": "Note l’erreur et rattache-la à une règle réseau précise."
      },
      {
        "title": "Interface net_practice : Get my config",
        "tags": [
          "export",
          "fichiers",
          "soumission",
          "interface"
        ],
        "body": [
          "Après réussite, l’export permet de récupérer le fichier de configuration du niveau.",
          "Ces fichiers sont ceux qui doivent être placés dans le dépôt pour la soumission.",
          "Il faut en avoir dix au total."
        ],
        "code": "level1.json ... level10.json",
        "mistake": "Garder les fichiers dans le dossier de téléchargement sans les copier à la racine du repo.",
        "tip": "Après chaque export, déplace et renomme immédiatement le fichier."
      },
      {
        "title": "Interface net_practice : Mode entraînement et mode évaluation",
        "tags": [
          "training",
          "evaluation",
          "random",
          "interface"
        ],
        "body": [
          "L’interface permet de s’entraîner avec une configuration liée au login.",
          "Elle peut aussi générer des configurations aléatoires utiles pour préparer la défense.",
          "Les niveaux avancés doivent être compris par méthode, pas appris par fichier."
        ],
        "code": "training: répétition\nevaluation: configuration aléatoire",
        "mistake": "Réviser uniquement les configurations exportées une fois.",
        "tip": "Refais plusieurs tirages pour les niveaux 6 à 10."
      },
      {
        "title": "Interface net_practice : Checklist avant soumission",
        "tags": [
          "checklist",
          "repo",
          "Net_Practice",
          "interface"
        ],
        "body": [
          "La racine du dépôt doit contenir les dix fichiers exportés.",
          "Le README doit expliquer comment lancer l’interface et ce que les fichiers représentent.",
          "Aucun fichier du simulateur n’a besoin d’être copié dans le dépôt si le sujet ne le demande pas."
        ],
        "code": "ls level*.json | wc -l",
        "mistake": "Soumettre le dossier complet de l’interface au lieu des exports attendus.",
        "tip": "La soumission doit rester minimale : README + configurations exportées selon le sujet."
      },
      {
        "title": "Masques courants à connaître",
        "tags": [
          "CIDR",
          "masques",
          "calcul"
        ],
        "body": [
          "Les niveaux deviennent beaucoup plus simples si tu reconnais les masques usuels sans recalculer depuis zéro.",
          "/24 donne 256 adresses, /25 coupe en deux, /26 en quatre, /27 en huit, /28 en seize et /30 sert souvent aux liens point à point.",
          "La taille du bloc indique le pas entre deux réseaux.",
          "Le nombre d’hôtes utilisables vaut le nombre total d’adresses moins réseau et broadcast."
        ],
        "code": "/24: blocs de 256, 254 hôtes\n/25: blocs de 128, 126 hôtes\n/26: blocs de 64, 62 hôtes\n/30: blocs de 4, 2 hôtes",
        "mistake": "Confondre taille du bloc et nombre d’hôtes utilisables.",
        "tip": "Pour trouver le réseau, repère le pas du masque puis l’intervalle qui contient l’IP."
      },
      {
        "title": "Route la plus spécifique",
        "tags": [
          "route",
          "longest prefix",
          "priorité"
        ],
        "body": [
          "Quand plusieurs routes correspondent, la route au préfixe le plus long gagne.",
          "Une route /24 est plus spécifique qu’une route par défaut /0.",
          "Ce principe explique pourquoi une route particulière peut détourner un trafic qui aurait sinon pris la gateway par défaut.",
          "Dans Net_Practice, cela aide à comprendre les tables de route des routeurs."
        ],
        "code": "10.0.0.0/24 via A gagne sur 0.0.0.0/0 via B pour 10.0.0.42",
        "mistake": "Penser que les routes sont essayées seulement dans l’ordre affiché.",
        "tip": "Cherche d’abord la route la plus précise qui contient l’adresse destination."
      },
      {
        "title": "Lien point à point en /30",
        "tags": [
          "/30",
          "routeur",
          "point à point"
        ],
        "body": [
          "Un /30 est fréquent entre deux routeurs ou entre un routeur et un équipement isolé.",
          "Il fournit exactement deux adresses utilisables.",
          "C’est efficace pour un lien qui n’a besoin que de deux interfaces.",
          "Les deux extrémités doivent être dans le même /30."
        ],
        "code": "192.168.10.0/30\nréseau: .0\nhôtes: .1 et .2\nbroadcast: .3",
        "mistake": "Placer une troisième interface dans un /30 déjà complet.",
        "tip": "Sur un /30, si tu as plus de deux interfaces sur le segment, le masque est probablement mauvais."
      },
      {
        "title": "Internet simulé",
        "tags": [
          "internet",
          "default route",
          "simulation"
        ],
        "body": [
          "L’objet Internet des niveaux n’est pas Internet réel : c’est une destination simulée avec ses propres règles.",
          "Pour l’atteindre, les routeurs doivent avoir une route correcte vers lui.",
          "Les hosts passent généralement par leur gateway locale, puis le routeur sait où envoyer ensuite.",
          "Le chemin retour reste indispensable."
        ],
        "code": "Host -> gateway locale -> routeur -> Internet\nInternet -> route retour -> routeur -> Host",
        "mistake": "Configurer seulement le chemin du host vers Internet et oublier le retour.",
        "tip": "Trace mentalement les deux sens, même quand l’interface n’affiche qu’un côté évident."
      },
      {
        "title": "Diagnostic quand le check échoue",
        "tags": [
          "debug",
          "check",
          "méthode"
        ],
        "body": [
          "Un échec de check doit être traité comme un diagnostic réseau.",
          "Commence par les IP invalides, puis les masques, puis les gateways, puis les routes.",
          "Ne change pas les routes si l’interface locale a déjà une adresse impossible.",
          "Un champ grisé est une contrainte : les champs modifiables doivent s’adapter autour."
        ],
        "code": "1. IP dans plage utilisable ?\n2. Masque cohérent ?\n3. Gateway locale ?\n4. Route aller ?\n5. Route retour ?",
        "mistake": "Corriger les routes avant d’avoir validé les sous-réseaux de base.",
        "tip": "Les routes ne réparent jamais une IP locale invalide."
      }
    ]
  },
  {
    "id": "inception",
    "number": "03",
    "title": "03 - Inception",
    "shortTitle": "03 Docker",
    "focus": "Docker Compose, services, secrets",
    "status": "Sujet analysé",
    "summary": "Construire une infrastructure Docker reproductible : images locales, services séparés, NGINX en point d’entrée TLS, WordPress/PHP-FPM, MariaDB, réseau dédié, volumes persistants, secrets, .env, Makefile et README d’administration.",
    "objectives": [
      "Savoir reconstruire toute la stack avec le Makefile et Docker Compose.",
      "Séparer clairement image, conteneur, service, réseau, volume, secret et variable d’environnement.",
      "Prouver que NGINX est le seul point d’entrée public et que les autres services restent internes.",
      "Éviter toute configuration manuelle non reproductible dans WordPress, MariaDB ou les conteneurs."
    ],
    "concepts": [
      {
        "title": "Docker n’est pas une VM",
        "tags": [
          "Docker",
          "VM",
          "container"
        ],
        "body": [
          "Un conteneur partage le noyau de l’hôte, alors qu’une VM embarque un système plus complet.",
          "Un conteneur doit exécuter un processus principal clair.",
          "Cette différence explique pourquoi il faut éviter de gérer un conteneur comme une mini-machine interactive."
        ],
        "code": "docker ps\ndocker logs service\ndocker exec -it service sh",
        "mistake": "Installer plusieurs services sans lien dans un seul conteneur.",
        "tip": "Un service principal par conteneur : NGINX, WordPress/PHP-FPM, MariaDB."
      },
      {
        "title": "Images construites localement",
        "tags": [
          "Dockerfile",
          "image",
          "build"
        ],
        "body": [
          "Chaque service doit avoir son Dockerfile.",
          "Les images applicatives doivent être construites par le projet, pas tirées toutes prêtes.",
          "Le nom d’image doit rester cohérent avec le service."
        ],
        "code": "docker compose build\ndocker images",
        "mistake": "Utiliser une image prête à l’emploi pour WordPress, MariaDB ou NGINX.",
        "tip": "Base OS autorisée, puis installation et configuration dans ton Dockerfile."
      },
      {
        "title": "docker-compose.yml",
        "tags": [
          "compose",
          "services",
          "orchestration"
        ],
        "body": [
          "Compose décrit les services, volumes, réseaux, variables et politiques de redémarrage.",
          "Il relie les conteneurs sans utiliser le réseau host ni les anciens links.",
          "Le fichier doit être appelé par le Makefile pour construire et lancer l’infrastructure."
        ],
        "code": "docker compose config\ndocker compose up -d --build",
        "mistake": "Lancer les conteneurs à la main et ne pas rendre la stack reproductible.",
        "tip": "docker compose config est utile pour voir la configuration finale interpolée."
      },
      {
        "title": "Makefile",
        "tags": [
          "Makefile",
          "build",
          "automation"
        ],
        "body": [
          "Le Makefile doit piloter la construction et le lancement.",
          "Il sert d’interface simple pour l’évaluateur ou l’administrateur.",
          "Les cibles classiques sont up, down, build, clean et fclean selon ton choix."
        ],
        "code": "make\nmake down\nmake clean",
        "mistake": "Avoir des commandes qui marchent seulement si on les connaît déjà.",
        "tip": "Fais de make la porte d’entrée du projet."
      },
      {
        "title": "NGINX en TLS, seul point d’entrée",
        "tags": [
          "NGINX",
          "TLS",
          "443"
        ],
        "body": [
          "NGINX expose l’application vers l’extérieur.",
          "Il doit accepter TLSv1.2 ou TLSv1.3 et être le seul service exposé au port public attendu.",
          "WordPress et MariaDB doivent rester accessibles seulement depuis le réseau Docker interne."
        ],
        "code": "docker compose ps\nopenssl s_client -connect login.42.fr:443 -tls1_2",
        "mistake": "Exposer MariaDB ou PHP-FPM directement sur l’hôte.",
        "tip": "Seul NGINX a besoin d’un port publié vers l’hôte."
      },
      {
        "title": "WordPress + PHP-FPM",
        "tags": [
          "WordPress",
          "PHP-FPM",
          "service"
        ],
        "body": [
          "WordPress tourne dans son conteneur applicatif avec PHP-FPM.",
          "NGINX lui transmet les requêtes dynamiques via le réseau interne.",
          "L’initialisation doit créer le site et les utilisateurs attendus de façon reproductible."
        ],
        "code": "docker logs wordpress\ndocker exec -it wordpress wp user list",
        "mistake": "Configurer WordPress manuellement dans le navigateur sans script d’initialisation.",
        "tip": "Lance, détruis, relance : la stack doit se reconstruire sans manipulations cachées."
      },
      {
        "title": "MariaDB seul",
        "tags": [
          "MariaDB",
          "database",
          "volume"
        ],
        "body": [
          "MariaDB doit avoir son conteneur dédié.",
          "Les données doivent survivre au redémarrage grâce au volume de base de données.",
          "Les identifiants viennent de variables d’environnement ou secrets, pas du Dockerfile."
        ],
        "code": "docker exec -it mariadb mariadb -u user -p\ndocker volume ls",
        "mistake": "Stocker la base dans le système de fichiers éphémère du conteneur.",
        "tip": "Vérifie qu’un down/up conserve les données tant que les volumes ne sont pas supprimés."
      },
      {
        "title": "Volumes persistants",
        "tags": [
          "volumes",
          "data",
          "bind mount"
        ],
        "body": [
          "Un volume garde les données au-delà du cycle de vie d’un conteneur.",
          "Le sujet distingue les données de base et les fichiers du site WordPress.",
          "Les volumes sont attendus dans un emplacement précis lié au login sur la machine hôte."
        ],
        "code": "docker volume inspect wordpress_data\ndocker volume inspect mariadb_data",
        "mistake": "Confondre image, conteneur et volume.",
        "tip": "Image = recette, conteneur = processus, volume = données persistantes."
      },
      {
        "title": "Réseau Docker dédié",
        "tags": [
          "network",
          "bridge",
          "service names"
        ],
        "body": [
          "Un réseau Docker permet aux services de se joindre par nom.",
          "Il évite d’exposer tous les ports sur l’hôte.",
          "L’usage du host network et des links historiques est interdit dans ce projet."
        ],
        "code": "docker network ls\ndocker network inspect inception",
        "mistake": "Utiliser localhost dans WordPress pour joindre MariaDB.",
        "tip": "Dans un conteneur, localhost désigne le conteneur lui-même. Utilise le nom du service MariaDB."
      },
      {
        "title": ".env et secrets",
        "tags": [
          ".env",
          "secrets",
          "variables"
        ],
        "body": [
          "La configuration non sensible peut venir du fichier .env.",
          "Les mots de passe et secrets ne doivent pas être hardcodés dans les Dockerfiles.",
          "Les fichiers de secrets doivent être gérés avec prudence et documentés."
        ],
        "code": "docker compose config | grep -i password\nls secrets",
        "mistake": "Écrire un mot de passe directement dans un Dockerfile ou un script versionné.",
        "tip": "Vérifie ton git diff avant commit : aucun vrai secret ne doit apparaître."
      },
      {
        "title": "Nom de domaine local",
        "tags": [
          "domain",
          "hosts",
          "login.42.fr"
        ],
        "body": [
          "Le domaine local doit pointer vers la machine hôte.",
          "La résolution se configure généralement dans /etc/hosts.",
          "NGINX doit servir le site sur ce domaine en HTTPS."
        ],
        "code": "grep 42.fr /etc/hosts\ncurl -k https://login.42.fr",
        "mistake": "Tester seulement avec localhost alors que le sujet attend le domaine configuré.",
        "tip": "Prépare la preuve : /etc/hosts, curl HTTPS, certificat et réponse NGINX."
      },
      {
        "title": "Utilisateurs WordPress",
        "tags": [
          "WordPress",
          "admin",
          "users"
        ],
        "body": [
          "La base WordPress doit contenir deux utilisateurs dont un administrateur.",
          "Le nom de l’administrateur ne doit pas contenir les mots interdits.",
          "Les utilisateurs doivent être créés automatiquement lors de l’initialisation."
        ],
        "code": "wp user list --allow-root",
        "mistake": "Créer un admin avec un nom refusé ou à la main après lancement.",
        "tip": "Teste la création depuis un volume vide, pas seulement après une configuration déjà faite."
      },
      {
        "title": "restart policy et PID 1",
        "tags": [
          "restart",
          "PID 1",
          "entrypoint"
        ],
        "body": [
          "Les conteneurs doivent redémarrer en cas de crash.",
          "Le processus principal du conteneur doit rester au premier plan.",
          "Un mauvais entrypoint peut finir tout de suite ou masquer les signaux."
        ],
        "code": "docker inspect service --format '{{.HostConfig.RestartPolicy.Name}}'\ndocker top service",
        "mistake": "Lancer un service en arrière-plan puis laisser le conteneur s’arrêter.",
        "tip": "Le dernier processus de l’entrypoint doit être le service principal en foreground."
      },
      {
        "title": "README d’administration",
        "tags": [
          "README",
          "ops",
          "défense"
        ],
        "body": [
          "Le README doit expliquer les services, la configuration, les commandes de gestion et les choix techniques.",
          "Il doit comparer Docker avec les VM, réseau Docker avec host network, volumes avec bind mounts.",
          "Il doit aider quelqu’un à reconstruire et administrer la stack."
        ],
        "code": "make\nmake down\ndocker compose logs -f",
        "mistake": "Écrire un README uniquement narratif sans commandes de vérification.",
        "tip": "Ajoute une section “diagnostic rapide” : ps, logs, volumes, network, curl."
      },
      {
        "title": "depends_on ne veut pas dire prêt",
        "tags": [
          "depends_on",
          "healthcheck",
          "startup"
        ],
        "body": [
          "depends_on contrôle l’ordre de démarrage des conteneurs, mais ne garantit pas qu’un service est prêt à accepter les connexions.",
          "MariaDB peut être démarré sans être encore prêt pour WordPress.",
          "Un script d’attente ou un healthcheck évite les échecs aléatoires au premier lancement.",
          "Ce point est fréquent dans les stacks Compose."
        ],
        "code": "docker compose logs mariadb\ndocker compose logs wordpress",
        "mistake": "Croire que depends_on suffit pour initialiser WordPress juste après MariaDB.",
        "tip": "Attends la disponibilité réelle du port ou de la commande SQL avant de lancer l’installation applicative."
      },
      {
        "title": "NGINX vers PHP-FPM",
        "tags": [
          "NGINX",
          "PHP-FPM",
          "fastcgi"
        ],
        "body": [
          "NGINX ne lance pas PHP lui-même : il transmet les requêtes PHP à PHP-FPM.",
          "La cible FastCGI doit être le nom du service WordPress et son port interne PHP-FPM.",
          "Les fichiers WordPress doivent être visibles par les deux côtés selon la configuration retenue.",
          "Une mauvaise directive fastcgi_pass donne souvent une erreur 502."
        ],
        "code": "fastcgi_pass wordpress:9000;\ndocker compose logs nginx",
        "mistake": "Utiliser localhost dans nginx pour joindre PHP-FPM dans un autre conteneur.",
        "tip": "Dans Compose, les services se joignent par nom sur le réseau Docker."
      },
      {
        "title": "Certificat TLS local",
        "tags": [
          "TLS",
          "certificat",
          "openssl"
        ],
        "body": [
          "Le projet demande HTTPS avec TLS moderne, même en local.",
          "Un certificat auto-signé suffit généralement pour un environnement local, mais il doit être correctement référencé par NGINX.",
          "Le navigateur peut avertir que le certificat n’est pas reconnu : ce n’est pas forcément une erreur de configuration serveur.",
          "Il faut pouvoir prouver la version TLS acceptée."
        ],
        "code": "openssl x509 -in certs/site.crt -noout -subject -dates\nopenssl s_client -connect login.42.fr:443 -tls1_2",
        "mistake": "Configurer HTTPS mais laisser aussi HTTP ouvert sur le port 80.",
        "tip": "Teste les ports publiés avec docker compose ps et la négociation TLS avec openssl."
      },
      {
        "title": "Initialisation MariaDB idempotente",
        "tags": [
          "MariaDB",
          "init",
          "idempotence"
        ],
        "body": [
          "L’initialisation doit créer la base et les utilisateurs si nécessaire.",
          "Elle ne doit pas casser si le volume existe déjà et contient des données.",
          "Un script robuste distingue premier démarrage et redémarrage avec données persistantes.",
          "Cette logique évite de devoir nettoyer les volumes à chaque test."
        ],
        "code": "docker compose down\ndocker compose up -d\ndocker logs mariadb",
        "mistake": "Réinitialiser la base à chaque lancement et perdre les données WordPress.",
        "tip": "Teste deux démarrages de suite sans supprimer les volumes."
      },
      {
        "title": "Nettoyage contrôlé",
        "tags": [
          "clean",
          "volumes",
          "Makefile"
        ],
        "body": [
          "Les commandes de nettoyage doivent être explicites sur ce qu’elles suppriment.",
          "Arrêter les conteneurs n’est pas la même chose que supprimer les volumes.",
          "Un fclean destructeur doit être assumé et documenté.",
          "Cela évite d’effacer des données persistantes par accident."
        ],
        "code": "docker compose down\ndocker compose down -v\ndocker system prune -a",
        "mistake": "Utiliser une cible clean qui supprime les volumes sans prévenir.",
        "tip": "Sépare down, clean images et clean volumes dans le Makefile."
      },
      {
        "title": "Audit rapide Inception",
        "tags": [
          "audit",
          "défense",
          "docker"
        ],
        "body": [
          "Avant la défense, prépare une séquence de vérifications qui prouve toute l’infrastructure.",
          "Tu dois montrer les services, ports publiés, volumes, réseau, logs, certificats et utilisateurs WordPress.",
          "Une stack Docker correcte doit être observable sans ouvrir tous les fichiers.",
          "Les commandes d’audit doivent être dans ton README ou faciles à retrouver."
        ],
        "code": "docker compose ps\ndocker network inspect inception\ndocker volume ls\ncurl -k https://login.42.fr\ndocker compose logs --tail=50",
        "mistake": "Ne tester que l’affichage du site dans le navigateur.",
        "tip": "Le navigateur prouve le symptôme ; les commandes Docker prouvent l’architecture."
      }
    ]
  }
];
