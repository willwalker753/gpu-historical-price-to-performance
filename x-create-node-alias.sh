alias nodebox='docker run -it --rm -u "$UID" --name nodebox -v "$PWD":/usr/nodebox -w /usr/nodebox node:23.5-bookworm-slim $@'

echo 'You can now run node commands through docker. Just prepend the command you would normally run with "nodebox".'
echo 'Example usage: nodebox npm -v'