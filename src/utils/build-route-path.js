// /users/:id

//Criando uma regex
export function buildRoutePath (path) {
    //Eu quero encontrar no texto path tudo que começa com dois pontos, e depois dos dois pontos tem letras de a a z
    //que podem ser minúsculas ou maiúsculas e essas letras podem repetir uma ou mais vezes.
    //O "g" no final faz com que seja uma regex global, ou seja, capaz de identificar num mesmo path várias regex
    const routeParametersRegex = /:([a-zA-Z]+)/g  
    //Vou encontrar no path todos os locais que tenha um parâmetro dinâmico, e vou substituir por uma string
    // que é uma outra regex que aceita letras de a a z, números, hífen e underline
    const pathWithParams = path.replaceAll (routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')
    //console.log(pathWithParams)
    //const test = /\/users\/([a-z0-9-_]+)/
    //console.log(Array.from(path.matchAll(routeParametersRegex)))
    //O sinal circunflexo determina que a nossa string precisa começar com a expressão do regex pathWithParams
    //O query parameter é opcional. Pode existir ou não. A url precia terminar com a verificação, por isso o $ no final
    //const pathRegex = new RegExp(`^${pathWithParams}`)
    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

    return pathRegex
}