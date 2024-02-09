import 'dotenv/config'
import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url))
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { verify } from 'crypto';
import bcrypt from 'bcrypt';
import multer from 'multer';

const app = express(); // Create an express app
const port = 3000;
const salt = 10;

app.set('view engine', 'ejs'); // set ejs as view engine
// app.use(express.static("public")); // Define folder for static file "app.use is a middleware"
app.use(bodyParser.urlencoded({ extended: true })); // Help to get data from frontend

app.use(express.static(__dirname + '/public/'));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}))
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    user: process.env.USER,
    host: "localhost",
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: 5432,
});

db.connect();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/'); // Specify the destination folder
    },
    filename: function (req, file, cb) {
        const {name,phone}=req.body;
        let nameWithoutSpace = name.replace(/ /g, "");
        const customFilename = `${nameWithoutSpace}-${phone}.pdf`;
        cb(null, customFilename); // Pass the new filename to Multer
    },
});

const upload = multer({ storage: storage })

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/user", (req, res) => {
    res.render("user.ejs");
})

app.get("/admin-panel", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("admin-panel.ejs");
    } else {
        res.redirect("/user");
    }
})

app.post("/register", async (req, res) => {
    // console.log(req.body);
    let name = req.body.name;
    let email = req.body.email;
    let password;
    if (req.body.password === req.body.repassword) {
        password = req.body.password;
    }
    try {
        let duplicateEntry = await db.query("SELECT EXISTS (SELECT 1 FROM user_cred WHERE email = $1)", [email]);
        if (duplicateEntry.rows[0].exists) {
            res.render('user.ejs', { message: "User with same email id already exists" });
            return;
        } else {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    console.log("Error hashing password")
                } else {
                    await db.query("INSERT INTO user_cred (name, email,password) VALUES ($1,$2,$3)",
                        [name, email, hash]);
                    // res.sendStatus(200);
                    res.render("admin-panel");
                }
            })
        }
    }
    catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    let id = req.body.loginId;
    let EnteredPassword = req.body.password;
    try {
        const result = await db.query("SELECT * FROM user_cred WHERE email=$1", [id]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password;
            bcrypt.compare(EnteredPassword, storedPassword, (err, result) => {
                if (err) {
                    console.log("Error comparing password", err);
                } else {
                    if (result) {
                        res.render("admin-panel");
                    } else {
                        res.render("user.ejs")
                        // res.send("Incorrect password");
                    }
                }
            })
        }
    } catch (err) {
        console.log(err)
    }
})

app.get("/dealer-enquiry", (req, res) => {
    res.render("dealerEnquiry.ejs");
})

app.post("/dealer-enquiry", async (req, res) => {
    const entry = req.body;
    // console.log(entry);
    try {
        await db.query("INSERT INTO dealer_enquiry (fname, lname, email, pnumber, address, city,pincode,state,item1,item2,item3,item4,item5,item6,item7,enquiry) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)",
            [entry.first_name, entry.last_name, entry.email_id, entry.phone_number, entry.address, entry.city, entry.pin_code, entry.state, entry.item1, entry.item2, entry.item3, entry.item4, entry.item5, entry.item6, entry.item7, entry.enquiry]);
        // res.sendStatus(200);
        res.redirect("/dealer-enquiry");
    } catch (err) {
        console.log(err);
    }
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
})

app.get("/career", async (req, res) => {
    try {
        const jobs = await db.query("SELECT * FROM jobs");
        // res.sendStatus(200);
        res.render("career.ejs", { jobs: jobs.rows });
    } catch (err) {
        console.log(err);
    }
})

app.post('/apply', upload.single('cv'), async function (req, res) {
   try {
    let {position,name,email,phone,qualification,degree} = req.body;
    let nameWithoutSpace = name.replace(/ /g, "");
    let url = `/uploads/${nameWithoutSpace}-${phone}.pdf`;
    let state = 'Applied';
    // console.log(req.body);
    // console.log(url);
    const regName = /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/;
    const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regphone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(regName.test(name) && regEmail.test(email) && regphone.test(phone)){
        await db.query(`INSERT INTO application (applied_for, name,email,phone, qualification,degree,cv_url,state)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,[position,name,email,phone,qualification,degree,url,state]);
        res.status(200).send('Applied successfully!');
    } else {
        res.status(422).send('Invalid input')
    }
   } catch(error) {
    console.log(error);
    res.status(500).send('Error processing form data.');
   }
        
  
    
    // console.log(applicantDetails);
    // res.render('application.ejs');
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
})

app.get("/search",  async (req,res) => {
    let keyWords = req.query.search_input;
    let keyWordsArray = keyWords.split(" ");
    let queryArray = keyWordsArray.map(item => `'${item}'`);
    let stringForName = `(ARRAY[${queryArray}])`;
    // console.log(stringForName);
    try {
        const searchResult = await db.query(`SELECT * FROM products 
        WHERE EXISTS ( 
            SELECT 1 
            FROM unnest(string_to_array(products.keywords, ' ')) AS word 
            WHERE word = ANY${stringForName}) 
            ORDER BY ( 
                SELECT COUNT(*) 
                FROM unnest(string_to_array(products.keywords, ' ')) AS word 
                WHERE word = ANY${stringForName}) DESC`);
        const brandArray = await db.query(`SELECT DISTINCT brand FROM products 
        WHERE EXISTS (
            SELECT 1
            FROM unnest(string_to_array(products.keywords, ' ')) AS word
            WHERE word = ANY${stringForName}
        )`);
        // console.log(searchResult.rows);
        res.render("products.ejs", { data: searchResult.rows, brands: brandArray.rows });
    } catch(err) {
        console.log(err.message);
    }
})

app.get("/products/category/:type", async (req,res) => {
    const value=req.params.type;
    try {
        const categoryResult = await db.query(`SELECT * FROM products WHERE category='${value}'`);
        const brandArray = await db.query(`SELECT DISTINCT brand FROM products WHERE category='${value}'`);
        res.render("products.ejs", { data: categoryResult.rows, brands: brandArray.rows });
    } catch(err){
        console.log(err.message);
    }
})

app.get("/products", async (req, res) => {
    try {
        const cardValue = await db.query("SELECT id, images, p_name, selling_price, mrp, brand FROM products");
        const brandArray = await db.query("SELECT DISTINCT brand FROM products");
        res.render("products.ejs", { data: cardValue.rows, brands: brandArray.rows });
    } catch (err) {
        console.log(err);
    }

})

app.get('/products/:id', async function (req, res) {
    try {
        const selectedId = await db.query(`SELECT * FROM  products WHERE id=${req.params.id}`);
        // console.log(selectedId.rows);
        res.render("productshowcase.ejs", { product: selectedId.rows });
    } catch (err) {
        console.log(err);
    }
});

app.post('/products/filter', async (req,res) => {
    let checkedArray = req.body;
    try {
        const filterData = await db.query(`SELECT * FROM products WHERE brand IN ($1,$2,$3)`,
        [checkedArray[0],checkedArray[1],checkedArray[2]]);
        // console.log(filterData.rows);
        const brandArray = await db.query("SELECT DISTINCT brand FROM products");
        res.render("products.ejs", { data: filterData.rows, brands: brandArray.rows });
    }catch (err) {
        console.log(err);
    }
    
    // console.log(value);
    // console.log(array);
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})