const nano = require('nano')('http://lrf2949a:bennjerry100@127.0.0.1:5984');

const dbLivres = nano.db.use('livres');

async function findId(numero) {
    let findId = {
        "selector": { "numero": parseInt(numero) },
        "fields": ["_id", "_rev"],
    }
    livre = await dbLivres.find(findId);
    if (livre.docs[0]) {
        id = livre.docs[0]._id
        rev = livre.docs[0]._rev
        return { id, rev }
    }
    else {
        return undefined
    }
}
async function getLivresDB() {
    query = {
        "selector": {},
        "fields": ["numero", "titre", "pages"],
    };
    let livres = (await dbLivres.find(query)).docs;
    return (livres)
}
async function getLivreByIdDB(id) {
    query = {
        "selector": { "numero": parseInt(id) },
        "fields": ["numero", "titre", "pages"],
    };
    livre = await dbLivres.find(query)
    return livre.docs[0]
}

async function getPagesDB(id) {
    query = {
        "selector": { "numero": parseInt(id) },
        "fields": ["pages"],
    };
    const pages = await dbLivres.find(query)
    return pages.docs[0]
}

async function getPageDB(id, nbPage) {

        query = {
            "selector": { "numero": parseInt(id) },
            "fields": [`pages.${nbPage - 1}`],
        };
        const page = await dbLivres.find(query)    
        
        return page.docs[0]

}
async function postLivreDB(livre) {
    let islivre = await findId(livre.numero)
    if (islivre) {
        return false
    }
    else {
        await dbLivres.insert(livre)
        return true
    }
}
async function deleteLivreDB(numero) {
    let livre = await findId(numero);
    if (livre) {
        await dbLivres.destroy(livre.id, livre.rev)
        return true
    }
    return false
}
async function putLivreDB(numero, newData) {
    let livre = await findId(numero)
    if (livre) {
        newData._rev = livre.rev
        newData._id = livre.id
        reponse = await dbLivres.insert(newData)
        return true
    }
    else {
        return false
    }
}
module.exports = { getLivresDB, getLivreByIdDB, getPagesDB, getPageDB, postLivreDB, deleteLivreDB, putLivreDB }