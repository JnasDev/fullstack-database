const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();

app.use(cors());

// create the connection to database
const connection = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "root",
   database: "travel_db",
});

app.get("/", (req, res, next) => {
   res.send("<h1>Hello Express~</h1>");
});

app.get("/api/attractions", (req, res, next) => {
   const page = parseInt(req.query.page);
   const per_page = parseInt(req.query.per_page);
   console.log(page, per_page);
   const sort_column = req.query.sort_column;
   const sort_direction = req.query.sort_direction;
   const search = req.query.search;

   const start_idx = (page - 1) * per_page;

   var params = [];
   var sql = "SELECT * FROM attractions";
   if (search) {
      sql += " WHERE name LIKE ?";
      params.push("%" + search + "%");
   }

   if (sort_column) {
      sql += " ORDER BY " + sort_column + " " + sort_direction;
   }
   sql += " LIMIT ?, ?";

   params.push(start_idx);
   params.push(per_page);
   connection.query(sql, params, (err, results, fields) => {
      connection.query(
         "SELECT COUNT(id) as total FROM attractions",
         (err, counts, fields) => {
            const total = counts[0]["total"];
            const total_pages = Math.ceil(total / per_page);
            res.json({
               page: page,
               per_page: per_page,
               total: total,
               total_page: total_pages,
               data: results,
            });
         }
      );
   });
});

app.listen(4000, (req, res) => {
   console.log("Server has been stared on port: 4000");
});
