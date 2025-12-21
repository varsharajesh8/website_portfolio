// Project identifier: 0E04A31E0D60C01986ACB20081C9D8722A2519B6

#include "market.h"
#include <cstdlib>
#include <algorithm>
#include <iostream>

// COMPARATORS
bool BuyComparator::operator()(const Order& a, const Order& b) const {
    //if prices are the same, earlier order has higher priority, goes higher on pq
    if(a.price == b.price){
        return a.sequenceID > b.sequenceID;
    }
    //if prices diff, higher price has higher priority, puts a below b 
    return a.price < b.price;
}

bool SellComparator::operator()(const Order& a, const Order& b) const {
    //if prices are the same, earlier order has higher priority, goes higher on pq
    if(a.price == b.price){
        return a.sequenceID > b.sequenceID;
    }
    //min heap, if prices diff, lower price has higher priority (use greater)
    return a.price > b.price;
}

// STOCK FUNCTIONS
void Stock::addMedian(int price) {
    //if lower half empty or price <= max of lower half, add to lower half
    if(maxHeap.empty() || price <= maxHeap.top()){
        maxHeap.push(price);
    }
    //else add to upper half
    else {
        minHeap.push(price);
    }
    //rebalance heaps if necessary
    //to rebalance, if maxHeap has more than one extra element, move top of maxHeap to minHeap
    if(maxHeap.size() > minHeap.size() + 1) {
        minHeap.push(maxHeap.top());
        maxHeap.pop();
    //if minHeap has more elements, move minHeap top to maxHeap
    } else if(minHeap.size() > maxHeap.size()) {
        maxHeap.push(minHeap.top());
        minHeap.pop();
    }
}

int Stock::getMedian() const {
    //we have a maxHeap containing the lower half of prices, minHeap containing upper half
    //if both heaps empty, return -1
    if(maxHeap.empty()) return -1;
    //if both heaps same size, median is average of two tops
    if(maxHeap.size() == minHeap.size()){
        return (maxHeap.top() + minHeap.top()) / 2;
    }
    //if maxHeap has one more element, median is top of maxHeap
    return maxHeap.top();
}

// MARKET FUNCTIONS
Market::Market() : numTraders(0), numStocks(0), sequenceCounter(0), tradesCompleted(0) {}

void Market::getOptions(int argc, char* argv[], Options &options) {
    opterr = 0;
    int choice = 0;
    int index = 0;
    option longOptions[] = {
        {"help", no_argument, nullptr, 'h'},
        {"verbose", no_argument, nullptr, 'v'},
        {"median", no_argument, nullptr, 'm'},
        {"trader_info", no_argument, nullptr, 'i'},
        {"time_travelers", no_argument, nullptr, 't'},
        {nullptr, 0, nullptr, '\0'},
    };

    while((choice = getopt_long(argc, argv, "hvmit", static_cast<option*>(longOptions), &index)) != -1) {
        switch(choice) {
            case 'h':
                std::cout << "Options:\n"
                          << " -h, --help Display help\n"
                          << " -v, --verbose Verbose output\n"
                          << " -m, --median Median output\n"
                          << " -i, --trader_info Trader info output\n"
                          << " -t, --time_travelers Time traveler output\n";
                exit(0);
            case 'v': options.useVerbose = true; break;
            case 'm': options.useMedian = true; break;
            case 'i': options.useTraderInfo = true; break;
            case 't': options.timeTraveler = true; break;
            default:
                std::cerr << "Unknown option\n";
                exit(1);
        }
    }
    opts = options;
}

void Market::run() {
    //print initial message
    std::cout << "Processing orders...\n";
    // Read input header
    readHeader(std::cin);

    //always resize stocks vector
    stocks.resize(numStocks);
    //resize traders vector only if option selected
    if(opts.useTraderInfo){
        traders.resize(numTraders);
    }


    if(mode == "PR") {
        uint32_t seed, numOrders, rate;
        std::string temp; 
        std::cin >> temp >> seed >> temp >> numOrders >> temp >> rate;
        std::stringstream ss;
        P2random::PR_init(ss, seed,
                          static_cast<unsigned int>(numTraders),
                          static_cast<unsigned int>(numStocks),
                          numOrders, rate);
        readOrders(ss);
    } else {
        readOrders(std::cin);
    }
    std::cout << "---End of Day---\n";
    std::cout << "Trades Completed: " << tradesCompleted << "\n";

    if(opts.useTraderInfo) outputTraderInfo();

    if(opts.timeTraveler){
        std::cout << "---Time Travelers---\n";
        for(size_t s = 0; s < stocks.size(); s++){
            TimeTraveler &tt = stocks[s].timeTraveler;
            if(tt.status == TimeStatus::NoTrades || tt.bestBuyPrice == -1 || tt.bestSellPrice == -1) {
                std::cout << "A time traveler could not make a profit on Stock " << s << "\n";
            } else {
                std::cout << "A time traveler would buy Stock " << s
                          << " at time " << tt.bestBuyTime
                          << " for $" << tt.bestBuyPrice
                          << " and sell it at time " << tt.bestSellTime
                          << " for $" << tt.bestSellPrice << "\n";
            }
        }
    }

    
}

