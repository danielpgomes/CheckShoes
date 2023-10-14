const e = require('express')
const express = require('express')
const app = express()
const port = 9001
// module FileSystem pour lire, écrire des fichiers...
const fs = require('fs').promises
// module pour travailler les chemins de fichier
const path = require('path')

// chemin à changer en respectant le standard EPCIS 2.0
app.get('/', async (req, res) => {
  
  // attention le repertoire ou est stocké les fichiers sont pas les mêmes chez vous !!!
  const diretoryPath = 'C:/Users/Luca/Desktop/CheckShoes/eventfiles';
  
  try {
    // récupère les fichiers du directory
    const files = await fs.readdir(diretoryPath);

    const events = [];

    // parcourir les fichiers
    for (const file of files){

      // gère déjà les chemins de fichier en parcourant le directory
      const filePath = path.join(diretoryPath, file);
      try{
        // lire le fichier en fichier txt
        const data = await fs.readFile(filePath, 'utf8');
        // serialize le fichier txt 
        const event = JSON.parse(data);
        // ajoute un event
        events.push(event);
      } catch (readError) {
        console.error('Error reading files', readError);
      }
    }
    // la liste d'event en json dans le HTTP  
    res.json(events);

  } catch(error) {
    res.status(500).send('Error reading directory' + error);
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})