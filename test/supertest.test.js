import supertest from "supertest";
import chai from "chai";
import mongoose from "mongoose";
import "dotenv/config";

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

await mongoose.connect(process.env.MONGO_URL);

describe("Test CRUD de Products en la ruta /api/products/", function () {
  this.timeout(30000);
  let cookie = {};

  beforeEach(() => {
    console.log("Comienza test");
  });

  it("Ruta: api/sessions/login con metodo POST", async () => {
    const user = {
      email: "iastapenco@gmail.com",
      password: "Sharod79",
    };

    const resultado = await requester.post("/api/sessions/login").send(user);
    const cookieResult = resultado.headers["set-cookie"][0];

    expect(cookieResult).to.be.ok;

    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };

    expect(cookie.name).to.be.ok.and.equal("jwtCookie");
    expect(cookie.value).to.be.ok;
  });

  it("Ruta: api/products/ método GET", async () => {
    const { ok } = await requester.get("/api/products");

    expect(ok).to.be.ok;
  });

  it("Ruta: api/products/:id método GET", async () => {
    const { _body, ok } = await requester.get(
      "/api/products/64fbc9d1eca457c2fd5d63ff"
    );

    expect(_body.mensaje.title).to.be.equal("Cafe de Etiopia");
    expect(ok).to.be.ok;
  });

  it("Ruta: api/products/ método POST", async () => {
    const newProduct = {
      title: "Café Africano",
      description: "Café de especialidad",
      price: 500,
      stock: 1000,
      category: "cafe",
      status: true,
      code: "C15",
      thumbnails: [],
    };

    const { ok, statusCode } = await requester
      .post("/api/products/")
      .set("Cookie", [`${cookie.name} = ${cookie.value}`])
      .send(newProduct);

    if (ok) {
      expect(ok).to.be.ok;
    } else {
      expect(statusCode).to.be.equal(400);
    }
  });

  it("Ruta: api/products/ método PUT", async () => {
    const updateProduct = {
      title: "Café de Colombia",
      description: "Café de especialidad",
      price: 500,
      stock: 1000,
      category: "cafe",
      status: true,
      code: "C1",
      thumbnails: [],
    };

    const { ok } = await requester
      .put("/api/products/64fbc8dbeca457c2fd5d63f5")
      .set("Cookie", [`${cookie.name} = ${cookie.value}`])
      .send(updateProduct);

    expect(ok).to.be.ok;
  });

  it("Ruta: api/products/ método DELETE", async () => {
    const { ok } = await requester
      .delete("/api/products/658e12432a1d9bced70a60f1")
      .set("Cookie", [`${cookie.name} = ${cookie.value}`]);

    expect(ok).to.be.ok;
  });
});

describe("Test Users Session api/sessions", function () {
  this.timeout(60000);
  let cookie = {};

  beforeEach(() => {
    console.log("Comienza test");
  });

  it("Ruta: api/session/register con metodo POST", async () => {
    const newUser = {
      first_name: "Zully",
      last_name: "Rocha",
      age: 64,
      email: "zully@zully.com",
      password: "Zully1959",
    };

    const { _body, statusCode, ok } = await requester
      .post("/api/sessions/register")
      .send(newUser);

    if (ok) {
      expect(_body.mensaje).to.be.ok.and.have.property("_id");
    } else {
      expect(statusCode).to.equal(401);
    }
  });

  it("Ruta: api/sessions/login con metodo POST", async () => {
    const user = {
      email: "laura@laura.com",
      password: "lau8953",
    };

    const resultado = await requester.post("/api/sessions/login").send(user);
    const cookieResult = resultado.headers["set-cookie"][0];

    expect(cookieResult).to.be.ok;

    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };

    expect(cookie.name).to.be.ok.and.equal("jwtCookie");
    expect(cookie.value).to.be.ok;
  });

  it("Ruta: api/sessions/testJWT con metodo GET", async () => {
    const { _body } = await requester
      .get("/api/sessions/testJWT")
      .set("Cookie", [`${cookie.name} = ${cookie.value}`]);

    expect(_body.user.email).to.be.equal("laura@laura.com");
  });
});

describe("Test carrito en la ruta /api/carts", async function () {
  this.timeout(30000);
  let cookie = {};

  beforeEach(() => {
    console.log("Comienza test");
  });

  it("Ruta: api/sessions/login con metodo POST", async () => {
    const user = {
      email: "laura@laura.com",
      password: "lau8953",
    };

    const resultado = await requester.post("/api/sessions/login").send(user);
    const cookieResult = resultado.headers["set-cookie"][0];

    expect(cookieResult).to.be.ok;

    cookie = {
      name: cookieResult.split("=")[0],
      value: cookieResult.split("=")[1],
    };

    expect(cookie.name).to.be.ok.and.equal("jwtCookie");
    expect(cookie.value).to.be.ok;
  });

  it("Ruta: api/carts/:cid/products/:pid método POST", async () => {
    const quantity = {
      quantity: 2,
    };

    const { ok } = await requester
      .post(
        "/api/carts/6503c6c9cb214c056b9fac4f/products/64fbc8dbeca457c2fd5d63f5"
      )
      .set("Cookie", [`${cookie.name} = ${cookie.value}`])
      .send(quantity);

    expect(ok).to.be.ok;
  });
});
