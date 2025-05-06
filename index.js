import "dotenv/config";
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;
const hostname = "127.0.0.1";

app.use(express.json());
const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let cafeMenu = [];
let nextid = 1;
//add new product
app.post("/products", (req, res) => {
  logger.info("POST request is made to add new item to cafeMenu")
  const { name, price } = req.body;
  const newItem = { id: nextid++, name, price };
  cafeMenu.push(newItem);
  res.status(201).send(newItem);
});
app.get("/products", (req, res) => {
  res.status(200).send(cafeMenu);
});
//get item with id
app.get("/products/:id", (req, res) => {
  const item = cafeMenu.find((t) => t.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).send("itemNotFound");
  }
  res.status(200).send(item);
});

//update the cafemenu
app.put("/products/:id", (req, res) => {
  const item = cafeMenu.find((t) => t.id === parseInt(req.params.id));

  if (!item) {
    return res.status(404).send("item not found");
  }
  const { name, price } = req.body;
  item.name = name;
  item.price = price;
  res.status(200).send(item);
});

//delete item
app.delete("/products/:id", (req, res) => {
  const index = cafeMenu.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).send("item not found");
  }
  cafeMenu.splice(index, 1);
  return res.status(200).send("deleted");
});

app.listen(port, hostname, () => {
  console.log(`server is running ${port}`);
});
