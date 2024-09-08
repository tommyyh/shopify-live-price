const express = require('express');
const app = express();
const Shopify = require('shopify-api-node');

require('dotenv').config();

const shopify = new Shopify({
  shopName: process.env.SHOP_NAME,
  apiKey: process.env.API_KEY,
  password: process.env.PASSWORD,
});

// Get new price
const getUpdatedProducts = async () => {
  const res = await fetch(
    'https://dev.xboxkey.com/new/games.php?product=9PCB0B6BRK7K&lang=cz'
  );
  const data = await res.json();

  return [data];
};

// Get products
const getShopifyProducts = async () => {
  try {
    const products = await shopify.product.list({ limit: 5 });

    return products;
  } catch (error) {
    throw error;
  }
};

// Main
const main = async () => {
  const updatedProduct = await getUpdatedProducts();
  const shopifyProducts = await getShopifyProducts();

  const product = await shopify.product.get(9572802068816);

  shopify.product
    .update(9572802068816, {
      variants: [
        {
          ...product.variants[0],
          price: Math.random() * (5000 - 500) + 500,
        },
      ],
    })
    .then((product) => console.log(product))
    .catch((err) => console.log(err));

  // console.log(shopifyProducts[0].variants[0].price);
  // console.log(updatedProduct);

  // Create on shopify
  // updatedProduct.forEach((product) => {
  //   const {
  //     productID,
  //     ProductTitle,
  //     Description,
  //     Published_by,
  //     original_price,
  //     poster,
  //     Genres,
  //   } = product;

  //   shopify.product
  //     .create({
  //       id: productID,
  //       title: ProductTitle,
  //       body_html: Description,
  //       vendor: Published_by,
  //       variants: [
  //         {
  //           price: original_price,
  //         },
  //       ],
  //       images: [
  //         {
  //           src: poster,
  //         },
  //       ],
  //       tags: Genres.join(', '),
  //       product_type: 'Digital game',
  //       status: 'active',
  //     })
  //     .then((product) => console.log(product))
  //     .catch((err) => console.log(err));
  // });
};

main();
