FROM node:19 as build

# Define build arguments for environment variables
# ARG VITE_API_SERVER
# ARG VITE_ION_TOKEN

# Set environment variables during the build process
ENV VITE_API_SERVER="https://api.ecosystem2.co.uk"
ENV VITE_ION_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNzMyNjg5Zi00ZTI5LTRmYWEtOTE3Mi1kOTk3Y2RjYjY1YWEiLCJpZCI6NzQ1MjEsImlhdCI6MTYzNzgyMzU4N30.JFkVpFHpCeYuhC4KDr5_Or8PZArO_v8ed9nuP2j1xUU"

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:19-alpine3.16

WORKDIR /app
COPY --from=build /app .


ENV HOST=0.0.0.0
EXPOSE 5173
CMD ["npm","run", "serve","--", "--host", "0.0.0.0"]