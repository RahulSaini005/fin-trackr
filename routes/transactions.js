const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction.js'); 
const detectCategoryFromTitle = require('../utils/openai');


//create

router.post('/form',async(req,res)=>{

try{
    
    const{title,amount,type,date,category}=req.body;

   const newTransaction =await Transaction.create({ title, amount, type, date, category, user: req.session.userId }); 
    console.log("Transaction Saved:",);
    res.redirect('/transactions');
}catch(err){
    console.log("Error 404 :",err);
    res.send("something went wrong");
};

});




//Read

router.get('/',async(req,res)=>{

    try{
        const allTransaction=await Transaction.find({user: req.session.userId });
        console.log("All Transactions:", allTransaction);
res.render('transactions', { allTransaction });

}catch(err){
    console.log("Read Error:",err);
    res.send("something went wrong");

}

});


//update


router.put('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, date } = req.body;

    await Transaction.findByIdAndUpdate(id, { title, amount, type, date });
    res.redirect('/transactions');
  } catch (err) {
    console.log("Update Error:", err);
    res.send("Something went wrong");
  }
});



//edit

router.get('/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    res.render('partials/editform', { transaction }); 
  } catch (err) {
    console.log("Edit GET Error:", err);
    res.send("Something went wrong");
  }
});



// Delete 
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Transaction.findByIdAndDelete(id);
    console.log("Transaction Deleted:", id);
    res.redirect('/transactions');
  } catch (err) {
    console.log("Delete Error:", err);
    res.send("Something went wrong during delete");
  }
});



module.exports = router;