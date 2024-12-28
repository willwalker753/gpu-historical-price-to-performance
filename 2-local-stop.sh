startPath="$PWD"
scriptPath="$(dirname "${BASH_SOURCE[0]}")"

cd $scriptPath

docker compose down

cd $startPath