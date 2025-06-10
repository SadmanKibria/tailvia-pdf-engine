FROM node:20-slim

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y curl tar xz-utils

RUN npm install

RUN curl -L https://github.com/typst/typst/releases/download/v0.13.1/typst-x86_64-unknown-linux-musl.tar.xz \
  -o typst.tar.xz && \
  tar -xf typst.tar.xz && \
  mv typst-x86_64-unknown-linux-musl/typst /usr/local/bin/typst

EXPOSE 3000

CMD ["node", "server.js"]
