FROM node:12-alpine as build
ENV WORKDIR=/app
WORKDIR $WORKDIR

COPY package.json tsconfig.json yarn.lock ./
COPY packages/api/package.json packages/api/
COPY packages/app/package.json packages/app/
COPY packages/doc/package.json packages/doc/
COPY packages/mailer/package.json packages/mailer/
COPY packages/web/package.json packages/web/
RUN yarn install --frozen-lockfile

COPY packages/ packages/
RUN yarn build

FROM node:12-alpine
ENV PORT 80
ENV WORKDIR=/app
WORKDIR $WORKDIR
COPY --from=build $WORKDIR ./
EXPOSE $PORT
CMD ["yarn", "serve"]

# RUN env && mkdir public && echo "<html><body>test</body></html>" >> public/index.html
# CMD ["npx", "http-server"]
