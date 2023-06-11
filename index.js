$(document).ready(function () {
  $.get(
    'https://diwserver.vps.webdock.cloud/products/category/Accessories - Jewellery?page_items=10',
    function (data) {
      var products = data.products;
      var productCards = $('.product-card');

      productCards.each(function (index) {
        var product = products[index];
        var card = $(this);

        card.find('.card-img-top').attr('src', product.image);

        card.find('.card-title').text(product.title);

        var description = product.description;
        card.find('.card-text').html(description);

        card.find('.card-title').addClass('text-truncate');
        card.find('.card-text').addClass('text-truncate');

        card.find('.price').text('R$' + product.price.toFixed(2));

        card
          .find('.review-rate')
          .text('★★★★☆ (' + product.rating.rate.toFixed(1) + ')');

        var productId = product.id;
        card
          .find('.card-title')
          .wrap('<a href="detalhes.html?id=' + productId + '"></a>');
      });
    }
  );

  $(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    $.get(
      `https://diwserver.vps.webdock.cloud/products/${productId}`,
      function (product) {
        $('#product-title').text(product.title);
        $('#product-description').html(product.description);
        $('#product-price').text('Price: R$' + product.price.toFixed(2));
        $('#product-rating').text(
          'Rating: ' +
            product.rating.rate.toFixed(1) +
            ' (' +
            product.rating.count +
            ' ratings)'
        );
        $('#product-image').attr('src', product.image);
      }
    );
  });
});

$(document).ready(function () {
  // Handle form submission
  $('form').submit(function (event) {
    event.preventDefault();

    const articleType = $('#article').val().toLowerCase();
    const colorName = $('#color').val().toLowerCase();

    const newUrl = `pesquisa.html?article=${articleType}&cor=${colorName}`;

    window.open(newUrl, '_blank');
  });

  const urlParams = new URLSearchParams(window.location.search);

  const queryArticle = urlParams.get('article');
  const queryColour = urlParams.get('cor');

  const retrieveProducts = async () => {
    const productsPerPage = 300;

    const productsArray = [];

    try {
      const response = await fetch(
        `https://diwserver.vps.webdock.cloud/products/category/Accessories - Jewellery/?page_items=${productsPerPage}`
      );
      const data = await response.json();

      const searchData = data.products.filter((product) => {
        const article =
          queryArticle === '' ||
          product.articleType.toLowerCase().includes(queryArticle);
        const color =
          queryColour === '' ||
          product.baseColour.toLowerCase().includes(queryColour);
        return article && color;
      });

      productsArray.push(...searchData);
    } catch (error) {
      console.error('Something went wrong.' + error);
    }

    return productsArray;
  };

  retrieveProducts()
    .then((products) => {
      const cardsContainer = $('#cards');

      if (products.length === 0) {
        cardsContainer.html('<p>No products found.</p>');
      } else {
        const cardsHTML = products.map(
          (product) => `
            <div class="col-8 col-md-6 col-sm-6 mb-3 col-lg-3">
              <div class="product-card-search card">
                <img src="${product.image}" class="card-img-top product-card-search-image" alt="${product.title}" />
                <div class="card-body">
                  <a href="detalhes.html?id=${product.id}">
                    <h6 class="card-title">${product.title}</h6>
                  </a>
                  <div class="description-container">
                    <p class="card-text">${product.description}</p>
                  </div>
                  <div class="price">R$ ${product.price}</div>
                  
                </div>
              </div>
            </div>
          `
        );

        cardsContainer.html(cardsHTML.join(''));
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      $('#cards').html('<p>Error</p>');
    });

  $(document).ready(function () {
    var listGroup = $('.list-group');
    var button = $('#button');

    $.ajax({
      url: 'https://diwserver.vps.webdock.cloud/products/category/Accessories - Jewellery?page_items=20',
      method: 'GET',
      success: function (response) {
        var products = response.products;
        products.forEach(function (product) {
          var listItem = $('<div>', {
            class:
              'list-group-item d-flex justify-content-between align-items-center',
            text: product.title,
          });

          var reviewRate = $('<span>', {
            class: 'review-rate',
            text: `(${product.rating.rate})`,
          });

          listItem.append(reviewRate);
          listGroup.append(listItem);
        });
      },
    });
  });
});
