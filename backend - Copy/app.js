const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ------------------ CUSTOMER ------------------ */

// Add customer
app.post("/customers", async (req, res) => {
  const {
    customer_name,
    region,
    owner,
    env_hosted,
    contact_email,
    poc_name,
    poc_mobile,
    monitoring,
    database_mgmt,
    edi_mgmt,
    app_mgmt,
    release_mgmt,
    ops_view,
    automated_testing,
    extensions_mgmt,
    service_desk
  } = req.body;

  const result = await pool.query(
    `INSERT INTO customers (
      customer_name, region, owner, env_hosted, contact_email,
      poc_name, poc_mobile,
      monitoring, database_mgmt, edi_mgmt, app_mgmt,
      release_mgmt, ops_view, automated_testing,
      extensions_mgmt, service_desk
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    RETURNING *`,
    [
      customer_name, region, owner, env_hosted, contact_email,
      poc_name, poc_mobile,
      monitoring, database_mgmt, edi_mgmt, app_mgmt,
      release_mgmt, ops_view, automated_testing,
      extensions_mgmt, service_desk
    ]
  );

  res.json(result.rows[0]);
});
// Get customers
app.get("/customers", async (req, res) => {
  const result = await pool.query("SELECT * FROM customers ORDER BY id DESC");
  res.json(result.rows);
});

app.put("/customers/:id", async (req, res) => {
  const { id } = req.params;

  const {
    customer_name,
    region,
    owner,
    env_hosted,
    contact_email,
    poc_name,
    poc_mobile,
    monitoring,
    database_mgmt,
    edi_mgmt,
    app_mgmt,
    release_mgmt,
    ops_view,
    automated_testing,
    extensions_mgmt,
    service_desk
  } = req.body;

  const result = await pool.query(
    `UPDATE customers SET
      customer_name=$1,
      region=$2,
      owner=$3,
      env_hosted=$4,
      contact_email=$5,
      poc_name=$6,
      poc_mobile=$7,
      monitoring=$8,
      database_mgmt=$9,
      edi_mgmt=$10,
      app_mgmt=$11,
      release_mgmt=$12,
      ops_view=$13,
      automated_testing=$14,
      extensions_mgmt=$15,
      service_desk=$16
     WHERE id=$17 RETURNING *`,
    [
      customer_name, region, owner, env_hosted, contact_email,
      poc_name, poc_mobile,
      monitoring, database_mgmt, edi_mgmt, app_mgmt,
      release_mgmt, ops_view, automated_testing,
      extensions_mgmt, service_desk,
      id
    ]
  );

  res.json(result.rows[0]);
});

app.delete("/customers/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM customers WHERE id=$1", [id]);

  res.json({ message: "Deleted successfully" });
});
/* ------------------ EMPLOYEE ------------------ */

/* ------------------ EMPLOYEE ------------------ */

// Add employee
app.post("/employees", async (req, res) => {
  const {
    employee_name,
    email,
    phone,
    role
  } = req.body;

  const result = await pool.query(
    `INSERT INTO employees (
      employee_name,
      email,
      phone,
      role
    )
    VALUES ($1,$2,$3,$4)
    RETURNING *`,
    [
      employee_name,
      email,
      phone,
      role
    ]
  );

  res.json(result.rows[0]);
});


// Get employees
app.get("/employees", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM employees ORDER BY id DESC"
  );

  res.json(result.rows);
});


// Update employee
app.put("/employees/:id", async (req, res) => {
  const { id } = req.params;

  const {
    employee_name,
    email,
    phone,
    role
  } = req.body;

  const result = await pool.query(
    `UPDATE employees SET
      employee_name=$1,
      email=$2,
      phone=$3,
      role=$4
     WHERE id=$5
     RETURNING *`,
    [
      employee_name,
      email,
      phone,
      role,
      id
    ]
  );

  res.json(result.rows[0]);
});


// Delete employee
app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;

  console.log("Delete ID:", id); // DEBUG

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  await pool.query(
    "DELETE FROM employees WHERE id=$1",
    [id]
  );

  res.json({ message: "Deleted successfully" });
});

/* ------------------ ROLES ------------------ */

