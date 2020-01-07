const errors = require("restify-errors");
const Customer = require("../models/Customer");

module.exports = server => {
  //Get Customers
  server.get("/api/customers", async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      next();
    } catch (err) {
      return next(new errs.InvalidContentError(err));
    }
  });

  //get single customers
  server.get("/api/customers/:id", async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with id of ${req.params.id}`
        )
      );
    }
  });

  //Post customer
  server.post("/api/customer", async (req, res, next) => {
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }
    const { name, email, balance } = req.body;
    const customers = new Customer({
      name,
      email,
      balance
    });
    try {
      const newCustomer = await customers.save();
      res.send(201);
      next();
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  });

  //update customers
  server.put("/api/customers:id", async (req, res, next) => {
    //check JSON
    if (!req.is("application/json")) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    try {
      const newCustomer = await Customer.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );
      res.send(200);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with id of ${req.params.id}`
        )
      );
    }
  });

  //delete customers
  server.del("/api/customers/:id", async (req, res, next) => {
    try {
      const deleteCustomer = await Customer.findByIdAndDelete({
        _id: req.params.id
      });
      res.send(204);
      next();
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no customer with id of ${req.params.id}`
        )
      );
    }
  });
};
