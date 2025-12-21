// Project identifier: 0E04A31E0D60C01986ACB20081C9D8722A2519B6

#include "market.h"

int main(int argc, char* argv[]) {
    std::ios_base::sync_with_stdio(false);
    Options opts;
    Market market;
    market.getOptions(argc, argv, opts);
    market.run();
    return 0;
}