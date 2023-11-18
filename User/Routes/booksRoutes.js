const express=require('express')
const router=express.Router();
const booksContoller=require('./../Contollers/booksContoller')

const authContoller=require('../Contollers/authContoller')

//router.param('id',booksContoller.checkId)
router.route('/highest-rated').get(booksContoller.getHigestRated, booksContoller.getAllBooks)

router.route('/book-stats').get(booksContoller.getBooksStats)
router.route('/book-author/:author').get(booksContoller.getBooksByAuthor)
router.route('/')
.get(authContoller.protect, booksContoller.getAllBooks)
.post(booksContoller.createBook)


router.route('/:id')
.patch(booksContoller.updateBook)
.delete(booksContoller.deleteBook)
.get(booksContoller.getBook)

module.exports=router;