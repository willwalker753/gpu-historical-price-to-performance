startPath="$PWD"
scriptPath="$(dirname "${BASH_SOURCE[0]}")"

cd $scriptPath

docker compose down
docker compose up -d
docker compose logs -f

cd $startPath