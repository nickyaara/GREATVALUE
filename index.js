import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import pg from "pg";

const app = express(); // Create an express app
const port = 3000;

app.set('view engine', 'ejs'); // set ejs as view engine
app.use(express.static("public")); // Define folder for static file "app.use is a middleware"
app.use(bodyParser.urlencoded({ extended: true })); // Help to get data from frontend

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "greatvalue_db",
    password: "123456",
    port: 5432,
});

db.connect();

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/user", (req, res) => {
    res.render("user.ejs");
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

app.get("/career", (req, res) => {
    res.render("career.ejs");
})

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
})

app.get("/products", async (req, res) => {
    try {
        const cardValue = await db.query("SELECT id, images, p_name, selling_price, mrp FROM products");
            // res.sendStatus(200);
            // console.log(cardValue.rows);
            res.render("products.ejs", {data :cardValue.rows});
    } catch (err) {
        console.log(err);
    }
    
})

app.get('/products/:id', async function(req, res) {
    try {
        const selectedId = await db.query(`SELECT * FROM products WHERE id=${req.params.id}`);
            res.render("productshowcase.ejs", {product :selectedId.rows});
    } catch (err) {
        console.log(err);
    }
});


// app.get("/details", async (req, res) => {
//     res.render("productshowcase.ejs");
// });

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})