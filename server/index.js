const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
mongoose.connect(
  "mongodb+srv://susankhatri00:aJVDLJMCi19mtNsQ@mern-login-db.zd7m4v9.mongodb.net/employee"
);
const generateRandomKey = () => {
  return crypto.randomBytes(32).toString("hex");
};
const secretKey = generateRandomKey();

// this for fetching employee namewe
app.post("/getUserInfo", (req, res) => {
  const { email } = req.body;
  EmployeeModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.json({
          success: true,
          name: user.name,
          email: user.email,
          role: user.role,
        });
      } else {
        res.json({ success: false, message: "User not found" });
      }
    })
    .catch((error) => {
      console.error("Error fetching user information:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
});
// end
app.get("/employeeNames", async (req, res) => {
  try {
    // Fetch all employee names from the database
    const employeeNames = await EmployeeModel.find({}, "name");
    const nameList = employeeNames.map((employee) => employee.name);
    res.json(nameList);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// for login panel validation login

// Assuming you have the EmployeeModel and secretKey already defined

app.get("/profile", (req, res) => {
  // Extract the authorization header from the request
  const authHeader = req.headers["authorization"];

  // Check if the authorization header is present
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Missing authorization header",
    });
  }

  // Extract the token from the authorization header
  const token = authHeader.split(" ")[1];

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid or expired token",
      });
    }

    // If the token is valid, you can use the decoded information to fetch the user's profile
    const userId = decoded.userId; // Assuming userId is included in the token
    const username = decoded.name;
    const role = decoded.role;
    // Fetch user profile from your database
    EmployeeModel.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        // Return the user profile data
        res.json({
          success: true,
          message: "Profile fetched successfully",
          user: { name: user.name, email: user.email, role: user.role },
        });
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error.message);
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      });
  });
});
// end of authorization and token >>>> -+963
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res.json({
      success: false,
      message: "Please enter email and password",
    });
  } else if (!email) {
    return res.json({
      success: false,
      message: "Please enter email address",
    });
  } else if (!password) {
    return res.json({
      success: false,
      message: "Please enter password",
    });
  }
  EmployeeModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            secretKey,
            { expiresIn: "1h" }
          );
          res.json({
            success: true,
            message: "Login successful",
            user: { name: user.name, email: user.email },
            accessToken: accessToken,
          });
        } else {
          res.json({ success: false, message: "Incorrect password" });
        }
      } else {
        res.json({ success: false, message: "User not found" });
      }
    })
    .catch((error) => {
      console.error("Error during login:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    });
});

// end-->>>>>>>>>>>>>

// for registration portal login >>>>>>>>>>
app.post("/register", async (req, res) => {
  const { name, email, password, role = "user" } = req.body;
  const existingUser = await EmployeeModel.findOne({ email });

  if (!email && !password) {
    return res.json({
      success: false,
      message: "Please enter email and password",
    });
  } else if (!name) {
    return res.json({
      success: false,
      message: "Please enter Name",
    });
  } else if (!email) {
    return res.json({
      success: false,
      message: "Please enter email address",
    });
  } else if (!password) {
    return res.json({
      success: false,
      message: "Please enter password",
    });
  }
  if (existingUser) {
    return res.json({
      success: false,
      message: "email already exist please use a different email",
    });
  }
  try {
    // Create a new user with assigned role
    const newUser = await EmployeeModel.create({
      name,
      email,
      password,
      role,
    });

    // Respond with the created user data
    res.json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.get("/names", async (req, res) => {
  try {
    // Fetch all names from the database
    const name = await EmployeeModel.find({}, "name");
    const nameList = name.map((user) => user.name);
    res.json(nameList);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete user
app.delete("/api/employees/delete/:name", async (req, res) => {
  const nameToDelete = req.params.name;

  try {
    // Find and delete the user by name
    const deletedUser = await EmployeeModel.findOneAndDelete({
      name: nameToDelete,
    });

    if (deletedUser !== null) {
      res.json({
        success: true,
        message: "User deleted successfully",
        deletedUser,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
app.put("/employees/:employeeName", async (req, res) => {
  const { employeeName } = req.params;
  const { newName, newPassword } = req.body;

  try {
    // Check if either newName or newPassword is provided
    if (!newName && !newPassword) {
      return res
        .status(400)
        .json({ error: "Either newName or newPassword must be provided" });
    }

    // Check if the employee exists
    const existingEmployee = await EmployeeModel.findOne({
      name: employeeName,
    });
    if (!existingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the employee's name and/or password
    if (newName) {
      existingEmployee.name = newName;
    }
    if (newPassword) {
      // Hash the new password before saving
      existingEmployee.password = newPassword; // Replace with bcrypt hash
    }

    // Save the updated employee
    await existingEmployee.save();

    return res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error("Error updating employee:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const Product = require("./models/productModel");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
});

app.post("/api/products", upload.single("file"), async (req, res) => {
  const { name, description, price, image, category } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      image: req.file.filename,
      category,
    });
    console.log(res);
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Add endpoint for fetching products

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// >>>>>>>>>>>>>>>>>>>>>>>>testikng roter >>>>>>>>>>>>>>>>>>>>>>>>>
router.put("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>ending>>>>>>>>>>>>>
// end of deleteuser func
// end>>>>>>>>>>
app.listen(3001, () => {
  console.log("server is ruuninng");
});
// end >>>>>>>>>>>>>>>>
