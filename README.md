# mighty-block-challenge-frontend
This repository is a technical challenge

## Public URL to test it live

[http://54.204.133.214/](http://54.204.133.214/)

## To run it locally

First, create a `.env.local` file located in `/client`folder.

Fill it with the env-variables declared in the `env.example` file.

[Here](https://www.mongodb.com/docs/manual/reference/connection-string/) is the information about what does every variable referred to mongodb means

You must have a local running mongodb in background or a mongo server to connect to it.

Then, install the dependencies:
```bash
cd client/

npm i
# or
yarn
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Google and facebook login buttons aren't working because of the requirements to generate a client-id, both need to have an 
url which is not an IP to be able to generate them, and I don't have one.

Dynamic pagination is loaded on-scroll, adding 6 posts each time it's triggered

Searchbar in index searches by the description of each post
