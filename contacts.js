const path = require('path');
const fs = require('fs');



const contactsPath = path.resolve('./db/contacts.json')

function listContacts (){
     return new Promise(resolve=>fs.readFile(contactsPath,'utf8',(err,data)=>{ resolve(data) }));
}


function write(path,data){
    return new Promise((resolve,rejects)=>{
        fs.writeFile(path,data,'utf8',(err)=>{
            if(err) rejects(err)
            resolve()
        })
    })
}

async function removeContact(contactId){
    const list = await listContacts();
    const arrWhioutContact = JSON.parse(list).filter(item=>item.id != contactId);
    
    const writeNewArr= await write(contactsPath,JSON.stringify(arrWhioutContact));
    const newList =  await listContacts();
     return newList

}
async function getContactById(contactId) {
    const list = await listContacts();
    const idContact = JSON.parse(list).filter(item=>item.id==contactId)
    return idContact
}

async function addContact(name, email, phone) {
    const list = await listContacts();
    const listinJson= JSON.parse(list)
    const newContact = {
        id:[...listinJson].pop().id+1,
        "name": name,
        "email":email,
        "phone":phone
    }
    listinJson.push(newContact);
    await write(contactsPath,JSON.stringify(listinJson))
    return newContact
  }










module.exports={listContacts,getContactById,removeContact,addContact}