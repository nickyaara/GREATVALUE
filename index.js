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
import bcrypt from 'bcrypt';
import multer from 'multer';
import { log } from 'console';

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
        const { name, phone } = req.body;
        let nameWithoutSpace = name.replace(/ /g, "");
        const customFilename = `${nameWithoutSpace}-${phone}.pdf`;
        cb(null, customFilename); // Pass the new filename to Multer
    },
});

const upload = multer({ storage: storage })

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
    res.render("index.ejs", {pageTitle : 'GreatValue: Office Essential Simplified', inView:'block',outView:'none'});
    } else {
        res.render("index.ejs", {pageTitle : 'GreatValue: Office Essential Simplified', inView:'none',outView:'block'});
    }
})

app.get("/user", (req, res) => {
if (req.isAuthenticated()) {
    res.render("user.ejs", {pageTitle : 'Login', inView:'block',outView:'none'});
} else {
    res.render("user.ejs", {pageTitle : 'Login', inView:'none',outView:'block'});
}
})

app.get('/create-account', (req, res) => {
    if (req.isAuthenticated()) {
    res.render('newuser.ejs', {pageTitle : 'Get an Account', inView:'block',outView:'none'});
} else {
    res.render('newuser.ejs', {pageTitle : 'Get an Account', inView:'none',outView:'block'});
}
})

app.get("/admin-panel", async (req, res) => {
    try {
        const jobPosts = await db.query('SELECT * FROM jobs');
        const productDetails = await db.query('SELECT id, p_name, brand, model_number, category FROM products')
        const productsValue = await db.query('SELECT SUM("in_stock"*"selling_price") as total FROM products');
        const application = await db.query('SELECT * FROM application')
        
        if (req.isAuthenticated()) {
            res.render("admin-panel.ejs", {
                jobDetails: jobPosts.rows,
                products: productDetails.rows,
                valuation: productsValue.rows,
                jonApplication: application.rows
            });
        } else {
            res.redirect("/user");
        }
    } catch (err) {
        console.log(err);
    }

})

app.post("/register", async (req, res) => {
    // console.log(req.body);
    let name = req.body.username;
    let email = req.body.email;
    let password;
    if (req.body.password === req.body.repassword) {
        password = req.body.password;
    }
    try {
        let duplicateEntry = await db.query("SELECT EXISTS (SELECT 1 FROM user_cred WHERE email = $1)", [email]);
        if (duplicateEntry.rows[0].exists) {
            res.render('newuser.ejs', { message: "User with same email id already exists",pageTitle : 'Get an Account', inView:'none',outView:'block' });
            return;
        } else {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    console.log("Error hashing password")
                } else {
                    const result = await db.query("INSERT INTO user_cred (name, email,password) VALUES ($1,$2,$3)",
                        [name, email, hash]);
                    // res.sendStatus(200);
                    // const user = result.rows[0];
                    // req.login(user, (err) => {
                    //     console.log(err);
                    //     res.redirect('/admin-panel')
                    // })
                    // res.render("admin-panel");
                    res.redirect("/user");
                }
            })
        }
    }
    catch (err) {
        console.log(err);
    }
});

app.post('/login', passport.authenticate('local', {
    // successRedirect: '/admin-panel',
    failureRedirect: '/user'
}), (req,res) => {
    if(req.user.is_admin){
        res.redirect('/admin-panel');
    } else {
        res.redirect('/products');
    }
});

app.post('/logout', (req, res) => {
    req.logout( (err) => {
        if(err) {
            return err;
        } else {
            res.redirect('/user');
        }
    });
});

app.get("/dealer-enquiry", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("dealerEnquiry.ejs", {pageTitle : 'Dealer Enquiry', inView:'block',outView:'none'});
    } else {
        res.render("dealerEnquiry.ejs", {pageTitle : 'Dealer Enquiry', inView:'none',outView:'block'});
    }
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
    if (req.isAuthenticated()) {
    res.render("about.ejs", {pageTitle : 'About', inView:'block',outView:'none'});
    } else {
        res.render("about.ejs", {pageTitle : 'About', inView:'none',outView:'block'});
    }
})

app.get("/career", async (req, res) => {
    try {
        const jobs = await db.query("SELECT * FROM jobs");
        // res.sendStatus(200);
        if (req.isAuthenticated()) {
        res.render("career.ejs", { jobs: jobs.rows , pageTitle : 'Career', inView:'block',outView:'none'});
        } else {
            res.render("career.ejs", { jobs: jobs.rows , pageTitle : 'Career', inView:'none',outView:'block'});
        }
    } catch (err) {
        console.log(err);
    }
})

