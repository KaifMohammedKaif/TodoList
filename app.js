const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

main()
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://mokaif925:Mkaifisbest1@cluster0.cyk6i4z.mongodb.net/todoList");
}

const worklist = {
  name: {
    type: String,
    required: true,
  },
};

const workItem = mongoose.model("workItem", worklist);

const listItems = {
  name: {
    type: String,
    required: true,
  },
};

const Item = mongoose.model("Item", listItems);

const item1 = new Item({
  name: "welcome",
});

const item2 = new Item({
  name: "add your list",
});

const item3 = new Item({
  name: "check your list",
});

const defaulItem = [item1, item2, item3];

// Item.insertMany(defaulItem);

// Main Route
app.get("/", async (req, res) => {
  let item = await Item.find();
  res.render("list", { listTitle: "today", newListItems: item });
});

//Adding New Item route
app.post("/", async (req, res) => {
  let item = req.body.newItem;
  if (item != "" && item != " ") {
    if (req.body.list === "Work List") {
      const workAdded = new workItem({
        name: item,
      });
      await workAdded.save();
      res.redirect("/work");
    } else {
      const itemAdded = new Item({
        name: item,
      });
      await itemAdded.save();
      res.redirect("/");
    }
  }
});

//Delete Route
app.post("/del", async (req, res) => {
  let item = req.body.delItem;
  if (req.body.delbranch === "Work List") {
    await workItem.deleteOne({ name: item });
    res.redirect("/work");
  } else {
    await Item.deleteOne({ name: item });
    res.redirect("/");
  }
});

//Work Route
app.get("/work", async (req, res) => {
  let workList = await workItem.find();
  res.render("list", { listTitle: "Work List", newListItems: workList });
});

app.listen(3000, () => {
  console.log("server started ya hoo");
});
