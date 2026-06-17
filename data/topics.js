window.SYSADMIN_TOPICS = [
  {
    id: "born2beroot",
    number: "05",
    title: "05 - Born2beRoot",
    shortTitle: "05 Serveur",
    focus: "VM, sécurité, monitoring",
    status: "Sujet analysé",
    summary:
      "Mettre en place une première machine serveur propre, sécurisée et explicable : installation minimale, partitions chiffrées, utilisateurs, sudo, SSH, pare-feu, politique de mots de passe, script de monitoring et signature du disque.",
    objectives: [
      "Comprendre chaque choix d’installation au lieu de seulement suivre une checklist.",
      "Savoir prouver que la VM est isolée, sécurisée et administrable.",
      "Préparer les commandes utiles pour la défense : utilisateurs, groupes, ports, services, logs et cron.",
      "Documenter clairement les choix dans un README et fournir uniquement les fichiers attendus."
    ],
    concepts: [
      {
        title: "VM minimale sans interface graphique",
        tags: ["VirtualBox", "UTM", "serveur", "TTY"],
        body: [
          "Le projet attend une machine virtuelle serveur, pas un poste de travail complet.",
          "Une installation minimale réduit la surface d’attaque et force à comprendre les commandes système.",
          "Pendant la défense, il faut pouvoir expliquer pourquoi le serveur n’a pas besoin d’interface graphique."
        ],
        code: "hostnamectl\nuname -a\nlsblk",
        mistake: "Installer un environnement desktop complet par confort.",
        tip: "Prépare les commandes qui prouvent l’OS, le noyau, le hostname et la structure disque."
      },
      {
        title: "Debian ou Rocky : choix assumé",
        tags: ["Debian", "Rocky", "distribution"],
        body: [
          "Le sujet laisse choisir entre deux familles de distribution.",
          "Debian est souvent plus directe pour ce projet ; Rocky demande de maîtriser SELinux et firewalld.",
          "Le README doit expliquer le choix, les avantages et les limites."
        ],
        code: "cat /etc/os-release",
        mistake: "Choisir une distribution sans pouvoir comparer les implications.",
        tip: "Prépare un paragraphe court : gestionnaire de paquets, sécurité, firewall, documentation."
      },
      {
        title: "LVM et partitions chiffrées",
        tags: ["LVM", "chiffrement", "partitions"],
        body: [
          "LVM ajoute une couche flexible entre disques physiques, groupes de volumes et volumes logiques.",
          "Le chiffrement protège les données si le disque est récupéré hors de la VM.",
          "Il faut savoir lire la structure avec les outils système, pas seulement montrer l’installateur."
        ],
        code: "lsblk\nsudo lvdisplay\nsudo vgdisplay",
        mistake: "Ne pas savoir expliquer la différence entre partition, volume physique, volume group et logical volume.",
        tip: "Dessine rapidement la chaîne disque -> chiffrement -> LVM -> points de montage."
      },
      {
        title: "AppArmor ou SELinux",
        tags: ["AppArmor", "SELinux", "MAC"],
        body: [
          "Ces outils ajoutent un contrôle d’accès obligatoire en plus des permissions Unix classiques.",
          "Sur Debian, AppArmor est le réflexe attendu ; sur Rocky, SELinux doit être actif et cohérent.",
          "La défense peut demander de vérifier l’état du module de sécurité."
        ],
        code: "sudo aa-status\ngetenforce",
        mistake: "Confondre pare-feu et contrôle d’accès obligatoire.",
        tip: "Explique simplement : le firewall contrôle le réseau, AppArmor/SELinux contrôlent ce que les processus peuvent faire."
      },
      {
        title: "SSH sur un port dédié, sans root",
        tags: ["SSH", "sshd", "port 4242"],
        body: [
          "SSH doit permettre l’administration distante tout en limitant les risques.",
          "Le service écoute sur le port demandé et la connexion directe en root est refusée.",
          "Il faut savoir modifier et redémarrer sshd proprement."
        ],
        code: "sudo systemctl status ssh\nsudo ss -tlnp | grep 4242\nsudo grep -E 'Port|PermitRootLogin' /etc/ssh/sshd_config",
        mistake: "Changer le port SSH mais oublier d’ouvrir le pare-feu.",
        tip: "Teste toujours service + port écouté + règle firewall + connexion utilisateur."
      },
      {
        title: "UFW ou firewalld",
        tags: ["UFW", "firewalld", "firewall"],
        body: [
          "Le pare-feu doit être actif dès le démarrage.",
          "Seul le port nécessaire à l’administration distante doit rester ouvert.",
          "La commande dépend de la distribution choisie."
        ],
        code: "sudo ufw status verbose\nsudo firewall-cmd --list-all",
        mistake: "Autoriser trop de ports pour éviter les problèmes de connexion.",
        tip: "Garde une règle minimale et sais expliquer pourquoi chaque port est ouvert."
      },
      {
        title: "Hostname et utilisateur principal",
        tags: ["hostname", "useradd", "groups"],
        body: [
          "La VM doit avoir un nom conforme au login demandé.",
          "Un utilisateur non-root doit exister et appartenir aux groupes attendus.",
          "Pendant la défense, on peut te demander de créer un nouvel utilisateur et de l’ajouter à un groupe."
        ],
        code: "hostnamectl\nid $USER\nsudo adduser trainee\nsudo usermod -aG sudo,user42 trainee",
        mistake: "Modifier /etc/hostname sans vérifier /etc/hosts ou sans redémarrer le service concerné.",
        tip: "Prépare aussi les commandes deluser, groupadd, usermod et getent group."
      },
      {
        title: "Politique de mots de passe",
        tags: ["PAM", "login.defs", "pwquality"],
        body: [
          "La politique mélange expiration, délai de changement, avertissement et complexité.",
          "Les règles globales se trouvent souvent dans login.defs et PAM.",
          "Les comptes déjà créés doivent aussi respecter la politique."
        ],
        code: "sudo chage -l username\nsudo grep -E 'PASS_MAX_DAYS|PASS_MIN_DAYS|PASS_WARN_AGE' /etc/login.defs",
        mistake: "Configurer la politique après la création des utilisateurs sans corriger les comptes existants.",
        tip: "Vérifie root et l’utilisateur principal avec chage -l."
      },
      {
        title: "Configuration sudo stricte",
        tags: ["sudoers", "secure_path", "logs"],
        body: [
          "sudo doit limiter les tentatives, afficher un message d’erreur personnalisé et journaliser les actions.",
          "Les entrées et sorties peuvent être loguées dans un dossier dédié.",
          "secure_path réduit les risques liés à un PATH manipulé."
        ],
        code: "sudo visudo\nsudo -l\nsudo ls /var/log/sudo",
        mistake: "Modifier sudoers directement avec un éditeur normal et casser sudo.",
        tip: "Utilise toujours visudo, puis teste sudo -l avec l’utilisateur concerné."
      },
      {
        title: "monitoring.sh",
        tags: ["bash", "wall", "cron", "monitoring"],
        body: [
          "Le script doit afficher périodiquement les informations système sur les terminaux.",
          "Il faut comprendre chaque commande : architecture, CPU, RAM, disque, LVM, connexions, réseau et sudo.",
          "cron permet de planifier l’exécution sans modifier le script."
        ],
        code: "sudo crontab -l\nsudo systemctl status cron\nwall \"test broadcast\"",
        mistake: "Écrire un script qui affiche les bonnes lignes mais sans savoir d’où vient chaque valeur.",
        tip: "Commente mentalement chaque commande : source de donnée, formatage, limite."
      },
      {
        title: "Signature du disque",
        tags: ["signature.txt", "sha1", "soumission"],
        body: [
          "Le dépôt ne doit pas contenir la VM ni son disque.",
          "La soumission repose sur une signature du disque virtuel.",
          "Démarrer ou modifier la VM peut changer la signature : il faut gérer ce point avant l’évaluation."
        ],
        code: "sha1sum machine.vdi > signature.txt",
        mistake: "Relancer la VM après avoir généré la signature sans la recalculer.",
        tip: "Garde une copie stable du disque ou recalcule la signature au dernier moment."
      },
      {
        title: "README de défense",
        tags: ["README", "documentation", "défense"],
        body: [
          "Le README doit expliquer le but, les choix techniques, les ressources et l’usage de l’IA si applicable.",
          "Il doit aussi comparer les alternatives demandées : distributions, sécurité, firewall et virtualisation.",
          "Un bon README prépare les réponses de défense."
        ],
        code: "README.md\nsignature.txt",
        mistake: "Faire un README de commandes sans explication des choix.",
        tip: "Structure le README comme une défense écrite : choix, installation, vérifications, sources, limites."
      }
    ]
  },
  {
    id: "net-practice",
    number: "06",
    title: "06 - Net_Practice",
    shortTitle: "06 Réseau",
    focus: "TCP/IP, masques, routes",
    status: "Sujet analysé",
    summary:
      "Résoudre dix configurations réseau simulées en comprenant l’adressage TCP/IP, les masques, les sous-réseaux, les routeurs, les passerelles et les routes. L’objectif est de raisonner, pas de deviner les champs.",
    objectives: [
      "Calculer réseau, broadcast et plage utilisable à partir d’une IP et d’un masque.",
      "Choisir une passerelle cohérente selon le sous-réseau de la machine.",
      "Comprendre le rôle des routeurs, interfaces, switches et routes.",
      "Exporter une configuration par niveau et préparer les niveaux aléatoires de défense."
    ],
    concepts: [
      {
        title: "Adresse IP et masque",
        tags: ["IPv4", "masque", "CIDR"],
        body: [
          "Une adresse IP identifie une interface, pas une machine entière.",
          "Le masque indique quelle partie correspond au réseau et quelle partie correspond aux hôtes.",
          "Deux interfaces communiquent directement seulement si elles partagent un sous-réseau compatible."
        ],
        code: "192.168.1.42/24\nréseau: 192.168.1.0\nhôtes: 192.168.1.1 à 192.168.1.254",
        mistake: "Comparer seulement les trois premiers octets sans tenir compte du masque.",
        tip: "Convertis mentalement les masques courants : /24, /25, /26, /27, /28, /30."
      },
      {
        title: "Réseau, broadcast, hôtes utilisables",
        tags: ["network", "broadcast", "range"],
        body: [
          "L’adresse réseau représente le sous-réseau lui-même.",
          "L’adresse broadcast représente tous les hôtes du sous-réseau.",
          "Aucune des deux ne doit être donnée à une interface hôte."
        ],
        code: "/30 donne 4 adresses : réseau, 2 hôtes utilisables, broadcast",
        mistake: "Attribuer l’adresse réseau ou broadcast à un host ou une passerelle.",
        tip: "Sur /30, les deux adresses du milieu sont presque toujours les seules utilisables."
      },
      {
        title: "Passerelle par défaut",
        tags: ["gateway", "default route", "route"],
        body: [
          "La passerelle est l’adresse d’un routeur accessible depuis le sous-réseau local.",
          "Elle sert à joindre les réseaux qui ne sont pas directement connectés.",
          "Une gateway hors sous-réseau local est invalide."
        ],
        code: "host: 10.0.0.10/24\ngateway possible: 10.0.0.1\npas possible: 10.0.1.1",
        mistake: "Mettre comme gateway une adresse qui n’est pas dans le réseau de l’interface.",
        tip: "Avant de définir une route, vérifie que la gateway est joignable localement."
      },
      {
        title: "Routeur et interfaces",
        tags: ["router", "interface", "réseaux"],
        body: [
          "Un routeur relie plusieurs réseaux grâce à plusieurs interfaces.",
          "Chaque interface du routeur appartient au sous-réseau du segment auquel elle est connectée.",
          "Le routeur peut transmettre entre ses réseaux si les routes sont cohérentes."
        ],
        code: "R1 eth0: 192.168.1.1/24\nR1 eth1: 10.0.0.1/24",
        mistake: "Mettre deux interfaces d’un même routeur dans le même sous-réseau sans nécessité.",
        tip: "Nomme mentalement chaque lien : réseau A, réseau B, réseau C."
      },
      {
        title: "Switch",
        tags: ["switch", "LAN", "niveau 2"],
        body: [
          "Un switch relie des machines dans un même réseau local.",
          "Il ne remplace pas une gateway pour sortir vers un autre sous-réseau.",
          "Dans les exercices, il sert surtout à regrouper des hosts sur un segment commun."
        ],
        code: "Host A -- Switch -- Host B\nMême sous-réseau requis pour parler directement.",
        mistake: "Attendre d’un switch qu’il route entre deux sous-réseaux.",
        tip: "Switch = même réseau. Routeur = passage entre réseaux."
      },
      {
        title: "Routes explicites",
        tags: ["route", "destination", "next hop"],
        body: [
          "Une route indique vers quel next hop envoyer un réseau de destination.",
          "La route par défaut couvre tout ce qui n’a pas de route plus précise.",
          "Les routeurs intermédiaires doivent aussi connaître le chemin retour."
        ],
        code: "destination: 0.0.0.0/0\nnext hop: 192.168.1.1",
        mistake: "Configurer l’aller mais oublier la route de retour.",
        tip: "Pour chaque ping mental, vérifie aller et retour."
      },
      {
        title: "Sous-réseaux qui se chevauchent",
        tags: ["overlap", "subnet", "erreur"],
        body: [
          "Deux réseaux qui se chevauchent créent une ambiguïté de routage.",
          "Un routeur ou une interface peut alors croire qu’une adresse est locale alors qu’elle ne devrait pas l’être.",
          "Les niveaux avancés piègent souvent sur les masques trop larges."
        ],
        code: "10.0.0.0/24 chevauche 10.0.0.128/25",
        mistake: "Choisir un masque large pour “faire passer” plus d’adresses.",
        tip: "Vérifie que chaque segment a une plage distincte et minimale."
      },
      {
        title: "Réseaux privés",
        tags: ["RFC1918", "private", "public"],
        body: [
          "Les plages privées sont réservées aux réseaux internes.",
          "Elles reviennent souvent dans les exercices et ne sont pas routées directement sur Internet réel.",
          "Il faut aussi reconnaître quand une adresse appartient à une plage publique simulée."
        ],
        code: "10.0.0.0/8\n172.16.0.0/12\n192.168.0.0/16",
        mistake: "Croire que toute adresse en 172.* est privée.",
        tip: "La plage privée 172 commence à 172.16 et finit à 172.31."
      },
      {
        title: "Méthode de résolution d’un niveau",
        tags: ["méthode", "levels", "debug"],
        body: [
          "Commence par identifier les segments physiques : hosts, switches, interfaces de routeur.",
          "Calcule ensuite le sous-réseau de chaque segment.",
          "Ajoute les gateways et routes seulement quand les adresses locales sont cohérentes."
        ],
        code: "1. Segment\n2. Masque\n3. Plage valide\n4. Gateway\n5. Route retour",
        mistake: "Modifier tous les champs en même temps et ne plus savoir ce qui a corrigé ou cassé.",
        tip: "Procède de gauche à droite, puis vérifie chaque lien avec un raisonnement aller-retour."
      },
      {
        title: "Export des configurations",
        tags: ["export", "submission", "10 levels"],
        body: [
          "Chaque niveau réussi doit être exporté dans un fichier dédié.",
          "Le login saisi dans l’interface compte pour générer la bonne configuration.",
          "La soumission attend un fichier par niveau à la racine du dépôt."
        ],
        code: "level1.json\nlevel2.json\n...\nlevel10.json",
        mistake: "Réussir un niveau puis passer au suivant sans exporter.",
        tip: "Après chaque réussite : exporter, renommer clairement, vérifier que le fichier est à la racine."
      },
      {
        title: "Défense : niveaux 6 à 10",
        tags: ["défense", "random", "évaluation"],
        body: [
          "La défense peut demander de résoudre des niveaux aléatoires parmi les plus avancés.",
          "Il faut donc maîtriser les calculs plutôt qu’apprendre les réponses par coeur.",
          "Les erreurs de gateway et de masque sont les plus fréquentes."
        ],
        code: "gateway locale ?\nmasque cohérent ?\nroute retour ?",
        mistake: "Mémoriser des configurations statiques au lieu de comprendre le calcul.",
        tip: "Entraîne-toi à expliquer chaque champ modifié en une phrase."
      }
    ]
  },
  {
    id: "inception",
    number: "07",
    title: "07 - Inception",
    shortTitle: "07 Docker",
    focus: "Docker Compose, services, secrets",
    status: "Sujet analysé",
    summary:
      "Construire une petite infrastructure Docker composée de NGINX, WordPress/PHP-FPM et MariaDB, avec images construites localement, réseau dédié, volumes persistants, variables d’environnement, secrets et Makefile.",
    objectives: [
      "Comprendre la différence entre VM, image, conteneur, volume et réseau Docker.",
      "Écrire des Dockerfiles par service et orchestrer l’ensemble avec Docker Compose.",
      "Sécuriser l’entrée via NGINX en TLS sur le port 443 uniquement.",
      "Gérer configuration, secrets, utilisateurs WordPress et persistance sans mots de passe hardcodés."
    ],
    concepts: [
      {
        title: "Docker n’est pas une VM",
        tags: ["Docker", "VM", "container"],
        body: [
          "Un conteneur partage le noyau de l’hôte, alors qu’une VM embarque un système plus complet.",
          "Un conteneur doit exécuter un processus principal clair.",
          "Cette différence explique pourquoi il faut éviter de gérer un conteneur comme une mini-machine interactive."
        ],
        code: "docker ps\ndocker logs service\ndocker exec -it service sh",
        mistake: "Installer plusieurs services sans lien dans un seul conteneur.",
        tip: "Un service principal par conteneur : NGINX, WordPress/PHP-FPM, MariaDB."
      },
      {
        title: "Images construites localement",
        tags: ["Dockerfile", "image", "build"],
        body: [
          "Chaque service doit avoir son Dockerfile.",
          "Les images applicatives doivent être construites par le projet, pas tirées toutes prêtes.",
          "Le nom d’image doit rester cohérent avec le service."
        ],
        code: "docker compose build\ndocker images",
        mistake: "Utiliser une image prête à l’emploi pour WordPress, MariaDB ou NGINX.",
        tip: "Base OS autorisée, puis installation et configuration dans ton Dockerfile."
      },
      {
        title: "docker-compose.yml",
        tags: ["compose", "services", "orchestration"],
        body: [
          "Compose décrit les services, volumes, réseaux, variables et politiques de redémarrage.",
          "Il relie les conteneurs sans utiliser le réseau host ni les anciens links.",
          "Le fichier doit être appelé par le Makefile pour construire et lancer l’infrastructure."
        ],
        code: "docker compose config\ndocker compose up -d --build",
        mistake: "Lancer les conteneurs à la main et ne pas rendre la stack reproductible.",
        tip: "docker compose config est utile pour voir la configuration finale interpolée."
      },
      {
        title: "Makefile",
        tags: ["Makefile", "build", "automation"],
        body: [
          "Le Makefile doit piloter la construction et le lancement.",
          "Il sert d’interface simple pour l’évaluateur ou l’administrateur.",
          "Les cibles classiques sont up, down, build, clean et fclean selon ton choix."
        ],
        code: "make\nmake down\nmake clean",
        mistake: "Avoir des commandes qui marchent seulement si on les connaît déjà.",
        tip: "Fais de make la porte d’entrée du projet."
      },
      {
        title: "NGINX en TLS, seul point d’entrée",
        tags: ["NGINX", "TLS", "443"],
        body: [
          "NGINX expose l’application vers l’extérieur.",
          "Il doit accepter TLSv1.2 ou TLSv1.3 et être le seul service exposé au port public attendu.",
          "WordPress et MariaDB doivent rester accessibles seulement depuis le réseau Docker interne."
        ],
        code: "docker compose ps\nopenssl s_client -connect login.42.fr:443 -tls1_2",
        mistake: "Exposer MariaDB ou PHP-FPM directement sur l’hôte.",
        tip: "Seul NGINX a besoin d’un port publié vers l’hôte."
      },
      {
        title: "WordPress + PHP-FPM",
        tags: ["WordPress", "PHP-FPM", "service"],
        body: [
          "WordPress tourne dans son conteneur applicatif avec PHP-FPM.",
          "NGINX lui transmet les requêtes dynamiques via le réseau interne.",
          "L’initialisation doit créer le site et les utilisateurs attendus de façon reproductible."
        ],
        code: "docker logs wordpress\ndocker exec -it wordpress wp user list",
        mistake: "Configurer WordPress manuellement dans le navigateur sans script d’initialisation.",
        tip: "Lance, détruis, relance : la stack doit se reconstruire sans manipulations cachées."
      },
      {
        title: "MariaDB seul",
        tags: ["MariaDB", "database", "volume"],
        body: [
          "MariaDB doit avoir son conteneur dédié.",
          "Les données doivent survivre au redémarrage grâce au volume de base de données.",
          "Les identifiants viennent de variables d’environnement ou secrets, pas du Dockerfile."
        ],
        code: "docker exec -it mariadb mariadb -u user -p\ndocker volume ls",
        mistake: "Stocker la base dans le système de fichiers éphémère du conteneur.",
        tip: "Vérifie qu’un down/up conserve les données tant que les volumes ne sont pas supprimés."
      },
      {
        title: "Volumes persistants",
        tags: ["volumes", "data", "bind mount"],
        body: [
          "Un volume garde les données au-delà du cycle de vie d’un conteneur.",
          "Le sujet distingue les données de base et les fichiers du site WordPress.",
          "Les volumes sont attendus dans un emplacement précis lié au login sur la machine hôte."
        ],
        code: "docker volume inspect wordpress_data\ndocker volume inspect mariadb_data",
        mistake: "Confondre image, conteneur et volume.",
        tip: "Image = recette, conteneur = processus, volume = données persistantes."
      },
      {
        title: "Réseau Docker dédié",
        tags: ["network", "bridge", "service names"],
        body: [
          "Un réseau Docker permet aux services de se joindre par nom.",
          "Il évite d’exposer tous les ports sur l’hôte.",
          "L’usage du host network et des links historiques est interdit dans ce projet."
        ],
        code: "docker network ls\ndocker network inspect inception",
        mistake: "Utiliser localhost dans WordPress pour joindre MariaDB.",
        tip: "Dans un conteneur, localhost désigne le conteneur lui-même. Utilise le nom du service MariaDB."
      },
      {
        title: ".env et secrets",
        tags: [".env", "secrets", "variables"],
        body: [
          "La configuration non sensible peut venir du fichier .env.",
          "Les mots de passe et secrets ne doivent pas être hardcodés dans les Dockerfiles.",
          "Les fichiers de secrets doivent être gérés avec prudence et documentés."
        ],
        code: "docker compose config | grep -i password\nls secrets",
        mistake: "Écrire un mot de passe directement dans un Dockerfile ou un script versionné.",
        tip: "Vérifie ton git diff avant commit : aucun vrai secret ne doit apparaître."
      },
      {
        title: "Nom de domaine local",
        tags: ["domain", "hosts", "login.42.fr"],
        body: [
          "Le domaine local doit pointer vers la machine hôte.",
          "La résolution se configure généralement dans /etc/hosts.",
          "NGINX doit servir le site sur ce domaine en HTTPS."
        ],
        code: "grep 42.fr /etc/hosts\ncurl -k https://login.42.fr",
        mistake: "Tester seulement avec localhost alors que le sujet attend le domaine configuré.",
        tip: "Prépare la preuve : /etc/hosts, curl HTTPS, certificat et réponse NGINX."
      },
      {
        title: "Utilisateurs WordPress",
        tags: ["WordPress", "admin", "users"],
        body: [
          "La base WordPress doit contenir deux utilisateurs dont un administrateur.",
          "Le nom de l’administrateur ne doit pas contenir les mots interdits.",
          "Les utilisateurs doivent être créés automatiquement lors de l’initialisation."
        ],
        code: "wp user list --allow-root",
        mistake: "Créer un admin avec un nom refusé ou à la main après lancement.",
        tip: "Teste la création depuis un volume vide, pas seulement après une configuration déjà faite."
      },
      {
        title: "restart policy et PID 1",
        tags: ["restart", "PID 1", "entrypoint"],
        body: [
          "Les conteneurs doivent redémarrer en cas de crash.",
          "Le processus principal du conteneur doit rester au premier plan.",
          "Un mauvais entrypoint peut finir tout de suite ou masquer les signaux."
        ],
        code: "docker inspect service --format '{{.HostConfig.RestartPolicy.Name}}'\ndocker top service",
        mistake: "Lancer un service en arrière-plan puis laisser le conteneur s’arrêter.",
        tip: "Le dernier processus de l’entrypoint doit être le service principal en foreground."
      },
      {
        title: "README d’administration",
        tags: ["README", "ops", "défense"],
        body: [
          "Le README doit expliquer les services, la configuration, les commandes de gestion et les choix techniques.",
          "Il doit comparer Docker avec les VM, réseau Docker avec host network, volumes avec bind mounts.",
          "Il doit aider quelqu’un à reconstruire et administrer la stack."
        ],
        code: "make\nmake down\ndocker compose logs -f",
        mistake: "Écrire un README uniquement narratif sans commandes de vérification.",
        tip: "Ajoute une section “diagnostic rapide” : ps, logs, volumes, network, curl."
      }
    ]
  },
  {
    id: "net-practice-tool",
    number: "NP",
    title: "net_practice.1.9",
    shortTitle: "NP Interface",
    focus: "Outil local d’entraînement",
    status: "Dossier analysé",
    summary:
      "Le dossier d’entraînement contient une interface web locale avec dix niveaux, les scripts de simulation, les pages HTML de chaque niveau et les assets. Il sert à pratiquer et exporter les configurations demandées pour Net_Practice.",
    objectives: [
      "Savoir lancer l’interface locale sans modifier les fichiers fournis.",
      "Comprendre que les niveaux sont des exercices de configuration, pas des réponses à recopier.",
      "Exporter un fichier par niveau après réussite.",
      "Utiliser l’outil comme support de révision des masques, gateways et routes."
    ],
    concepts: [
      {
        title: "Structure du dossier",
        tags: ["HTML", "JS", "levels"],
        body: [
          "Le dossier contient une page d’accueil, dix pages de niveaux, des scripts JavaScript de simulation et des images réseau.",
          "Chaque niveau est associé à sa page et à son script.",
          "Le coeur de l’exercice reste la configuration dans l’interface."
        ],
        code: "index.html\nlevel1.html ... level10.html\njs/level1.js ... js/level10.js",
        mistake: "Modifier les fichiers de l’outil au lieu de résoudre les configurations.",
        tip: "Considère ce dossier comme un simulateur fourni, pas comme du code à corriger."
      },
      {
        title: "Lancer l’interface",
        tags: ["browser", "run.sh", "local"],
        body: [
          "L’interface peut être ouverte dans un navigateur.",
          "Selon le navigateur, un petit serveur local peut être nécessaire pour éviter des restrictions de sécurité.",
          "Le dossier contient aussi un script de lancement prévu à cet effet."
        ],
        code: "cd net_practice\n./run.sh\n# puis ouvrir l’URL indiquée",
        mistake: "Ouvrir un fichier directement puis conclure que l’outil est cassé à cause d’une restriction navigateur.",
        tip: "Si le chargement local échoue, lance le serveur fourni et utilise l’URL locale."
      },
      {
        title: "Login dans l’interface",
        tags: ["login", "config", "export"],
        body: [
          "Le login saisi sert à générer la configuration personnelle.",
          "Il doit être entré avant de résoudre et exporter les niveaux.",
          "Une mauvaise saisie peut produire des fichiers qui ne correspondent pas à l’attendu."
        ],
        code: "Entrer le login\nRésoudre\nExporter",
        mistake: "Exporter des configurations sans avoir renseigné le bon login.",
        tip: "Avant le niveau 1, vérifie le login affiché ou utilisé par l’interface."
      },
      {
        title: "Check again",
        tags: ["validation", "feedback", "debug"],
        body: [
          "Le bouton de vérification indique si la configuration est cohérente.",
          "Les erreurs doivent guider le raisonnement : IP invalide, gateway manquante, route incohérente.",
          "Il faut corriger la cause, pas seulement essayer des valeurs au hasard."
        ],
        code: "Check again -> lire l’erreur -> corriger un champ -> vérifier",
        mistake: "Changer plusieurs champs après chaque erreur sans comprendre le diagnostic.",
        tip: "Note l’erreur et rattache-la à une règle réseau précise."
      },
      {
        title: "Get my config",
        tags: ["export", "fichiers", "soumission"],
        body: [
          "Après réussite, l’export permet de récupérer le fichier de configuration du niveau.",
          "Ces fichiers sont ceux qui doivent être placés dans le dépôt pour la soumission.",
          "Il faut en avoir dix au total."
        ],
        code: "level1.json ... level10.json",
        mistake: "Garder les fichiers dans le dossier de téléchargement sans les copier à la racine du repo.",
        tip: "Après chaque export, déplace et renomme immédiatement le fichier."
      },
      {
        title: "Mode entraînement et mode évaluation",
        tags: ["training", "evaluation", "random"],
        body: [
          "L’interface permet de s’entraîner avec une configuration liée au login.",
          "Elle peut aussi générer des configurations aléatoires utiles pour préparer la défense.",
          "Les niveaux avancés doivent être compris par méthode, pas appris par fichier."
        ],
        code: "training: répétition\nevaluation: configuration aléatoire",
        mistake: "Réviser uniquement les configurations exportées une fois.",
        tip: "Refais plusieurs tirages pour les niveaux 6 à 10."
      },
      {
        title: "Checklist avant soumission",
        tags: ["checklist", "repo", "Net_Practice"],
        body: [
          "La racine du dépôt doit contenir les dix fichiers exportés.",
          "Le README doit expliquer comment lancer l’interface et ce que les fichiers représentent.",
          "Aucun fichier du simulateur n’a besoin d’être copié dans le dépôt si le sujet ne le demande pas."
        ],
        code: "ls level*.json | wc -l",
        mistake: "Soumettre le dossier complet de l’interface au lieu des exports attendus.",
        tip: "La soumission doit rester minimale : README + configurations exportées selon le sujet."
      }
    ]
  }
];
