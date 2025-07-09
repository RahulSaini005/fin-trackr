const mongoose=require('mongoose');


const transactionSchema =new mongoose.Schema({

     user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, 

    
title:{
    type:String,
    required:true
},

amount:{
    type:Number,
    required:true
},


type:{
    type:String,
    enum:['income','expenses'],
    required:true
},


date:{
    type:Date,
    required:true
},

 category: {
    type:String,
    required:true
 }


});


module.exports=mongoose.model('Transaction',transactionSchema);