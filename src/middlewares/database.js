import fs from 'node:fs/promises'

const databasePath = new URL('../../db.json', import.meta.url)

export class Database {
    //Cria um objeto database, onde dentro pode-se guardar tabelas como "users": [...], um array de usuários.
    #database = {}

    //Método para recuperar o bando de dados quando a aplicação reinicia
    constructor() {
        fs.readFile(databasePath, 'utf-8').then(data => { //Lê o arquivo databasePath, como é uma promises utiliza-se o then para esperar ler todo o arquivo
            this.#database = JSON.parse(data) //depois que lê o arquivo completo, pego os dados e salvo dentro do banco de dados
        })
        .catch(() => {//Se o arquivo não existir, cria-se o arquivo mesmo que vazio
            this.#persist()
        })
    }

    #persist(){ //Método que vai escrever o banco de dados em um arquivo fixo
        fs.writeFile(databasePath, JSON.stringify(this.#database)) //Traforma o objeto em string pq o módulo fs não aceita objetos
    }

    select(table, search) {
        
        let data = this.#database[table] ?? [] 
       
        if (search){
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    if(!value) return true //se não encontrar valor passado em search, retorna true
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }


        return data
    }

    insert(table, data) {
        //Se já existir a tabela passada pelo parâmetro, apenas incluiremos os dados (data) nessa tabela
        if(Array.isArray(this.#database[table])) { //Se já existir um array inserido nessa tabela 
            this.#database[table].push(data) // se sim, faz-se o push para incluir os dados
        } else { //caso a tabela ainda não exista, ela será criada
            this.#database[table] = [data]
        }

        this.#persist();

        return data;
    }

    update(table, id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
          const row = this.#database[table][rowIndex]
          this.#database[table][rowIndex] = { id, ...row, ...data }
          this.#persist()
        }

    }

    partialUpdate(table, id){

        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        
        if (rowIndex > -1) {
            
            this.#database[table][rowIndex].completed_at = new Date()


            this.#persist() 
        } 

    }

    delete(table, id){
        //Estou percorrendo cada item dentro da tabela passada, dentro do array, procurando se existe algum usuário 
        //com o id que está se querendo deletar. Se existir será retornado o índice desse objeto dentro do array
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        //Se não for encontrado, o retorno é -1, por isso utiliza-se se maior que -1.
        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist() //Para salvar o banco de dados depois da informação
        } 

    }
}