const { add, square, asyncAdd, asyncSquare } = require("./utils");
const expect = require("expect");

it("Should add two numbers, async", (done) => {
  asyncAdd(4, 8, (sum) => {
    expect(sum).toBe(12);
    done();
  });
});

it("Should square a number, async", (done) => {
  asyncSquare(4, (res) => {
    expect(res).toBe(16);
    done();
  });
});

//it function on mocha take a0- name a1-call back function
it("Should check the type of the result", () => {
  var res = add(11, 22);
  //   if (res !== 33) throw new Error(`Expected 44, but got ${res}`);
  //or using jest library
  expect(typeof res).toBe("number");
});

it("Should square a number", () => {
  var res = square(4);
  //   if (res !== 16) throw new Error(`Expected 16, but got ${red}`);
  expect(res).toBe(16);
});

it("Some random values", () => {
  expect({ name: "gee" }).toEqual({ name: "gee" });
});
