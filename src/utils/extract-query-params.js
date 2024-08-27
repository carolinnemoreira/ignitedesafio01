//string = "?search=Carol"
//No Insomnia se quiser testar a url fica : http://localhost:3333/users/sjhgkjhgjsg?serch=carol
//Teste com mais parâmetros: http://localhost:3333/users/sjhgkjhgjsg?serch=carol&page=2


//Essa função irá receber uma string, a query, com o formato como exemplo acima
//A função vai retornar uma string sem o primeiro caracter que é o ponto de interrogação
//Como pode ter mais de um parâmetro e esse parâmetros são separados pelo E comercial "&", logo faz-se um split 
//para dividir os parâmetros. Exemplo: search=Carol&page=2
//Com isso será separado em um array: ['search=Carol', 'page=2']
//Utiliza-se o reduce para transformar o array em um objeto. Por isso o segundo parâmetro do método reduce é um 
//objeto vazio, para indicar que quer transformar o array em objeto.
//Quebrar os elementos da string no sinal de igual vai ficar ['search', 'Carol'] e ['page', '2']
//Com a desestruturação indica-se que a primeira string é a chave key e a segunda é o valor value


export function extractQueryParams(query) {
    return query.substr(1).split('&').reduce((queryParams, param) => {
        const [key, value] = param.split('=')

        queryParams[key] = value.replace(/%20/g, " ")
        console.log(key, value)

        return queryParams
    },{})
}