void Market::readHeader(std::istream &inputStream) {
    std::getline(inputStream, commentLine); // COMMENT line
    std::string temp;
    inputStream >> temp >> mode >> temp >> numTraders >> temp >> numStocks;
}

void Market::readOrders(std::istream &inputStream) {
    int timestamp, previous_timestamp = -1;
    std::string action;
    char tChar, sChar, dollar, hash;
    int traderID, stockID, price, quantity;

    while(inputStream >> timestamp >> action >> tChar >> traderID >> sChar >> stockID >> dollar >> price >> hash >> quantity) {
        if(mode == "TL") {
            if(timestamp < 0) { std::cerr << "Invalid timestamp\n"; exit(1); }
            if(timestamp < previous_timestamp) { std::cerr << "Timestamps not non-decreasing\n"; exit(1); }
            if(traderID < 0 || static_cast<size_t>(traderID) >= numTraders) { std::cerr << "Invalid trader ID\n"; exit(1); }
            if(stockID < 0 || static_cast<size_t>(stockID) >= numStocks) { std::cerr << "Invalid stock ID\n"; exit(1); }
            if(price <= 0 || quantity <= 0) { std::cerr << "Price and quantity must be positive\n"; exit(1); }
        }

        //if timestamp changes and median option selected, output median for each stock
        if(timestamp != previous_timestamp && previous_timestamp != -1 && opts.useMedian) {
            for(size_t s = 0; s < numStocks; s++){
                if(!stocks[s].maxHeap.empty() || !stocks[s].minHeap.empty()){
                    outputMedian(static_cast<int>(s), previous_timestamp);
                } 
            }
        }
        //update timestamp
        previous_timestamp = timestamp;
        
        //create order
        bool isBuy = (action == "BUY");
        //update time traveler info if option selected before pushing into pq
        if(opts.timeTraveler) {
            updateTimeTraveler(static_cast<size_t>(stockID), timestamp, price, isBuy);
        }
        Order ord{price, quantity, traderID, static_cast<int>(sequenceCounter++)};
        Stock &stk = stocks[static_cast<size_t>(stockID)];
        if(isBuy) stk.buyPQ.push(ord);
        else stk.sellPQ.push(ord);
        //attempt to match after each new
        matchOrders(static_cast<size_t>(stockID));
    }
    //print median one more time for final timestamp
    //no next timestamp to trigger printing in loop above, so need to print last timestamp out of loop
    if(opts.useMedian && previous_timestamp != -1) {
        for(size_t s = 0; s < numStocks; s++){
            if(!stocks[s].maxHeap.empty() || !stocks[s].minHeap.empty()){
                outputMedian(static_cast<int>(s), previous_timestamp);
            } 
        }
    }
}

void Market::matchOrders(size_t stockID) {
    //once new order goes in, go through all previous orders to see if match
        Stock &stk = stocks[stockID];
        //as long as buy pq and sell pq not empty and top buy price >= top sell price (required to trade)
        while(!stk.buyPQ.empty() && !stk.sellPQ.empty() && stk.buyPQ.top().price >= stk.sellPQ.top().price) {
            //pop top buy and sell orders
            Order buy = stk.buyPQ.top(); 
            stk.buyPQ.pop();
            Order sell = stk.sellPQ.top(); 
            stk.sellPQ.pop();

            //determine trade quantity as being minimum of how much buyer wants and how much seller has
            int tradeQty = std::min(buy.quantity, sell.quantity);
            int tradePrice;
            if(buy.sequenceID < sell.sequenceID) {
                //buy came first, buyer pays buyer's price
                tradePrice = buy.price;
            }
            else {
                //sell came first, buyer pays seller's price
                tradePrice = sell.price;
            }
            //print verbose output if option selected
            if(opts.useVerbose) {
                std::cout << "Trader " << buy.traderID << " purchased " << tradeQty
                          << " shares of Stock " << stockID << " from Trader " << sell.traderID
                          << " for $" << tradePrice << "/share\n";
            }
            //update trader info if option selected
            if(opts.useTraderInfo) {
                //buyer bought tradeQty shares, paid tradeQty * tradePrice
                //seller sold tradeQty shares, received tradeQty * tradePrice
                //static cast to size_t to avoid warning
                //calculating netvalue as money received - money paid
                traders[static_cast<size_t>(buy.traderID)].bought += tradeQty;
                traders[static_cast<size_t>(buy.traderID)].netValue -= tradeQty * tradePrice;
                traders[static_cast<size_t>(sell.traderID)].sold += tradeQty;
                traders[static_cast<size_t>(sell.traderID)].netValue += tradeQty * tradePrice;
            }
            //update running median if option selected by adding that trade price
            if(opts.useMedian){
                stk.addMedian(tradePrice);
            }
            //add to count of trades completed
            tradesCompleted++;
            //if buy or sell order not completely fulfilled, push back with updated quantity, same sequenceID
            if(buy.quantity > tradeQty) { buy.quantity -= tradeQty; stk.buyPQ.push(buy); }
            if(sell.quantity > tradeQty) { sell.quantity -= tradeQty; stk.sellPQ.push(sell); }
        }    
}
//output median for a stock at a given timestamp
void Market::outputMedian(int stockID, int previous_timestamp) const {
    //get median from stock's median heaps
    int med = stocks[static_cast<size_t>(stockID)].getMedian();
    if(med != -1){
        //print median message
        std::cout << "Median match price of Stock " << stockID
                             << " at time " << previous_timestamp
                             << " is $" << med << "\n";
    }
}
//output trader info for all trades
void Market::outputTraderInfo() const {
    std::cout << "---Trader Info---\n";
    for(size_t t = 0; t < numTraders; t++) {
        std::cout << "Trader " << t << " bought " << traders[t].bought
                  << " and sold " << traders[t].sold
                  << " for a net transfer of $" << traders[t].netValue << "\n";
    }
}

