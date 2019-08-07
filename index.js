// Libraries
const express = require("express");

// Other files
const db = require("./data/hubs-model.js");

// globals
const server = express();

//Middleware
server.use(express.json());

// Request Handlers

//Get /
// What is my datatype?
// What is my status code?
// What am I sending back?
server.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// Get /now
// send back a timestamp
server.get("/now", (req, res) => {
  const now = new Date().toLocaleTimeString();
  res.send(now);
});

// Get /hubs
// Send back a master list of all hubs
server.get("/hubs", (req, res) => {
  db.find()
    .then(hubs => {
      //console.log(hubs)
      res.json(hubs);
    })
    .catch(err => {
      res.status(500).json({
        err: err
      });
    });
});

//Post /
//Add a new hub
server.post("/hubs", (req, res) => {
  //req.body is not automatically defined
  const newHub = req.body;
  // validate the hub
  db.add(newHub)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(err => {
      res.status(500).json({
        err: err,
        message: "Failed to create new hub"
      });
    });
});

//Destroy/Delete, but DESTROY
server.delete("/hubs/:id", (req, res) => {
  const { id } = req.params;
  //const id = req.params.id

  db.remove(id)
    .then(deletedHub => {
      if (deletedHub) {
        res.json(deletedHub);
      } else {
        res.status(418).json({
          message: "invalid hub id"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        err: err,
        message: "Failed to DESTROY hub"
      });
    });
});

//PUT /hubs/:id
server.put("/hubs/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.update(id, changes)
    .then(updatedHub => {
      if (updatedHub) {
        res.json(updatedHub);
      } else {
        res.status(418).json({
          message: "invalid hub id"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        err: err,
        message: "failed to update hub"
      });
    });
});

//Get by ID
server.get("/hubs/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(hub => {
      if (hub) {
        res.json(hub);
      } else {
        res.status(418).json({
          message: "invalid hub id"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        err: err,
        message: "failed to find hub"
      });
    });
});

// Should be the last step
server.listen(4000, () => {
  console.log("Server is running on port 4000...");
});
