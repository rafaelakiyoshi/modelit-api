FROM node:0.12
COPY /src /src
RUN cd /src; npm install
ADD /src /src
WORKDIR /src

EXPOSE 3000
CMD [ "node", "/src/index.js" ]
