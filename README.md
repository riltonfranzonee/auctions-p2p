## Peer-to-Peer Auction System

This project is a simple implementation of an auction system, where users can offer their products with an initial value and the other nodes in the network can make bids while the auction is open. All processes/nodes are connected directly to each other and decentralized, using P2P networking architecture powered by [Pear](https://docs.pears.com/).

https://github.com/user-attachments/assets/5a430847-7241-43a3-9898-6a70f40afe09

Given this project's short time range and scope, and my lack of previous context with the tools, I've found `hyperswarm` an incredible tool, providing the right abstractions to help me get the job done timely, without worrying too much about the nitty-gritty details of DHT and RPC server config, so I've chosen to follow that path :)

Below are some of the main features I've built:

- Nodes that join the DHT after an auction starts can still participate, as we're cleverly propagating the auction state to every new connection that joins later.
- A good amount of edge cases were covered (and tested!), such as when someone attempts to bid on a closed auction or tries to close someone else's.

A few things I'd like to do better if I had the chance:

- Currently, the product names are unique across all users. For example, if `user1` creates a product named "Xbox", then no one else would be able to create a product with that name. Ideally, product names should be unique at a user level, not globally.
- Take some time to go more deeply into the docs to better understand the underlying concepts and building blocks of Pear. The platform seems extremely rich, and I'd love to explore more.
- Use hyperbee to persist the auctions in a local DB, rather than in memory, and set up some auth to let users recover their data when they restart the server.
