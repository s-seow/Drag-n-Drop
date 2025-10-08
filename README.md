# Drag'n'Drop
Drag'n'Drop is a Kanban Board-style project manager. This full-stack web application makes use of a frontend in Angular, backend in Node.js and database in MongoDB. 

## How to Run


### Other useful commands
```bash 
# see container status
docker compose ps

# live logs
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo

# rebuild (after changing code or Dockerfiles)
docker compose build frontend
docker compose build backend
docker compose up -d

# clean restart
docker compose down
docker compose up -d

# stop all
docker compose down

# full nuke volumes (deletes Mongo data!)
docker compose down -v
```





