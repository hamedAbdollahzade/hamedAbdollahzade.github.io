const fnHandler = (event) => {
  username.classList.remove("input-f");
  password.classList.remove("input-f");

  if (event.target.id == "username") {
    username.classList.add("input-f");
  } else if (event.target.id == "password") {
    password.classList.add("input-f");
  }
};
