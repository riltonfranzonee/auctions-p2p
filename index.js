import { AuctionManager } from "./src/auction";
import SwarmManager from "./src/swarm-manager";
const auctionManager = new AuctionManager();
const swarmManager = new SwarmManager("auction", auctionManager);
Pear.teardown(() => swarmManager.destroy());