app.post('/apply', upload.single('cv'), async function (req, res) {
    try {
        let { position, name, email, phone, qualification, degree } = req.body;
        let nameWithoutSpace = name.replace(/ /g, "");
        let url = `/uploads/${nameWithoutSpace}-${phone}.pdf`;
        let state = 'Applied';
        // console.log(req.body);
        // console.log(url);
        const regName = /(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/;
        const regEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const regphone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (regName.test(name) && regEmail.test(email) && regphone.test(phone)) {
            await db.query(`INSERT INTO application (applied_for, name,email,phone, qualification,degree,cv_url,state)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [position, name, email, phone, qualification, degree, url, state]);
            res.status(200).send('Applied successfully!');
        } else {
            res.status(422).send('Invalid input')
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error processing form data.');
    }
    // console.log(applicantDetails);
    // res.render('application.ejs');
});

app.get("/contact", (req, res) => {
    if (req.isAuthenticated()) {
    res.render("contact.ejs", { pageTitle : 'Contact', inView:'block',outView:'none'});
    } else {
        res.render("contact.ejs", { pageTitle : 'Contact', inView:'none',outView:'block'});
    }
})

app.get("/search", async (req, res) => {
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
        if (req.isAuthenticated()) {
        res.render("products.ejs", { data: searchResult.rows, brands: brandArray.rows, inView:'block',outView:'none' });
        } else {
            res.render("products.ejs", { data: searchResult.rows, brands: brandArray.rows, inView:'none',outView:'block' });
        }
    } catch (err) {
        console.log(err.message);
    }
})

app.get("/products/category/:type", async (req, res) => {
    const value = req.params.type;
    const result = value.replace(/_/g, " ");
    // console.log(result);
    try {
        const categoryResult = await db.query(`SELECT * FROM products WHERE category='${result}'`);
        const brandArray = await db.query(`SELECT DISTINCT brand FROM products WHERE category='${result}'`);
        if (req.isAuthenticated()) {
        res.render("products.ejs", { data: categoryResult.rows, brands: brandArray.rows, pageTitle : `Category: ${value}`, inView:'block',outView:'none' });
        } else {
            res.render("products.ejs", { data: categoryResult.rows, brands: brandArray.rows, pageTitle : `Category: ${value}`, inView:'none',outView:'block' });
        }
    } catch (err) {
        console.log(err.message);
    }
})

app.get("/products", async (req, res) => {
    try {
        const cardValue = await db.query("SELECT id, images, p_name, selling_price, mrp, brand FROM products");
        const brandArray = await db.query("SELECT DISTINCT brand FROM products");
        let minPrice = await db.query('SELECT MIN(selling_price) FROM products');
        let maxPrice = await db.query('SELECT MAX(selling_price) FROM products');
        if (req.isAuthenticated()) {
        res.render("products.ejs", { data: cardValue.rows, brands: brandArray.rows, minValue: minPrice.rows[0].min, maxValue: maxPrice.rows[0].max, pageTitle : 'Products', inView:'block',outView:'none' });
        } else {
            res.render("products.ejs", { data: cardValue.rows, brands: brandArray.rows, minValue: minPrice.rows[0].min, maxValue: maxPrice.rows[0].max, pageTitle : 'Products', inView:'none',outView:'block' });
        }
    } catch (err) {
        console.log(err);
    }

})

app.get('/products/:id', async function (req, res) {
    try {
        const selectedId = await db.query(`SELECT * FROM  products WHERE id=${req.params.id}`);
        // console.log(selectedId.rows);
        if (req.isAuthenticated()) {
        res.render("productshowcase.ejs", { product: selectedId.rows, pageTitle : selectedId.rows[0].p_name, inView:'block',outView:'none' });
        } else {
            res.render("productshowcase.ejs", { product: selectedId.rows, pageTitle : selectedId.rows[0].p_name, inView:'none',outView:'block' });
        }
    } catch (err) {
        console.log(err);
    }
});

app.post('/products/filter', async (req, res) => {
    let checkedArray = req.body;
    let sortValue = Number(req.body.sortValue);
    let minPrice;
    let maxPrice;
    let categoryValue;
    minPrice = req.body.minPriceValue ? req.body.minPriceValue : 1;
    maxPrice = req.body.maxPriceValue ? req.body.maxPriceValue : 2000000;
    if (req.body.categoriesValue.length) {
        categoryValue = req.body.categoriesValue.map(value => `'${value}'`);
    } else {
        categoryValue = "['Chair','Table','Storage unit','Sofa','Safe','Currency handling machine']";
    }
    const brandArray = checkedArray.brandValue.map(value => `'${value}'`);
    const brandSearchString = brandArray.length > 0 ? `AND brand ILIKE ANY(ARRAY[${brandArray}])` : '';
    const categorySearchString = `(ARRAY[${categoryValue}])`;
    const order = sortValue == 2 || sortValue == 3 ? 'DESC' : '';
    const sortBy = sortValue == 3 ? 'stock_date' : 'selling_price';
    let sortQuery = sortValue == 0 ? "" : `ORDER BY ${sortBy} ${order}`;
    try {
        const queryRes = await db.query(`SELECT id, images, p_name, selling_price, mrp, brand FROM products
            WHERE category ILIKE ANY ${categorySearchString}
            ${brandSearchString} AND selling_price BETWEEN ${minPrice} AND ${maxPrice} 
            ${sortQuery}`);
        res.json(queryRes.rows);
    } catch (err) {
        console.log(err);
    }
})

app.get('/checkout/cart', async (req, res) => {
    if (req.isAuthenticated()) {
    res.render('cart.ejs', {pageTitle : "Checkout", inView:'block',outView:'none' });
    } else {
        res.render('cart.ejs', {pageTitle : "Checkout", inView:'none',outView:'block' });
    }
})

app.post('/admin/add-job', async (req, res) => {
    let { name, experience, location, salary, description } = req.body;
    try {
        const jobPost = await db.query(`INSERT INTO jobs (title, experience,location,salary,description)
        VALUES('${name}','${experience}','${location}','${salary}','${description}')`);
        res.json('Succusfully posted job');
    } catch (err) {
        console.log(err);
    }
})

passport.use(new Strategy(async function verify(username, password, cb) {
    try {
        const result = await db.query("SELECT * FROM user_cred WHERE email=$1", [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const storedPassword = user.password;
            bcrypt.compare(password, storedPassword, (err, result) => {
                if (err) {
                    return cb(err);
                } else {
                    if (result) {
                        return cb(null, user);
                    } else {
                        return cb(null, false);
                        // res.send("Incorrect password");
                    }
                }
            })
        } else {
            return cb("user not found");
        }
    } catch (err) {
        return cb(err);
    }
}))

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})