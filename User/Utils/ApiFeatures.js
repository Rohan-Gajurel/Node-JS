class Apifeatures{
    constructor(query,queryStr){
     this.query=query;
     this.queryStr=queryStr
    }
filter(){
    let queryString= JSON.stringify(this.queryStr);
    queryString=queryString.replace(/\b(gte|gt|te|lt)\b/g,(match)=>`$${match}`);
const queryObj=JSON.parse(queryString);
//console.log(queryObj);

 this.query= this.query.find(queryObj);

 return this;
}
sort(){
    if(this.queryStr.sort){
        const sortBy=this.queryStr.sort.split(',').join( );
        console.log(sortBy);
        this.query=this.query.sort(sortBy);
    }
    else{
        this.query=this.query.sort('createdAt');
    }
    return this;
}
limitField(){
    if(this.queryStr.fields){
        const fields=this.queryStr.fields.split(',').join(' ');
        this.query=this.query.select(fields);
    }
    else{
        this.query=this.query.select('-__v');
    }
    return this;
}

pagination(){
    const page = this.queryStr.page*1 || 1;
const limit=this.queryStr.limit*1 || 10;
//Page 1:1-2
const skip=(page-1)*limit;
this.query=this.query.skip(skip).limit(limit);

// if(req.page){
//     const bookscount= await Book.countDocuments();
//     if(skip >= bookscount){
//         throw new Error("This page is not found")
//     }
return this;
}


}
module.exports=Apifeatures