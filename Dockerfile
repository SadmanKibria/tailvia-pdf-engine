FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN curl -L https://github.com/typst/typst/releases/download/v0.11.0/typst-x86_64-linux.tar.xz | tar -xJ && mv typst /usr/local/bin/typst
EXPOSE 3000
CMD ["node", "server.js"]
