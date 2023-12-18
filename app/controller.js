const { getLivresDB,
    getLivreByIdDB,
    getPagesDB,
    getPageDB,
    postLivreDB,
    deleteLivreDB,
    putLivreDB } = require("./model");

const Joi = require('joi');

let jwt = require("jsonwebtoken");


const schema = Joi.object({
    numero: Joi.number().required(),
    titre: Joi.string().required(),
    pages: Joi.array().items(Joi.string()).required(),
});

async function noParam(req, res) {
    res.send("API de gestions des livres")
}

async function getLivres(req, res) {

    let livres = await getLivresDB()
    if (livres) {
        res.json(livres);
    }
    else {
        res.status(400).json({ message: "pas de livres trouvé" })
    }
}

async function getLivreById(req, res) {
    let id = req.params.id
    let livre = await getLivreByIdDB(id)
    if (livre) {
        res.json(livre)
    }
    else {
        res.status(400).json({ message: "pas de livre trouvé" })
    }
}
async function getPages(req, res) {
    let id = req.params.id
    let pages = await getPagesDB(id)
    if (pages) {
        res.json(pages)
    }
    else {
        res.status(400).json({ message: "pas de livre trouvé" })
    }
}
async function getPage(req, res) {
    let id = req.params.id
    let nbPage = req.params.page
    let livre = await getLivreByIdDB(id)
    if (livre) {
        let page = await getPageDB(id, nbPage)
        if (Object.keys(page).length !== 0) {
            console.log(page)
            res.json(page)
        }
        else {
            res.status(400).json({ message: "le livre existe mais pas la page" })
        }
    }
    else {
        res.status(400).json({ message: "le livre existe, mais pas cette page" })
    }

}
async function postLivre(req, res) {
    let newLivre = req.body
    const { value, error } = schema.validate(newLivre)
    if (error == undefined) {
        let ok = await postLivreDB(value)
        if (ok) {
            res.status(200).json({ message: `livre ajouté` })
        }
        else {
            res.status(400).json({ message: "il iy a déjà un livre avec ce numéro" })
        }
    }
    else {
        res.status(400).json({ message: error })
    }
}
async function deleteLivre(req, res) {
    let numero = req.params.id
    let ok = await deleteLivreDB(numero)
    if (ok == true) {
        res.status(201).json({ message: `livre numero ${numero} supprimé` })
    }
    else {
        res.status(400).json({ message: "le livre n'existe pas" })
    }
}
async function putLivre(req, res) {
    let newData = req.body
    const { value, error } = schema.validate(newData)
    if (error == undefined) {
        let numero = newData.numero
        let ok = await putLivreDB(numero, value)
        if (ok) {
            res.status(201).json({ message: `livre numero ${numero} modifié` })
        }
        else {
            res.status(400).json({ message: "il n'y a pas de livre avec ce numéro" })
        }
    }
    else {
        res.status(400).json({ message: error })
    }
}
function createToken(req, res) {
    const user = req.query.user
    let token = jwt.sign({ name: user },
        'maclesecrete',
        { expiresIn: '24h' });
    console.log(token)
    if (token) {
        res.json(`token créé pour ${user}`)
    }
    else {
        res.statut(400).json({ message: "probleme lors de la création du token" })
    }
}

function verificationToken(req, res, next) {
    let token = req.query.token;
    if (token) {
        jwt.verify(token, 'maclesecrete', function (err, payload) {
            if (err) {
                return res.json({
                    status: false,
                    message: 'token incorrect : ' + err.message
                });
            } else { 
                req.payload = payload; 
                req.name = payload.name
                next(); 
            }
        });
    } else { 
        return res.status(403).send({
            status: false,
            message: 'token absent'
        });
    }
}
module.exports = { noParam, getLivres, getLivreById, getPages, getPage, postLivre, deleteLivre, putLivre, createToken, verificationToken }