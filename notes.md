watcher.js -> newHackedServers.txt -> rem.js
									  |
									  financialAnalysis()
									  taskDispatcher()

Comportement voulu :
* Prioritaire : Monte à 90% puis bloque, on ne relance rien sur ce serveur tant vague pas terminé
* Pas prioritaire : boucle

Possibilité : Stocker les prioritaires séparemment, les exécuter une fois et les mettre dans une liste "blocage" qui empêche de les réajouter dans la liste prioritaire