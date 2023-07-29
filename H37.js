'use strict';

const categories = [
  {
    id: 1,
    category: "Toys",
  },
  {
    id: 2,
    category: "Accessoires",
  },
  {
    id: 3,
    category: "Feeds",
  },
];

const products = [
  {
    id: 1,
    category_id: 1,
    name: "М'ячик для собак та котів",
    price: 270,
    description:
      "Виготовлений з міцної гуми, не містить шкідливих речовин. Для собак дрібних порід та котів",
  },
  {
    id: 2,
    category_id: 1,
    name: "Бобер. М'яка іграшка",
    price: 380,
    description:
      "Упоротий бобер. Іграшка потішить вашого домашнього улюбленця. Виготовлена з м'яких тканин, прошита міцними стіжками.",
  },
  {
    id: 3,
    category_id: 2,
    name: "Повідок-рулетка для собак",
    price: 700,
    description:
      "Довжина 3 м. Для невеликих порід",
  },

  {
    id: 4,
    category_id: 2,
    name: "Переноска",
    price: 1980,
    description:
      "Міцна простора переноска для котів та невеликих домашніх улюбленців. Оснащена поїлкою. Стане незамінною у тривалих подорожах",
  },
  {
    id: 5,
    category_id: 3,
    name: "Роял канін. Корм для собак",
    price: 2600,
    description:
      "Гіпоалергенний корм для усіх порід собак на основі рису та ягніти з додаванням овочів. Містить усі необхідні вітаміни та мінерали",
  },
  {
    id: 6,
    category_id: 3,
    name: "Клуб 4 лапи. Корм для котів",
    price: 450,
    description:
      "Сухий повнораціонний корм для стерилізованих котів на основі м'яса індички та тетерука.",
  }
];

const container = document.querySelector(".container");
const productsUl = document.querySelector("#products");
const description = document.querySelector("#description");
const buyButton = document.querySelector("#buy-button");
const form = document.querySelector(".form");
const cities = document.querySelector("select");
const userName = document.querySelector("input[name = userName]");
const storage = document.querySelector("input[name = storage]");
const countProducts = document.querySelector("input[name = count]");
const continueBtn = document.querySelector(".continue");
const payment = document.querySelectorAll("input[type = radio]");
let price = 0;
let productId = "";

container.addEventListener("click", (event) => {
  const target = event.target;
  let productsByCategory;

  if (target.closest("#categories")) {
    showProductList(productsByCategory, target);
  }

  if (target.closest("#products")) {
    document.querySelector(".infoOrder").innerHTML = "";
    showProductInfo(target, products);
  }

  if (target.closest("#buy-button")) {
    form.style.display = "block";
    buyButton.style.display = "none";
    description.style.display = "none";
  }

  if (target.closest(".continueBtn")) {
    validate(cities.value, userName.value, storage.value, countProducts.value);
    returnInitialItateForm();
  }

  if (target.closest(".my_orders")) {
    if (createListOrders().length > 0) {
      document.querySelector("#categories").innerHTML = "";
      productsUl.innerHTML = "";
      document.querySelector(".info").innerHTML = "";
      form.style.display = "none";
      productsUl.id = "info_order";
      document.querySelector("#categories").classList.add("order_list");
      createLiWithOrders(createListOrders());
    }
  }

  if (target.closest(".order_list")) {
    if (!target.closest(".delete")) {
      showOrderInfo(target, createListOrders());
    } else {
      deliteOrder(target, createListOrders());
    }
  }
});

function createArrayByCategory(categoryId) {
  const arrayCategory = products.filter((el) => {
    return el.category_id === categoryId;
  });
  return arrayCategory;
}

function showProductList(list, target) {
  list = createArrayByCategory(Number(target.dataset.categoryId));
  productsUl.innerHTML = "";

  list.forEach((el) => {
    const li = document.createElement("li");
    li.innerText = el.name;
    productsUl.appendChild(li);
  });

  productsUl.style.visibility = "visible";
}

function showProductInfo(target, listProduct) {
  const product = listProduct.find((el) => el.name === target.innerText);
  description.innerText = product.description;
  price = product.price;
  productId = product.id;
  buyButton.style.visibility = "visible";
  description.style.visibility = "visible";
}

function validate(city, name, storage, countProduct) {
  if (
    city.length > 0 &&
    name.trim().length > 0 &&
    Number(storage) > 0 &&
    Number(countProduct) > 0
  ) {
    const order = createOrder(
      cities.value,
      userName.value,
      storage.value,
      countProducts.value,
      payment,
      productId
    );

    localStorage.setItem(`${order.orderId}`, JSON.stringify(order));
    document.querySelector(".message").style.visibility = "hidden";
    form.style.display = "none";
    document.querySelector(".infoOrder").innerHTML = `<pre>${JSON.stringify(
      order,
      null,
      4
    )}<pre>`;
  } else {
    document.querySelector(".massege").style.visibility = "visible";
  }
}

function createOrder(city, name, storage, countProduct, payment, productId) {
  const order = {
    productId: productId,
    orderId: Date.now(),
    userCity: city,
    userName: name,
    storage: storage,
    countProduct: countProduct,
    payment: payment[0].checked ? "післяплата" : "банківська картка",
    date: `${new Date().toDateString()}`,
    totalPrice: price * Number(countProduct),
  };

  return order;
}

function returnInitialItateForm() {
  cities.selectedIndex = 0;
  userName.value = "";
  storage.value = "";
  countProducts.value = "";
  payment[0].checked = "checked";
}

function createListOrders() {
  const lastIndex = localStorage.length;
  const orderList = [];
  for (let i = 0; i < lastIndex; i++) {
    const key = localStorage.key(i);
    const item = localStorage.getItem(key);
    if (item.indexOf("orderId") !== -1) {
      orderList.push(JSON.parse(item));
    }
  }
  return orderList;
}

function createLiWithOrders(orders) {
  orders.forEach((el) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.innerText = "X";
    btn.classList.add("delete");
    btn.dataset.orderId = el.orderId;
    li.dataset.orderId = el.orderId;
    li.innerText = `Date: ${el.date}.
    TotalPrice: ${el.totalPrice}`;
    li.appendChild(btn);
    document.querySelector(".order_list").appendChild(li);
  });
}

function showOrderInfo(target, orderList) {
  productsUl.innerHTML = "";
  const li = document.createElement("li");
  const order = orderList.find(
    (el) => el.orderId === Number(target.dataset.orderId)
  );
  const product = products.find((el) => el.id === order.productId);
  li.innerText = `${JSON.stringify(order, null, 4)}`;
  productsUl.appendChild(li);
  document.querySelector(".info").innerText = product.description;
  document.querySelector(".info").style.width = "30vw";
  document.querySelector(".info").style.backgroundColor = "beige";
}

function deleteOrder(target, orderList) {
  if (orderList.length !== 0) {
    orderList.forEach((el) => {
      if (el.orderId === Number(target.dataset.orderId)) {
        localStorage.removeItem(Number(target.dataset.orderId));
        document
          .querySelector(
            `li[data-order-id = "${Number(target.dataset.orderId)}"]`
          )
          .remove();
        document.querySelector(".info").remove();
      }
    });
  }
}
