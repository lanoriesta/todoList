const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
const port = 3000;

// let itemList = [];
// let workItemList = [];
mongoose.connect('mongodb+srv://lawrencenoriesta97:rjgmJA6MWlQkFrzF@cluster0.6mdtvon.mongodb.net/todolistDB')

const itemsSchema = mongoose.Schema ({
    name: String
});

const customListSchema = mongoose.Schema ({
    name: String,
    item: [itemsSchema]
});

const Item = mongoose.model('Item', itemsSchema);
const List = mongoose.model('List', customListSchema);

const running = new Item ({
    name: 'Welcome to your ToDo List'
});

const walking = new Item ({
    name: 'Hit the + button to add a new item.'
});

const biking = new Item ({
    name: '<-- Hit this to delete an item.'
});

const defaultItems = [running, walking, biking];


const dateToday = date.getDate();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

//* GET
app.get('/', (req, res) => {


    Item.find().then((items) => {

        if (items.length === 0) {

            Item.insertMany(defaultItems).then(() => {
                console.log('Succesfully Added');
            }).catch((err) => console.log(err));
    
            res.redirect('/');
        }else{
    
            res.render('list', {
                categoryTitle: dateToday,
                addItem: items
        
            });
        }
        
    }).catch((err) => console.log(err));
    

});

app.get('/:workId', (req, res) => {
    const paramId = _.capitalize(req.params.workId);

    List.findOne({name: paramId}).then((lists) => {

    if (!lists) {
        const list = new List({
            name: paramId,
            item: defaultItems
        });

        list.save();
        res.redirect('/'+paramId);

    }else {
        res.render('list', {
            categoryTitle: lists.name,
            addItem: lists.item
        });
    }

    }).catch((err) => console.log(err));


});


app.get('/about', (req, res) => {
    res.render('about');

});



// * POST
app.post('/', (req, res) => {

    const itemName = req.body.item;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });
    
    if (listName === dateToday) {
    
        item.save();
        res.redirect('/');

    }else{
        List.findOne({name: listName}).then((list) => {
            list.item.push(item);
            list.save();
            res.redirect('/'+listName);
        }).catch((err) => console.log(err));
    }
    
});

app.post('work', (req, res) => {
    let item = req.body.item;

    workItemList.push(item);
    res.redirect('/work');
});

app.post('/delete', (req, res) => {

    const checkedItem = req.body.checkbox;
    const nameList = req.body.listName;

    if (nameList === dateToday) {

        Item.findByIdAndRemove({_id: checkedItem}).then(() => {
            console.log('Succesfully deleted');
        }).catch((err) => console.log(err));
    
        res.redirect('/'+nameList);

    }else{
        
        List.findOneAndUpdate({name: nameList}, {$pull: {item: {_id: checkedItem}}}).then((list) => {
            res.redirect('/'+nameList);
        }).catch((err) => console.log(err));

    }

    
    
});



app.listen(port, () =>{
    console.log('Listening to port: '+port);
});