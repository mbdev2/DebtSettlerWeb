# DebtSettlerWeb

## _The Last Spending App You Will Ever Need!_

This repo contains the React WEB APP portion of our project. We also created an universal mobile app and a REST API.

Flutter Mobile APP: TBD

REST API: https://github.com/mbdev2/DebtSettlerServer

DebtSettler is a cloud-enabled and mobile-ready household spending tracker designed for use in dorms and shared apartments.
Developed by Mark Breznik and Blaž Pridgar for a course in our gradute study program at the Faculty of Electrical Engineering, University of Ljubljana

## Features

- Track household purchases with a flick of your finger
- Figure out who owes who what
- Share a cloud-synced shopping list with your housemates
- Intuitively pay back what you own
- Manage/ be part of multiple households
- Play around with various choices!

## Tech

DebtSettler uses several projects to work properly:

- Next.js - help us tame the beast that is React
- React - dynamic is life
- jsonwebtoken - helps us read and authetnicate via JSON tokens
- passport - great web token manager
- cookies - the only proper way to manage tokens
- http-proxy - well the app ain't gonna talk with the REST API itself
- and many more...

And of course, DebtSettler itself is open source!


## Installation

We recommend using your local server and running it via Docker. To make it accesible to the outisde world, we recommend a free DDNS (e.g. DuckDNS) and a reverse proxy (e.g. Caddy).

Docker:

docker-compose up --build #first time build

docker-compose up -d --build #rebuild without destroying container data

## Development

DebtSettler is still actively being developed, so expect some feature updates in the future!

## License

MIT
**Free Software, Hell Yeah!**
