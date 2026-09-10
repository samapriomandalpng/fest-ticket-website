const performanceCheckboxes = document.querySelectorAll(
  ".performance-checkbox"
);

const quantity = document.getElementById("quantity");
const foodInputs = document.querySelectorAll(".food-quantity");
const liveTotal = document.getElementById("liveTotal");
const photoInput = document.getElementById("photoInput");
const imagePreview = document.getElementById("imagePreview");

function money(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function selectedPerformances() {
  return [...performanceCheckboxes].filter(
    (checkbox) => checkbox.checked
  );
}

function calculateTotal() {
  const ticketCount = Math.max(
    1,
    Number(quantity.value) || 1
  );

  const performanceTotal = selectedPerformances().reduce(
    (sum, checkbox) => {
      return sum + Number(checkbox.dataset.price);
    },
    0
  );

  let total = performanceTotal * ticketCount;

  foodInputs.forEach((input) => {
    const foodPrice = Number(input.dataset.price);
    const foodQuantity = Math.max(
      0,
      Number(input.value) || 0
    );

    total = total + foodPrice * foodQuantity;
  });

  liveTotal.textContent = money(total);

  return total;
}

document.querySelectorAll(".choose-pass").forEach((button) => {
  button.addEventListener("click", () => {
    const matchingCheckbox = [...performanceCheckboxes].find(
      (checkbox) => {
        return checkbox.value === button.dataset.pass;
      }
    );

    if (matchingCheckbox) {
      matchingCheckbox.checked = true;
    }

    calculateTotal();

    document.getElementById("booking").scrollIntoView({
      behavior: "smooth"
    });
  });
});

[
  quantity,
  ...performanceCheckboxes,
  ...foodInputs
].forEach((input) => {
  input.addEventListener("input", calculateTotal);
  input.addEventListener("change", calculateTotal);
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];

  if (!file) {
    imagePreview.removeAttribute("src");
    imagePreview.style.display = "none";
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    imagePreview.src = reader.result;
    imagePreview.style.display = "block";
  });

  reader.readAsDataURL(file);
});

document
  .getElementById("ticketForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) {
      return;
    }

    const selected = selectedPerformances();

    const performanceError =
      document.getElementById("performanceError");

    if (selected.length === 0) {
      performanceError.hidden = false;

      document
        .querySelector(".performance-fieldset")
        .scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      return;
    }

    performanceError.hidden = true;

    const foods = [];

    foodInputs.forEach((input) => {
      const count = Number(input.value) || 0;

      if (count > 0) {
        foods.push(
          `${input.dataset.name} × ${count}`
        );
      }
    });

    const ticketCount = Number(quantity.value);

    const fullName = document
      .getElementById("fullName")
      .value
      .trim();

    const email = document
      .getElementById("email")
      .value
      .trim();

    const selectedNames = selected.map(
      (checkbox) => checkbox.value
    );

    document.getElementById("ticketName").textContent =
      fullName;

    document.getElementById("ticketEmail").textContent =
      email;

    document.getElementById("ticketPass").textContent =
      selectedNames.join(" + ").toUpperCase();

    document.getElementById("ticketQuantity").textContent =
      ticketCount;

    document.getElementById("stubQuantity").textContent =
      ticketCount;

    document.getElementById("ticketFood").textContent =
      foods.length > 0
        ? `Food: ${foods.join(" · ")}`
        : "No food add-ons";

    document.getElementById("ticketTotal").textContent =
      money(calculateTotal());

    document.getElementById("bookingId").textContent =
      `KGP-${Date.now().toString().slice(-7)}`;

    document.getElementById("emptyTicket").hidden = true;
    document.getElementById("ticketCard").hidden = false;
    document.getElementById("printTicket").hidden = false;

    document.getElementById("ticket").scrollIntoView({
      behavior: "smooth"
    });
  });

document
  .getElementById("printTicket")
  .addEventListener("click", () => {
    window.print();
  });

calculateTotal();