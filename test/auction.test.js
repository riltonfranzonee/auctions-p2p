// unit tests on the Auctions
import { describe, it } from "node:test";
import assert from "node:assert";
import { Auction } from "../src/auction.js";

describe("Auction Validations", () => {
  it("should throw an error if a user tries to close someone else's auction", () => {
    const auction = new Auction("author1", "100");
    assert.throws(() => auction.close("author2"), Error);
  });

  it("should throw an error if a bid is attempted after an auction is closed", () => {
    const auction = new Auction("author", "100");
    auction.close("author");
    assert.throws(() => auction.bid("author1", "120"), Error);
  });

  it("should throw an error if a user tries to bid its own auction", () => {
    const auction = new Auction("author1", "100");
    assert.throws(() => auction.bid("author1", "120"), Error);
  });

  it("should throw an error if a user tries to bid below the highest bid", () => {
    const auction = new Auction("author1", "100");
    auction.bid("author2", "120");
    assert.throws(() => auction.bid("author3", "110"), Error);
  });
});
