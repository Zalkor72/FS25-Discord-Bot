FROM node:latest
LABEL name="LS25-Discord-Bot"
LABEL authors="Dennis Heinrich"

# Copy the source files
WORKDIR /app
COPY . /app
RUN npm install

CMD ["npm", "start"]
ENTRYPOINT ["npm", "start"]