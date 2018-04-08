var express=require('express'),
app=express(),
bodyParser=require('body-parser'),
methodOverride=require('method-override'),
expressSanitizer=require('express-sanitizer'),
mongoose=require('mongoose');

mongoose.connect("mongodb://localhost/blog_app");

app.set('view engine','ejs');

app.use(express.static('public'));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

var blogSchema=mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});

var Blog=mongoose.model('Blog',blogSchema);

//Creating a sample blog

// Blog.create({
//     title:"Beautiful Night",
//     image:"https://images.unsplash.com/photo-1513708726622-aefa716650bb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8662009f4c1407e8b39919d618a4fe7e&auto=format&fit=crop&w=731&q=80",
//     body: "The Sky Looks Beautiful in the Daylight but awesome in the Night with all the colorful lights and Stars in the Sky"
// })

//RESTful Routes



app.get('/',function(req,res){
    res.redirect("/blogs");
});

app.get('/blogs',function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else
        {
            res.render("index",{blogs:blogs});
        }
    })
});

//New Route

app.get('/blogs/new',function(req,res){
    res.render("new");
});

//Create Route
app.post('/blogs',function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    var blog=req.body.blog;
    Blog.create(blog,function(err,newBlog){
        if(err)
        {
            res.render('new');
        }
        else
        {
            res.redirect('blogs');
        }
    })
});

app.get('/blogs/:id',function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect('/blogs')
        }
        else
        {
            res.render('show',{blog:foundBlog})
        }
    });
});

app.get('/blogs/edit/:id',function(req,res){
    Blog.findById(req.params.id,function(err,editBlog){
        if(err){
            res.redirect('/blogs');
        }
        else
        {
            res.render('edit',{blog:editBlog});
        }
    })
});

app.put('/blogs/:id',function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect('/blogs');
        }
        else{
            res.redirect('/blogs/'+updatedBlog._id)
        }
    });
});
    

//Delete Route

app.delete('/blogs/:id',function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.redirect('/blogs');
        }
    })
})

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Blog App has Started");
});

