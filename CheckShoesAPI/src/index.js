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
async function recherche(req, res) {
  const numeroRecherche = req.params.numero;
  const diretoryPath = 'C:/CheckShoesv1/CheckShoes/eventfiles';

  try {
    const files = await fs.readdir(diretoryPath);
    const events = [];

    for (const file of files) {
      const filePath = path.join(diretoryPath, file);

      try {
        const data = await fs.readFile(filePath, 'utf8');
        const event = JSON.parse(data);

        for (const epc of event.epcisBody.eventList[0].epcList) {
          const parts = epc.split('/');
          const numeroEPC = parts[4];
          if (numeroEPC === numeroRecherche) {
            console.log('Fichier correspondant trouvé :', file);
            console.log('Contenu du fichier :', event);
            events.push(event);
          }
        }
      } catch (readError) {
        console.error('Error reading files', readError);
      }
    }

    if (events.length > 0) {
      res.json(events);
    } else {
      res.status(404).json({
        type: "epcisException:NoSuchResourceException",
        title: "Resource not found",
        status: 404
      });
    }
  } catch (error) {
    res.status(500).send('Error reading directory' + error);
  }
}

// Utilisation de la fonction recherche pour la route en respectant le standard EPCIS 2.0
app.get('/queries/:numero', recherche);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})