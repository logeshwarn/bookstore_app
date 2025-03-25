import express from "express";
import {PORT,mongoDBURL} from "./config.js";
import mongoose from 'mongoose';
import {Book} from './models/bookModel.js';
import cors from 'cors';

const app=express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    console.log(req);
    return res.status(234).send('hi da logesh uh');
});

//save book, working with mongoose is a asynchronous process
app.post('/books',async (req,res)=>{
    try {
        if(!req.body.title || !req.body.author || !req.body.publishYear){
            return res.status(400).send({message:'send all required fields'});
        }
        const newBook={
            title:req.body.title,
            author:req.body.author,
            publishYear:req.body.publishYear,
        }
        const book=await Book.create(newBook);
        return res.status(201).send(book);

    } catch (error) {
        console.log(error);
        res.status(500).send({message:error.message});
    }
})

//to get books
app.get('/books',async (req,res)=>{
    try {
        const books=await Book.find({});
        return res.status(200).json({
            count:books.length,
            data:books
    });
    } catch (error) {
        console.log(error);
        res.status(500).send({message:error.message});
    }
})

//get book by id
app.get('/books/:id',async (req,res)=>{
    try {
        const { id }=req.params;

        const book=await Book.findById(id);
        return res.status(200).json(book);
    } catch (error) {
        console.log(error);
        res.status(500).send({message:error.message});
    }
})

//update details
app.put('/books/:id',async (req,res)=>{
    try {
        if(!req.body.title || !req.body.author || !req.body.publishYear){
            return res.status(400).send({message:'send all required fields'});
        }

        const {id}=req.params;
        const result =await Book.findByIdAndUpdate(id,req.body);


        if(!result){
            return res.status(404).json({message:'book not found'});
        }
        else{
            return res.status(200).json({message:'book updated successfully'});
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:error.message});
    }
})

// Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Book.findByIdAndDelete(id);
    
    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

//mongoose connection and app start
mongoose 
.connect(mongoDBURL)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`app is running on port: ${PORT}`);
    });
})
.catch((error)=>{
console.log(error);
});


