FROM node:20-slim
WORKDIR /app
COPY . .
RUN npm install
RUN curl -L https://github.com/typst/typst/releases/download/v0.11.0/typst-x86_64-unknown-linux-musl.tar.gz | tar -xz && mv typst-x86_64-unknown-linux-musl/typst /usr/local/bin/typst
EXPOSE 3000
CMD ["node", "server.js"]
