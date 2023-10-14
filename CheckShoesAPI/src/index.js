const express = require('express')
const app = express()
const port = 9001
// module FileSystem pour lire, écrire des fichiers...
const fs = require('fs')
// module pour travailler les chemins de fichier
const path = require('path')

// chemin à changer en respectant le standard EPCIS 2.0
app.get('/', (req, res) => {
  
  // attention le repertoire ou est stocké les fichiers sont pas les mêmes chez vous !!!
  const diretoryPath = 'C:/Users/Luca/Desktop/CheckShoes/eventfiles';
  
  // méthode pour lire les directory
  fs.readdir(diretoryPath, (error, files) => {
    if (error) {
      res.status(500).send('erreur avec le répertoire' + error)
    } else {
      // stocker les events
      const events = [];

      files.forEach((file) => {
        // joindre tous les fichiers du repertoire
        const filepath = path.join(diretoryPath, file);

        // block try and catch pour voir ou est le problème 
        try{
          // lire les fichiers en utf-8 
          const data = fs.readFileSync(filepath, 'utf8');
          // parser les fichiers txt en JSON
          const event = JSON.parse(data);
          // ajouter un event en json object dans la liste events
          events.push(event);
          // gérer les erreurs 
        } catch (readError) {
          console.error('erreur avec les datas' + readError);
        }
      })
      // retourer le résultats en HTTP 
      res.json(events);
    }
  })
  
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})