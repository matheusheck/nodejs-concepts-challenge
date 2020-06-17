const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const requestBody = request.body;

  function repositoryFactory(requestBody){
    const { title, url, techs } = requestBody;
    const likes = 0;
    const id = uuid();
    const repository = {id, title, url, techs, likes};
    return repository;
  }
  
  const newRepo = repositoryFactory(requestBody);

  repositories.push(newRepo);
  return response.json(newRepo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository=>repository.id ===id);
  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found'});
  }
  const repository = repositories[repositoryIndex];
  const likes = repository.likes;

  const { title, url, techs } = request.body;


  const result = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = result;
  return response.json(result);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository=>repository.id ===id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found'});
  }
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).json({Sucess: 'Repository deletted'});

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository=>repository.id ===id);

  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found'});
  }
  
  function newLike(repositoryIndex){
    const repository = repositories[repositoryIndex];
    repository.likes ++;
    return repository;
  }

  
  return response.json(newLike(repositoryIndex));


});


module.exports = app;
