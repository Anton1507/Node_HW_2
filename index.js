const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const {listContacts,getContactById, addContact, removeContact}=require('./contacts');
const app=express()
host = "127.0.0.1";
port=4000;
app.use((req,res,next)=>{
    if(req.header('Content-type')==='application/json'){
        req.on('data',data=>{
            req.body=JSON.parse(data.toString());
            next()
        })
    }else{
        next()
    }
})

app.get('/contacts', async (req, res) => {
    res.status(200).type('text/plain');
    
    res.send(await listContacts())
})

app.get('/contacts/:contactId', async (req, res) => {
   
    if ( JSON.parse(await listContacts()).some(el=>el.id==(Number(req.params.contactId)))){
        res.status(200).send(JSON.stringify(await getContactById(Number(req.params.contactId))))}

    else res.status(404).send( JSON.stringify({message:'Not fount'}))
    
    res.status(200).send( JSON.stringify(await getContactById(Number(req.params.contactId))))
    console.log('this param',req.params.contactId)
   
})

app.post('/contacts',  
        (req,res,next)=>{
            if(!('name','email','phone' in req.body)){
                res.status(400);
                res.send({"message": "Missing required name field"})
            }
            next()
        },
           async (req,res)=>{
            const {name,email,phone}=  req.body;
            const addCont=  await addContact(name,email,phone)
            res.status(201)
            res.send(JSON.stringify(addCont))
           console.log(addCont)


        }
)

app.delete('/contacts/:contactId',
    async(req,res,next)=>{
        if ( JSON.parse(
            await listContacts())
                .some(el=>el.id==(Number(req.params.contactId)))  != true   )  {
                        res.status(404)
                        res.send(JSON.stringify({"message": "Contact not found"}))
                     } next()
            },
    async(req,res)=>{
        const idCont=(Number(req.params.contactId));
        const newlist = await removeContact(idCont);
        console.log(JSON.parse(newlist));
        res.status(200)
        res.send(JSON.stringify({"message": "Сontact deleted"}))
    }


)




app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`)
  })




