# En quoi consiste ce site web ?

Ce site web est à titre pédagogique. A la fois utile pour les utilisateurs de Linux tels que les étudiants et les professionnels. N'ayez plus aucune appréhension avec la commande ``chmod [permissions] [cible]``.

Ce site web est également déployé à titre démonstratif de ce qui est faisable avec les bases du web.

[Vous pouvez consulter le site web déployé avec Netlify ici](https://chmod-calculator.netlify.app/)

# Comment fonctionne CHMOD Calculator ?

C'est assez simple.

Chaque liste de permissions Linux sont représentées par ces suites de caractères :
``-r-x------``
``drw-rw-r--``
...

en réalité, il prennent tous comme pattern celui ci : ``-rwxrwxrwx`` ou ``drwxrwxrwx``

> Le ``d`` signifie seulement que le document est un dossier.
> Le ``-`` est juste l'absence de permission.
> Les ``r`` correspondent à la permission de __Lire__ le document (read).
> Les ``w`` correspondent à la permission de __Modifier__ le document (write).
> Les ``x`` correspondent à la permission d'__Exécuter__ le document (execute).

Pour la suite ``rwxrwxrwx`` il faut savoir qu'il est divisé en 3 parties :
- ``rwx`` ``rwx`` et ``rwx``
1) le premier désigne les permissions du **propriétaire** du document
2) le deuxième désigne les permissions du **groupe**
3) le troisième désigne les permissions des **autres**

Concentrons nous davantage sur les valeurs ``r`` ``w`` et ``x`` :
- ``r`` a pour valeur **4**
- ``w`` a pour valeur **2**
- ``x`` a pour valeur **1**

Ces valeurs sont activées par binaire. En effet, quand on lit ``drwxrwxrwx`` nous lisons en réalité ``1111111111``.

Par exemple :
- ``-rw-r-----`` = ``0110100000``

**Le mieux est de fermer les yeux sur la première valeur (``d``) puisqu'elle est gérée automatiquement par Linux.**

De ce fait, si notre permission ressemble à ``0110100100`` alors les valeurs utilisées sont **4**, **2**, **4** et **4**.

Cependant il faut toujours garder à l'esprit que nos valeurs sont séparés en 3 parties. Il faut donc additionner les valeurs obtenues par le binaire entre groupe.

Dans notre situation ce sera :
- **4** + **2** = **6**
- **4**
- **4**

La finalité de ces opérations n'est plus que la concaténation de ces résultats : **644** (**6** + **4** + **4**).
Que nous pourrons utiliser dans la commande tel que : ``chmod 644 [document cible]`` .

### Un dernier exemple pour la route ?

Nous voulons que __code.js__ soit lisible et modifiable par tous mais que son exécution ne soit possible que par son propriétaire.

1) En d'autres termes nous voulons cette permission : ``-rwx-rw-rw-``
2) Pour se faire on regarde le binaire : ``01110110110``
3) Maintenant, en divisant les groupes, les valeurs associées de chaque bit à ``1`` :
**0 421 42 42**

4) On additionne les valeurs par groupe :
- **4** + **2** + **1** = **7**
- **4** + **2** = **6**
- **4** + **2** = **6**

5) On concatène : **7** + **6** + **6** = **766**
6) Et enfin, on prépare notre commande : ``chmod 766 code.js``
