
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://m220student:m220password@mflix-thkh3.mongodb.net";
const fs = require("fs");
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  if (err) {
    return console.log("UPPPPS", err)
  }
  const collection = client.db("sample_mflix").collection("movies");
  collection.find({
    imdb: { $exists: true },
    tomatoes: { $exists: true },
    "tomatoes.viewer": { $exists: true },
    "tomatoes.critic": { $exists: true },
    metacritic: { $exists: true }, year: { $gt: 1975 }
  },
    { projection: { title: 1, _id: 0, year: 1, genres: 1, directors: 1, poster: 1, cast: 1, plot: 1, imdb: 1, tomatoes: 1, metacritic: 1 } }
  ).limit(500).
    toArray()
    .then(data => {
      // const dataAsStr = JSON.stringify(a);
      // const data = JSON.parse(dataAsStr);
      let all = {};
      data.forEach(e => {
        all[e.title] = e;

      });

      const str = JSON.stringify(all)
      fs.writeFileSync("dataFile.json", str);
      //console.log(str); client.close()
    })
    .catch(e => { console.log("UPPPS", e); client.close() })


  // perform actions on the collection object
  //client.close();
});