// Add role
app.post("/roles", async (req, res) => {
  const {
    role_name,
    monitoring,
    database_mgmt,
    edi_mgmt,
    app_mgmt,
    release_mgmt,
    ops_view,
    automated_testing,
    extensions_mgmt,
    service_desk
  } = req.body;

  const result = await pool.query(
    `INSERT INTO roles (
      role_name, monitoring, database_mgmt, edi_mgmt,
      app_mgmt, release_mgmt, ops_view,
      automated_testing, extensions_mgmt, service_desk
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
    [
      role_name,
      monitoring,
      database_mgmt,
      edi_mgmt,
      app_mgmt,
      release_mgmt,
      ops_view,
      automated_testing,
      extensions_mgmt,
      service_desk
    ]
  );

  res.json(result.rows[0]);
});

// Get roles
app.get("/roles", async (req, res) => {
  const result = await pool.query("SELECT * FROM roles ORDER BY id DESC");
  res.json(result.rows);
});

// Update role
app.put("/roles/:id", async (req, res) => {
  const { id } = req.params;
  const values = [...Object.values(req.body), id];

  const result = await pool.query(
    `UPDATE roles SET
      role_name=$1,
      monitoring=$2,
      database_mgmt=$3,
      edi_mgmt=$4,
      app_mgmt=$5,
      release_mgmt=$6,
      ops_view=$7,
      automated_testing=$8,
      extensions_mgmt=$9,
      service_desk=$10
     WHERE id=$11 RETURNING *`,
    values
  );

  res.json(result.rows[0]);
});

// Delete role
app.delete("/roles/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM roles WHERE id=$1", [id]);
  res.json({ message: "Deleted" });
});

/* ------------------ ACCESS MATRIX ------------------ */

// Add
app.post("/access-matrix", async (req, res) => {
  const {
    access_name,
    monitoring,
    database_mgmt,
    edi_mgmt,
    app_mgmt,
    release_mgmt,
    ops_view,
    automated_testing,
    extensions_mgmt,
    service_desk
  } = req.body;

  const result = await pool.query(
    `INSERT INTO access_matrix (
      access_name, monitoring, database_mgmt, edi_mgmt,
      app_mgmt, release_mgmt, ops_view,
      automated_testing, extensions_mgmt, service_desk
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *`,
    [
      access_name,
      monitoring,
      database_mgmt,
      edi_mgmt,
      app_mgmt,
      release_mgmt,
      ops_view,
      automated_testing,
      extensions_mgmt,
      service_desk
    ]
  );

  res.json(result.rows[0]);
});

// Get
app.get("/access-matrix", async (req, res) => {
  const result = await pool.query("SELECT * FROM access_matrix ORDER BY id DESC");
  res.json(result.rows);
});

// Update
app.put("/access-matrix/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const {
    access_name,
    monitoring,
    database_mgmt,
    edi_mgmt,
    app_mgmt,
    release_mgmt,
    ops_view,
    automated_testing,
    extensions_mgmt,
    service_desk
  } = req.body;

  const result = await pool.query(
    `UPDATE access_matrix SET
      access_name=$1,
      monitoring=$2,
      database_mgmt=$3,
      edi_mgmt=$4,
      app_mgmt=$5,
      release_mgmt=$6,
      ops_view=$7,
      automated_testing=$8,
      extensions_mgmt=$9,
      service_desk=$10
     WHERE id=$11 RETURNING *`,
    [
      access_name,
      monitoring,
      database_mgmt,
      edi_mgmt,
      app_mgmt,
      release_mgmt,
      ops_view,
      automated_testing,
      extensions_mgmt,
      service_desk,
      id
    ]
  );

  res.json(result.rows[0]);
});

// Delete
app.delete("/access-matrix/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  await pool.query("DELETE FROM access_matrix WHERE id=$1", [id]);

  res.json({ message: "Deleted" });
});
/* ------------------ ACCESS LOGIC ------------------ */
app.post("/generate-access", async (req, res) => {
  try {
    const { employeeId, customerId } = req.body;

    if (!employeeId || !customerId) {
      return res.status(400).json({ error: "Missing inputs" });
    }

    /* ================= NORMALIZED BOOLEAN ================= */
    const isTrue = (v) => {
      if (v === true || v === 1) return true;
      if (typeof v === "string") {
        return ["true", "yes", "y", "t", "1"]
          .includes(v.trim().toLowerCase());
      }
      return false;
    };

    /* ================= EMPLOYEE ================= */
    const empRes = await pool.query(
      "SELECT * FROM employees WHERE id=$1",
      [employeeId]
    );
    if (!empRes.rows.length)
      return res.status(404).json({ error: "Employee not found" });

    const employee = empRes.rows[0];

    /* ================= ROLE ================= */
    const roleRes = await pool.query(
      "SELECT * FROM roles WHERE role_name=$1",
      [employee.role]
    );
    if (!roleRes.rows.length)
      return res.status(404).json({ error: "Role not found" });

    const role = roleRes.rows[0];

    /* ================= CUSTOMER ================= */
    const custRes = await pool.query(
      "SELECT * FROM customers WHERE id=$1",
      [customerId]
    );
    if (!custRes.rows.length)
      return res.status(404).json({ error: "Customer not found" });

    const customer = custRes.rows[0];

    /* ================= SERVICES ================= */
    const services = [
      "monitoring",
      "database_mgmt",
      "edi_mgmt",
      "app_mgmt",
      "release_mgmt",
      "ops_view",
      "automated_testing",
      "extensions_mgmt",
      "service_desk"
    ];

    /* ================= SERVICE BREAKDOWN ================= */
    const serviceStatus = services.map((s) => ({
      service: s,
      roleAllowed: isTrue(role[s]),
      customerAllowed: isTrue(customer[s])
    }));

    /* ================= VALID SERVICES ================= */
    const validServices = serviceStatus
      .filter((s) => s.roleAllowed && s.customerAllowed)
      .map((s) => s.service);

    /* ================= ACCESS MATRIX ================= */
    const accessRes = await pool.query("SELECT * FROM access_matrix");

    const finalAccess = new Set();

    accessRes.rows.forEach((row) => {
      validServices.forEach((service) => {
        if (isTrue(row[service])) {
          finalAccess.add(row.access_name);
        }
      });
    });

    return res.json({
      employee: employee.employee_name,
      role: employee.role,
      customer: customer.customer_name,
      breakdown: serviceStatus,
      validServices,
      access: Array.from(finalAccess)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
/* ------------------ GENERATE EMAIL ------------------ */

app.post("/generate", async (req, res) => {
  const { customerId, employeeIds } = req.body;

  const customer = await pool.query(
    "SELECT * FROM customers WHERE id=$1",
    [customerId]
  );

  const employees = await pool.query(
    "SELECT * FROM employees WHERE id = ANY($1)",
    [employeeIds]
  );

  let tableRows = "";

  employees.rows.forEach((emp) => {
    const access = getAccess(emp.role);

    tableRows += `
      <tr>
        <td>${emp.employee_name}</td>
        <td>${emp.role}</td>
        <td>${access.n4 ? "Yes" : "No"}</td>
        <td>${access.db ? "Yes" : "No"}</td>
        <td>${access.vpn ? "Yes" : "No"}</td>
        <td>${access.vm ? "Yes" : "No"}</td>
      </tr>
    `;
  });

  const email = `
    <h3>Access Request - ${customer.rows[0].customer_name}</h3>
    <table border="1">
      <tr>
        <th>Name</th>
        <th>Role</th>
        <th>N4</th>
        <th>DB</th>
        <th>VPN</th>
        <th>VM</th>
      </tr>
      ${tableRows}
    </table>
  `;

  res.json({ email });
});
app.get("/dashboard", async (req, res) => {
  try {
    const customers = await pool.query("SELECT COUNT(*) FROM customers");
    const employees = await pool.query("SELECT COUNT(*) FROM employees");

    const pending = await pool.query(
      "SELECT COUNT(*) FROM requests WHERE status='ACTIVE'"
    );

    const revoked = await pool.query(
      "SELECT COUNT(*) FROM requests WHERE status='REVOKED'"
    );

    res.json({
      customers: parseInt(customers.rows[0].count),
      employees: parseInt(employees.rows[0].count),
      pending: parseInt(pending.rows[0].count),
      revoked: parseInt(revoked.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard error" });
  }
});
app.post("/requests", async (req, res) => {
  const {
    employee_id,
    customer_id,
    employee_name,
    role,
    customer_name,
    valid_services,
    access
  } = req.body;

  const result = await pool.query(
    `INSERT INTO requests (
  employee_id, customer_id, employee_name,
  role, customer_name, valid_services, access, status
)
VALUES ($1,$2,$3,$4,$5,$6,$7,'ACTIVE')
    RETURNING *`,
    [
      employee_id,
      customer_id,
      employee_name,
      role,
      customer_name,
      valid_services,
      access
    ]
  );

  res.json(result.rows[0]);
});
app.get("/requests", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM requests ORDER BY id DESC"
    );

    const formatted = result.rows.map(r => ({
      ...r,
      status: r.status || "ACTIVE"
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});
// Revoke access (update status)
app.put("/requests/revoke/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query(
      "SELECT status FROM requests WHERE id=$1",
      [id]
    );

    if (!check.rows.length) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (check.rows[0].status === "REVOKED") {
      return res.json({ message: "Already revoked" });
    }

    const result = await pool.query(
      "UPDATE requests SET status='REVOKED' WHERE id=$1 RETURNING *",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Revoke failed" });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});