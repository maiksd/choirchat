# choirchat

Simple chat app for integration into live streamed choir online rehearsals


## Apache 2.4 VirtualHost directives

I'm serving the main public page through Apache, which then acts as a reverse proxy to forward both the video stream (see USAGE.md) and the chat app to the container. Thus, the local port 8081 is never exposed externally, and all traffic is TLS-encrypted. Both `mod_proxy` and `mod_proxy_wstunnel` are required.

```apache
ProxyPass        /chat http://localhost:8081
ProxyPassReverse /chat http://localhost:8081
ProxyPass        /socket.io ws://localhost:8081/socket.io
ProxyPassReverse /socket.io ws://localhost:8081/socket.io
```

For nginx, please adapt the rules accordingly, and submit a pull request to this documentation :)


## Running the app in deployment

There is a public docker image for this.

```sh
docker rm -f choirchat
docker pull maikm/choirchat
docker run -d --restart always \
        --name choirchat \
        -e "URL_PREFIX=/chat" \
        -e "SOCKET_URL=https://live.example.com/" \
        -p 127.0.0.1:8081:8081 \
        maikm/choirchat
```

For the first run, the `rm` command obviously needs to be omitted.


## Integrating the chat into the web page

```html
<iframe src="https://live.example.com/chat" name="chat"
  width="200" height="850" scrolling="no" frameborder="0"
  webkitallowfullscreen="false" mozallowfullscreen="false"
  allowfullscreen="false"></iframe>
```

## Running the app locally

```sh
docker build -t choirchat . \
  && docker rm -f choirchat \
  && docker run -dp 8081:8081 -e "URL_PREFIX=" -e "SOCKET_URL=http://localhost:8081" --name choirchat choirchat
```

Again, for the first run, the `rm` command obviously needs to be omitted.
