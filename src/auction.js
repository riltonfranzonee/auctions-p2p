class Auction {
  constructor(author, initialValue) {
    this.author = author;
    this.initialValue = Number(initialValue);
    this.highestBid = null;
    this.status = "open";
  }

  bid(client, value) {
    if (this.status !== "open") throw new Error("This auction is closed");
    if (this.author === client) throw new Error("You cannot bid on your own auction");
    if (this.highestBid && this.highestBid.value >= Number(value)) {
      throw new Error("Bid isn't higher than the current highest bid");
    }
    this.highestBid = { client, value: Number(value) };
  }

  close(client) {
    if (this.author !== client) throw new Error("Only the auction owner can close it");
    this.status = "closed";
    return this.highestBid;
  }

  restore(author, value, highestBid, status) {
    this.author = author;
    this.initialValue = value;
    this.highestBid = highestBid;
    this.status = status;
  }
}

class AuctionManager {
  constructor() {
    this.auctions = {};
  }

  openAuction(product, user, value) {
    if (this.auctions[product]) throw new Error("This product already exists");
    this.auctions[product] = new Auction(user, value);
  }

  bid(product, user, value) {
    if (!this.auctions[product]) throw new Error("This product does not exist");
    this.auctions[product].bid(user, value);
  }

  closeAuction(product, user) {
    if (!this.auctions[product]) throw new Error("This product does not exist");
    return this.auctions[product].close(user);
  }

  getStringifiedAuctions() {
    return JSON.stringify(this.auctions);
  }

  syncAuctionState(newAuctions) {
    const parsedAuctions = JSON.parse(newAuctions);
    if (Object.keys(this.auctions).length === 0 && Object.keys(parsedAuctions).length > 0) {
      for (const [key, existingAuction] of Object.entries(parsedAuctions)) {
        const auction = new Auction(null, 0);
        auction.restore(existingAuction.author, existingAuction.initialValue, existingAuction.highestBid, existingAuction.status);
        this.auctions[key] = auction;
      }
    }
  }
}

export { Auction, AuctionManager };
