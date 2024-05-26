const environment = "dev"
const remoteService = environment === "prod" ? "https://sspeapi.devspace.ml" : "http://localhost:7500"
console.log("environment: ", environment)
console.log('remoteService: ', remoteService)

export default {
  env: environment,
  api_service: remoteService,
  apiKey: '-remote-sspe-cli-web-',
}
