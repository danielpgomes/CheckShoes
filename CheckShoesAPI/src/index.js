const e = require('express')
const express = require('express')
const app = express()
const port = 9001
// module FileSystem pour lire, écrire des fichiers...
const fs = require('fs').promises
// module pour travailler les chemins de fichier
const path = require('path')
const { EventEmitter } = require('stream')


// création de la fonction pour appel
async function poll(req, res) {
  const numeroRecherche = req.params.numero;
  // changer le chemin où se trouvent les eventfiles car ils sont stockés en local
  const diretoryPath = 'C:/CheckShoesv1/CheckShoes/eventfiles';
  // recherche et lecture des fichiers json dans le dossier "eventfiles"
  try {
    const files = await fs.readdir(diretoryPath);
    const events = [];

    for (const file of files) {
      const filePath = path.join(diretoryPath, file);

      try {
        const data = await fs.readFile(filePath, 'utf8');
        const event = JSON.parse(data);

        // parcourir les .json et trouver le champ que nous souhaitons
        for (const epc of event.epcisBody.eventList[0].epcList) {
          // pour aller au bon endroit du lien
          const parts = epc.split('/');
          const numero_sGTIN = parts[4];
          // si un numéro est trouvé, alors nous ajoutons le fichier à la liste des événements
          if (numero_sGTIN === numeroRecherche) {
            events.push(event);
          }
        }
      } catch (readError) {
        console.error('Error reading files', readError);
      }
    }
    // si au moins un fichier est trouvé, nous affichons la liste en json
    if (events.length > 0) {
      res.json(events);
    } else {
      // Si la liste est vide, renvoyer simplement une liste vide (M.Stübi)
        res.json([]);
      }
  } catch (error) {
    res.status(500).send('Error reading directory' + error);
  }
}
// Utilisation de la fonction recherche pour la route en respectant le standard EPCIS 2.0
app.get('/queries/:numero', poll);



app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
