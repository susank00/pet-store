const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");
const PurchaseHistory = require("./models/purchaseHistoryy");
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const app = express();
app.use(express.json());
const bcrypt = require("bcryptjs");

app.use(cors());
// app.use(express.static("public"));
app.use("/public", express.static(path.join(__dirname, "public")));
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
const secretKey = process.env.JWT_SECRET;
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Invalid token" });
    }
    // Attach the user information to the request object
    req.user = user;
    next();
  });
}

//  secure way to get the images
// app.get("/public/images/:filename", authenticateToken, (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join(__dirname, "public", "images", filename);

//   res.sendFile(filePath, (err) => {
//     if (err) {
//       console.error("Error sending file:", err);
//       res.status(500).json({
//         success: false,
//         message: "Internal server error",
//       });
//     }
//   });
// });
// end of secure way to get the images

// this for fetching employee namewe
app.post("/getUserInfo", authenticateToken, (req, res) => {
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
// app.get("/employeeNames", async (req, res) => {
//   try {
//     // Fetch all employee names from the database
//     const employeeNames = await EmployeeModel.find({}, "name");
//     const nameList = employeeNames.map((employee) => employee.name);
//     res.json(nameList);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.get("/employeeNames", authenticateToken, async (req, res) => {
  try {
    // Fetch all employee names from the database
    const employees = await EmployeeModel.find({}); // Fetch only the name field if required

    res.json(employees);
  } catch (error) {
    console.error("Error fetching employee names:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// for login panel validation login

// Assuming you have the EmployeeModel and secretKey already defined

app.get("/profile", authenticateToken, (req, res) => {
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
    const email = decoded.email;
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
          user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
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
//  to get user name from user id

app.get("/profile/:userId", authenticateToken, (req, res) => {
  // Extract the userId from the URL parameters
  const { userId } = req.params;

  // Fetch the user profile from the database using the provided userId
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
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
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

// end of get user id

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.json({
//       success: false,
//       message: "Please enter both email and password",
//     });
//   }

//   try {
//     const user = await EmployeeModel.findOne({ email: email });

//     if (user) {
//       // Here, you should ideally use bcrypt to compare hashed passwords
//       if (user.password === password) {
//         // Generate a new access token with a short expiration time
//         const accessToken = jwt.sign(
//           { userId: user._id, email: user.email, username: user.name },
//           secretKey,
//           { expiresIn: "600s" } // Short-lived access token
//         );
//         console.log(accessToken);
//         // Generate a new refresh token with a longer expiration time
//         // const refreshToken = jwt.sign(
//         //   { userId: user._id, email: user.email, username: user.name },
//         //   secretKey,
//         //   { expiresIn: "7d" } // Longer-lived refresh token
//         // );

//         res.json({
//           success: true,
//           message: "Login successful",
//           user: { name: user.name, email: user.email },
//           accessToken: accessToken,
//           // refreshToken: refreshToken,
//         });
//       } else {
//         res.json({ success: false, message: "Incorrect password" });
//       }
//     } else {
//       res.json({ success: false, message: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error during login:", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Please enter both email and password",
    });
  }

  try {
    // Find the user by email
    const user = await EmployeeModel.findOne({ email });

    // Check if user exists
    if (user) {
      // Compare the provided password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Generate a new access token with a short expiration time
        const accessToken = jwt.sign(
          {
            userId: user._id,
            email: user.email,
            username: user.name,
            role: user.role,
          },
          secretKey,
          { expiresIn: "600s" } // Short-lived access token (10 minutes)
        );
        console.log(accessToken);

        // Optionally generate a new refresh token (commented out)
        // const refreshToken = jwt.sign(
        //   { userId: user._id, email: user.email, username: user.name },
        //   secretKey,
        //   { expiresIn: "7d" } // Longer-lived refresh token (7 days)
        // );

        // Send the success response with the tokens and user data
        res.json({
          success: true,
          message: "Login successful",
          user: { name: user.name, email: user.email },
          accessToken: accessToken,
          // refreshToken: refreshToken, // Uncomment if you're using refresh tokens
        });
      } else {
        // Incorrect password
        res.json({ success: false, message: "Incorrect password" });
      }
    } else {
      // User not found
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    // Handle any errors that occur during the login process
    console.error("Error during login:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
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
app.get("/names", authenticateToken, async (req, res) => {
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
// app.put("/employees/:employeeName", async (req, res) => {
//   const { employeeName } = req.params;
//   const { newName, newPassword } = req.body;

//   try {
//     // Check if either newName or newPassword is provided
//     if (!newName && !newPassword) {
//       return res
//         .status(400)
//         .json({ error: "Either newName or newPassword must be provided" });
//     }

//     // Check if the employee exists
//     const existingEmployee = await EmployeeModel.findOne({
//       name: employeeName,
//     });
//     if (!existingEmployee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Update the employee's name and/or password
//     if (newName) {
//       existingEmployee.name = newName;
//     }
//     if (newPassword) {
//       // Hash the new password before saving
//       existingEmployee.password = newPassword; // Replace with bcrypt hash
//     }

//     // Save the updated employee
//     await existingEmployee.save();

//     return res.status(200).json({ message: "Employee updated successfully" });
//   } catch (error) {
//     console.error("Error updating employee:", error.message);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });
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
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      existingEmployee.password = hashedPassword;
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
  // storage: storage,
});

const EmployeeImage = require("./models/Employee");
const storage1 = multer.diskStorage({
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
const upload1 = multer({
  storage: storage,
});

app.post("/api/products", upload.single("file"), async (req, res) => {
  const { name, description, price, image, category, quantity } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      description,
      price,
      image,
      category,
      quantity,
    });
    console.log(res);
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.route("/api/products:id").get(async (req, res) => {
  const { id } = req.params;

  try {
    const Products = await Product.findById(id);

    if (!products) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(Products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error });
  }
});
// app.post("/api/products", async (req, res) => {
//   // Assume the frontend sends an array of product objects
//   const products = req.body; // This should be an array of product objects

//   try {
//     // Insert all products at once
//     const newProducts = await Product.insertMany(products);

//     res.status(201).json({ success: true, products: newProducts });
//   } catch (error) {
//     console.error("Error adding products:", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });

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
app
  .route("/api/products/:id")
  .get(async (req, res) => {
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
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  })
  .put(upload.single("file"), async (req, res) => {
    const productId = req.params.id;
    const { name, description, price, category, quantity, image } = req.body;
    const updatedFields = {
      name,
      description,
      price,
      category,
      quantity,
      image,
    };

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      // Update text fields
      Object.assign(product, updatedFields);

      // Update the image field if a file was uploaded
      if (req.file) {
        product.image = req.file.filename;
      }

      await product.save();

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Error updating product:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal SSSserver error" });
    }
  })
  .patch(async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      // Decrement the quantity by 1
      if (product.quantity > 0) {
        product.quantity -= 1;
        await product.save();
        res.json({
          success: true,
          message: "Product quantity updated",
          product,
        });
      } else {
        res.status(400).json({ success: false, message: "Out of stock" });
      }
    } catch (error) {
      console.error("Error updating product quantity:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  });

// api to get employye by employee id
app.route("/employeeNames/:id").get(async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await EmployeeModel.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error });
  }
});
app.route("/employeeNames/:id").put(upload.single("file"), async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, image } = req.body;

  try {
    // Prepare the update object
    const updateData = { name, email, role, image };

    // If a password is provided, hash it before updating
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Find and update the employee
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated document and ensure validation
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
});
// khalti api>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.post("/khalti-api", async (req, res) => {
  const payload = req.body;
  const authkey = process.env.KHALTI_SECRET_KEY;
  const khaltiResponse = await axios.post(
    "https://a.khalti.com/api/v2/epayment/initiate/",
    payload,
    {
      headers: {
        Authorization: `Key ${authkey}`,
      },
    }
  );
  if (khaltiResponse) {
    res.json({
      success: true,
      data: khaltiResponse?.data,
    });
  } else {
    res.json({
      success: false,
      message: "something went wrong",
    });
  }

  console.log(khaltiResponse);
});
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
app.get("/", (req, res) => {
  res.send("Welcome to the home page!");
});

app.post("/api/purchasehistory", async (req, res) => {
  const {
    userId,
    productId,
    productName,
    price,
    category,
    purchaseDate,
    status,
    transactionId,
  } = req.body;

  // Validate required fields
  // if (!userId || !productId || !productname || !price || !category) {
  //   return res.status(400).json({ message: "All fields are required." });
  // }

  try {
    const newPurchase = new PurchaseHistory({
      userId,
      productId,
      productName,
      price,
      category,
      purchaseDate,
      status,
      transactionId,
    });

    // Save the product to the database
    await newPurchase.save();

    res.status(201).json({
      message: "Product created successfully.",
      purchase: newPurchase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product hisotry.",
      error: error.message,
    });
  }
});

// GET API to fetch all products
app.route("/api/purchasehistory/:userId").get(async (req, res) => {
  const { userId } = req.params;
  try {
    const purchasehist = await PurchaseHistory.find({ userId });
    if (!purchasehist) {
      return res.status(404).json({ message: "purchase history not found" });
    }
    res.status(200).json(purchasehist);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products.", error: error.message });
  }
});
app.post("/api/verify-payment", async (req, res) => {
  const { pidx } = req.body;
  const authkeyy = process.env.KHALTI_SECRET_KEY;
  try {
    // Verify payment with Khalti
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${authkeyy}`, // Replace with your actual secret key
          "Content-Type": "application/json",
        },
      }
    );

    // Respond with the payment status
    console.log(response.data.status);
    return res.status(200).json({ status: response.data.status });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>ending>>>>>>>>>>>>>
// end of deleteuser func
// end>>>>>>>>>>
const IpAddress = require("./models/Ipschema");
// app.use((req, res, next) => {
//   const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//   // Save the IP address to the database
//   const ipEntry = new IpAddress({ ipAddress });
//   ipEntry.save((err) => {
//     if (err) console.error(err);
//     next();
//   });
// });
// app.post("/log-ip", (req, res) => {
//   const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//   // Save the IP address to the database
//   const ipEntry = new IpAddress({ ipAddress });
//   ipEntry.save((err) => {
//     if (err) return res.status(500).send("Error saving IP address.");
//     res.send("IP address captured and stored in the database.");
//   });
// });

// app.post("/log-ip", (req, res) => {
//   // Get the IP address from the request
//   const ipAddress = req.ip || req.socket.remoteAddress;

//   console.log(`IP Address logged: ${ipAddress}`);

//   // Respond back to the client
//   res.send("IP address logged successfully");
// });
// // Sample route
// app.get("/log-ip", (req, res) => {
//   res.send("IP address captured and stored in the database.");
//   console.log("IP address captured and stored in the database");
// });
// app.post("/log-ip", async (req, res) => {
//   // Get the IP address and User-Agent from the request
//   const ipAddress = req.ip || req.socket.remoteAddress;
//   const userAgent = req.headers["user-agent"];

//   // Create a new entry in the database
//   const ipEntry = new IpAddress({
//     ipAddress,
//     userAgent, // Include User-Agent in the entry
//     timestamp: new Date(), // Optionally, log the timestamp
//   });

//   try {
//     await ipEntry.save(); // Save to the database
//     console.log(`IP Address logged: ${ipAddress}`);
//     console.log(`User-Agent logged: ${userAgent}`);
//     res.send("IP address and User-Agent logged successfully");
//   } catch (err) {
//     console.error("Error saving IP address:", err);
//     res.status(500).send("Error logging IP address");
//   }
// });
// app.post("/log-ip", async (req, res) => {
//   // Get the IP address and User-Agent from the request
//   // const ipAddress = req.ip || req.socket.remoteAddress;
//   const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

//   const userAgent = req.headers["user-agent"];

//   try {
//     // Fetch geolocation data based on IP address
//     const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
//     const location = geoResponse.data;

//     // Create a new entry in the database
//     const ipEntry = new IpAddress({
//       ipAddress,
//       userAgent,
//       location: {
//         country: location.country,
//         region: location.region,
//         city: location.city,
//         latitude: location.lat,
//         longitude: location.lon,
//       },
//       timestamp: new Date(),
//     });

//     await ipEntry.save(); // Save to the database
//     console.log(`IP Address logged: ${ipAddress}`);
//     console.log(`User-Agent logged: ${userAgent}`);
//     console.log(`Location logged: ${JSON.stringify(location)}`);
//     res.send("IP address, User-Agent, and location logged successfully");
//   } catch (err) {
//     console.error("Error logging data:", err);
//     res.status(500).send("Error logging IP address or fetching geolocation");
//   }
// });
// app.post("/log-ip", async (req, res) => {
//   // Get the IP address from the headers, prioritizing 'x-forwarded-for'
//   const ipAddress = req.headers["x-forwarded-for"]
//     ? req.headers["x-forwarded-for"].split(",")[0]
//     : req.socket.remoteAddress;

//   const userAgent = req.headers["user-agent"];

//   try {
//     // Fetch geolocation data based on IP address
//     const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
//     const location = geoResponse.data;

//     // Create a new entry in the database
//     const ipEntry = new IpAddress({
//       ipAddress,
//       userAgent,
//       location: {
//         country: location.country,
//         region: location.region,
//         city: location.city,
//         latitude: location.lat,
//         longitude: location.lon,
//       },
//       timestamp: new Date(),
//     });

//     await ipEntry.save(); // Save to the database
//     console.log(`IP Address logged: ${ipAddress}`);
//     console.log(`User-Agent logged: ${userAgent}`);
//     console.log(`Location logged: ${JSON.stringify(location)}`);
//     res.send("IP address, User-Agent, and location logged successfully");
//   } catch (err) {
//     console.error("Error logging data:", err);
//     res.status(500).send("Error logging IP address or fetching geolocation");
//   }
// });
const moment = require("moment-timezone");
app.post("/log-ip", async (req, res) => {
  // Get the IP address from the headers, prioritizing 'x-forwarded-for'
  const ipAddress = req.headers["x-forwarded-for"]
    ? req.headers["x-forwarded-for"].split(",")[0]
    : req.socket.remoteAddress;

  const userAgent = req.headers["user-agent"];

  try {
    // Fetch geolocation data based on IP address
    const geoResponse = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    const location = geoResponse.data;

    // Create a timestamp in UTC+5:45
    const timestamp = moment.utc().utcOffset(5.75).format(); // UTC+5:45 is +5.75 hours

    // Create a new entry in the database
    const ipEntry = new IpAddress({
      ipAddress,
      userAgent,
      location: {
        country: location.country,
        region: location.region,
        city: location.city,
        latitude: location.lat,
        longitude: location.lon,
      },
      timestamp, // Use the formatted timestamp
    });

    await ipEntry.save(); // Save to the database
    console.log(`IP Address logged: ${ipAddress}`);
    console.log(`User-Agent logged: ${userAgent}`);
    console.log(`Location logged: ${JSON.stringify(location)}`);
    console.log(`Timestamp logged: ${timestamp}`);
    res.send("IP address, User-Agent, and location logged successfully");
  } catch (err) {
    console.error("Error logging data:", err);
    res.status(500).send("Error logging IP address or fetching geolocation");
  }
});
app.get("/get-logs", async (req, res) => {
  try {
    const logs = await IpAddress.find();

    // Convert timestamps to UTC+5:45 before sending them to the client
    const convertedLogs = logs.map((log) => {
      return {
        ...log._doc,
        timestamp: moment(log.timestamp).utcOffset(5.75).format(), // Convert to UTC+5:45
      };
    });

    res.json(convertedLogs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).send("Error fetching logs");
  }
});
app.listen(3001, () => {
  console.log("server is ruuninng");
});
// end >>>>>>>>>>>>>>>>
