const stripe = require("stripe")("sk_test_51JiYJVSDDRNqDUQuh9N5gXqE5jhXPdGt0Pwapc0VOk03AUZu9QcounLcPUUIS8Zf0HWp087CdlQEVEEembg3xk6h00bqRA0rRA");
const uuid = require("uuid/v4");

exports.makepayment = (req, res) => {
  //
  const { products, token } = req.body;
  console.log(products);

  let amount = 0;
  products.map((p) => {
    amount = amount + parseInt(p.price);
  });

  const idempotencyKey = uuid();

  return stripe.customer
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charge
        ?.create(
          {
            amount: amount *100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "a test account",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
                postal_code: token.card.address_zip,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => {
          console.log(err);
        });
    });
};