void Market::updateTimeTraveler(size_t stockID, int timestamp, int orderPrice, bool isBuyOrder) {
    //get specific stock's time traveler info, reference as tt
    TimeTraveler &tt = stocks[stockID].timeTraveler;

    switch(tt.status) {

        case TimeStatus::NoTrades:
            if (!isBuyOrder) {
                // First sell order, potential buy for timetraveler
                tt.bestBuyPrice = orderPrice;
                tt.bestBuyTime = timestamp;
                tt.status = TimeStatus::CanBuy;
            }
            break;

        case TimeStatus::CanBuy:
            if (!isBuyOrder) { //sell order, if better than current best buy, update (lower price)
                if (orderPrice < tt.bestBuyPrice) { // lower sell, better buy for time traveler
                    tt.bestBuyPrice = orderPrice;
                    tt.bestBuyTime = timestamp;
                    // remain in CanBuy state
                }
            } 
            else {  //buy order, chancee to complete trade
                int32_t profit = orderPrice - tt.bestBuyPrice;
                int32_t currentProfit = (tt.bestSellPrice != -1) ? (tt.bestSellPrice - tt.bestBuyPrice) : -1;
                if (orderPrice > tt.bestBuyPrice && profit > currentProfit) { //if price they're offering to buy for is higher than bestBuyPrice (what tt bought), profitable and tt should sell
                    tt.bestSellPrice = orderPrice;
                    tt.bestSellTime = timestamp;
                    tt.status = TimeStatus::CompleteTrade;
                }
            }
            break;

        case TimeStatus::CompleteTrade:
            if (!isBuyOrder) { //sell order, if it is better price (lower) than current bestBuy, start new potential trade
                if (orderPrice < tt.bestBuyPrice) { // lower sell, new potential
                    tt.possibleSellPrice = orderPrice;
                    tt.possibleSellTime = timestamp;
                    tt.status = TimeStatus::Potential;
                }
            } 
            else { //buy order, better price (higher) than before, update best sell
                int32_t newProfit = orderPrice - tt.bestBuyPrice;
                int32_t currentProfit = tt.bestSellPrice - tt.bestBuyPrice;
                if (newProfit > currentProfit) { // higher buy, better profit for time traveler
                    tt.bestSellPrice = orderPrice;
                    tt.bestSellTime = timestamp;
                }
            }
            break;
            //maybe my problem is that i am only comparing price, need to compare profit in case sell changes
        case TimeStatus::Potential:
            //here, only buy order can complete trade
            if (!isBuyOrder) {
                if (orderPrice < tt.possibleSellPrice || tt.possibleSellPrice == -1) {
                    tt.possibleSellPrice = orderPrice;
                    tt.possibleSellTime = timestamp;
                }
            } else {
                int32_t potentialProfit = orderPrice - tt.possibleSellPrice;
                int32_t currentProfit = tt.bestSellPrice - tt.bestBuyPrice;
                if (orderPrice > tt.possibleSellPrice && potentialProfit > currentProfit) {
                    // finalize new trade
                    tt.bestBuyPrice = tt.possibleSellPrice;
                    tt.bestBuyTime = tt.possibleSellTime;
                    tt.bestSellPrice = orderPrice;
                    tt.bestSellTime = timestamp;
                    tt.possibleSellPrice = -1;
                    tt.possibleSellTime = -1;
                    tt.status = TimeStatus::CompleteTrade;
                }
            }
            break;
    }
}