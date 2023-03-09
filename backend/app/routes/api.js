module.exports = function (express, pool, jwt, secret, crypto) {
  const apiRouter = express.Router();
  apiRouter.get("/", function (req, res) {
    res.json({ message: "Dobro dosli na nas API!" });
  });

  apiRouter.use(function (req, res, next) {
    const token =
      req.body.token ||
      req.params.token ||
      req.headers["x-access-token"] ||
      req.query.token;

    const reg = req.headers["authorization"] == "reg-token" ? true : false;
    const browse =
      req.headers["authorization"] == "browsing-token" ? true : false;

    if (token) {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          if (reg || browse) {
            next();
          } else {
            return res.status(403).send({
              success: false,
              message: "Wrong token",
            });
          }
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      if (reg || browse) {
        next();
      } else {
        return res.status(403).send({
          success: false,
          message: "No token",
        });
      }
    }
  });

  apiRouter
    .route("/users")
    .get(async function (req, res) {
      try {
        let conn = await pool.getConnection();
        let rows = await conn.query("SELECT * FROM users");
        conn.release();
        res.json({ status: "OK", users: rows });
      } catch (e) {
        console.log(e);
        return res.json({ code: 100, status: "Error with query" });
      }
    })
    .post(async function (req, res) {
      let salt = crypto.randomBytes(128).toString("base64");
      let hash = crypto.pbkdf2Sync(
        req.body.password,
        salt,
        10000,
        64,
        "sha512"
      );
      const user = {
        username: req.body.username,
        password: hash.toString("hex"),
        name: req.body.name,
        email: req.body.email,
        id: req.body.id,
        role: req.body.role,
        salt: salt,
      };

      try {
        let conn = await pool.getConnection();
        let q = await conn.query("INSERT INTO users SET ?", user);
        conn.release();
        res.json({ status: "OK", insertId: q.insertId });
      } catch (e) {
        console.log(e);
        res.json({ status: "NOT OK" });
      }
    })
    .put(async function (req, res) {
      const user = req.body;

      console.log(user);

      try {
        let conn = await pool.getConnection();
        let q = await conn.query("UPDATE users SET ? WHERE id = ?", [
          user,
          user.id,
        ]);
        conn.release();
        res.json({ status: "OK", changedRows: q.changedRows });
        console.log(q);
      } catch (e) {
        res.json({ status: "NOT OK" });
      }
    })
    .delete(async function (req, res) {
      res.json({ code: 101, status: "Body in delete request" });
    });

  apiRouter
    .route("/users/:id")
    .get(async function (req, res) {
      try {
        let conn = await pool.getConnection();
        let rows = await conn.query(
          "SELECT * FROM users WHERE id=?",
          req.params.id
        );
        conn.release();
        res.json({ status: "OK", user: rows[0] });
      } catch (e) {
        console.log(e);
        return res.json({ code: 100, status: "Error with query" });
      }
    })
    .delete(async function (req, res) {
      console.log("CALLED");

      try {
        let conn = await pool.getConnection();
        let q = await conn.query(
          "DELETE FROM users WHERE id = ?",
          req.params.id
        );
        conn.release();
        res.json({ status: "OK", affectedRows: q.affectedRows });
      } catch (e) {
        res.json({ status: "NOT OK" });
      }
    });

  apiRouter
    .route("/products")
    .get(async function (req, res) {
      try {
        let conn = await pool.getConnection();
        let rows = await conn.query("SELECT * FROM products");
        conn.release();
        res.json({ status: "OK", product: rows });
      } catch (e) {
        console.log(e);
        return res.json({ code: 100, status: "Error with query" });
      }
    })
    .post(async function (req, res) {
      try {
        let conn = await pool.getConnection();
        let q = await conn.query("INSERT INTO products SET ?", req.body);
        conn.release();
        res.json({ status: "OK", insertId: q.insertId });
      } catch (e) {
        console.log(e);
        res.json({ status: "NOT OK" });
      }
    })
    .put(async function (req, res) {
      console.log(req.body);

      try {
        let conn = await pool.getConnection();
        let q = await conn.query("UPDATE products SET ? WHERE id = ?", [
          req.body,
          req.body.id,
        ]);
        conn.release();
        res.json({ status: "OK", changedRows: q.changedRows });
        console.log(q);
      } catch (e) {
        console.log(e);
        res.json({ status: "NOT OK" });
      }
    });

  apiRouter
    .route("/products/:id")
    .delete(async function (req, res) {
      try {
        let conn = await pool.getConnection();
        let q = await conn.query(
          "DELETE FROM products WHERE id = ?",
          req.params.id
        );
        conn.release();
        res.json({ status: "OK", affectedRows: q.affectedRows });
      } catch (e) {
        res.json({ status: "NOT OK" });
      }
    })
    .get(async function (req, res) {
      try {
        let conn = await pool.getConnection();
        let q = await conn.query(
          "SELECT * FROM products WHERE category = ?",
          req.params.id
        );
        conn.release();
        res.json({ status: "OK", affectedRows: q });
      } catch (e) {
        res.json({ status: "NOT OK" });
      }
    });

  apiRouter.route("/categories").get(async function (req, res) {
    try {
      let conn = await pool.getConnection();
      let rows = await conn.query("SELECT DISTINCT category FROM products");
      conn.release();
      res.json({ status: "OK", product: rows });
    } catch (e) {
      console.log(e);
      return res.json({ code: 100, status: "Error with query" });
    }
  });

  apiRouter.route("/orders/:id").get(async function (req, res) {
    try {
      let conn = await pool.getConnection();
      let rows = await conn.query(
        "SELECT * FROM order_history WHERE userId = ?",
        req.params.id
      );
      conn.release();
      res.json({ status: "OK", product: rows });
    } catch (e) {
      console.log(e);
      return res.json({ code: 100, status: "Error with query" });
    }
  });

  apiRouter.route("/orders").post(async function (req, res) {
    try {
      let conn = await pool.getConnection();
      let q = await conn.query("INSERT INTO order_history SET ?", req.body);
      conn.release();
      console.log(req.body);
      res.json({ status: "OK", insertId: q });
    } catch (e) {
      console.log(e);
      res.json({ status: "NOT OK" });
    }
  });

  apiRouter.route("/favorites").post(async function (req, res) {
    try {
      let conn = await pool.getConnection();
      let q = await conn.query("INSERT INTO favorites SET ?", req.body);
      conn.release();
      res.json({ status: "OK", insertId: q });
    } catch (e) {
      console.log(e);
      res.json({ status: "NOT OK" });
    }
  });

  apiRouter.route("/favorites/:id").get(async function (req, res) {
    try {
      let conn = await pool.getConnection();
      let rows = await conn.query(
        "SELECT * FROM favorites WHERE userId = ?",
        req.params.id
      );
      conn.release();
      res.json({ status: "OK", product: rows });
    } catch (e) {
      console.log(e);
      return res.json({ code: 100, status: "Error with query" });
    }
  });

  apiRouter.route("/favorite").post(async function (req, res) {
    let qu = `DELETE FROM favorites WHERE userId = "${req.body.userId}" and id = ${req.body.productId}`;
    try {
      let conn = await pool.getConnection();
      let q = await conn.query(qu);

      conn.release();
      res.json({ status: "OK", affectedRows: q.affectedRows });
    } catch (e) {
      res.json({ status: "NOT OK" });
    }
  });

  apiRouter.get("/me", function (req, res) {
    console.log(req.decoded);
    res.send({ status: 200, user: req.decoded });
  });

  return apiRouter;
};
