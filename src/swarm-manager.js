import Hyperswarm from "hyperswarm";
import process from "bare-process";

export default class SwarmManager {
  constructor(topic, auctionManager) {
    this.swarm = new Hyperswarm();
    this.conns = [];
    this.serverKey = "";
    this.topic = Buffer.alloc(32).fill(topic);
    this.setupSwarm();
    this.setupStdinListener();
    this.auctionManager = auctionManager;
  }

  setupSwarm() {
    const discovery = this.swarm.join(this.topic, { client: true, server: true });
    discovery.flushed().then(() => {
      console.log("Joined topic:", this.topic.toString());
    });

    this.swarm.on("connection", (conn) => {
      const name = conn.remotePublicKey.toString("hex");
      console.log("* Got a connection from:", name, "*");
      // ensure incomming peers get in sync with current auctions
      conn.write(`sync-state ${this.auctionManager.getStringifiedAuctions()}`);
      this.conns.push(conn);
      conn.once("close", () => this.conns.splice(this.conns.indexOf(conn), 1));
      conn.on("data", (data) => {
        try {
          this.handleIncomingData(data.toString(), name);
        } catch (error) {}
      });
      conn.on("error", (e) => console.log(`Connection error: ${e}`));
    });
  }

  setupStdinListener() {
    process.stdin.on("data", (d) => {
      this.serverKey = this.swarm.server.address().publicKey.toString("hex");

      try {
        this.handleIncomingData(d.toString(), this.serverKey, false);
        for (const conn of this.conns) {
          conn.write(d);
        }
      } catch (error) {
        console.log(error.message);
      }
    });
  }

  handleIncomingData(data, user, log = true) {
    const [action, key, value] = data.replace("\n", "").split(" ");
    switch (action) {
      case "open":
        this.auctionManager.openAuction(key, user, value);
        console.log(`New product available: ${key}. Initial value: ${value}`);
        break;
      case "bid":
        this.auctionManager.bid(key, user, value);
        if (log) console.log(`Client ${user} made a bid for ${key} with ${value}`);
        break;
      case "close":
        const highestBid = this.auctionManager.closeAuction(key, user);
        console.log(`Auction closed! ${key}->${highestBid.value} USDt (${highestBid.client})`);
        break;
      case "sync-state":
        this.auctionManager.syncAuctionState(key);
        break;
      default:
        break;
    }
  }

  destroy() {
    this.swarm.destroy();
  }
}
