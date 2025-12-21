//project identifier: 1761414855B69983BD8035097EFBD312EB2517F0
#include "drone.h"
#include <iostream>
#include <getopt.h>
#include <iomanip>

int main(int argc, char* argv[]){
    std::ios_base::sync_with_stdio(false);
    std::cout << std::setprecision(2);
    std::cout << std::fixed;

    Options options{};
    DroneDelivery drone;
    drone.getOptions(argc, argv, options);
    drone.readInput();
    if(options.mode == "MST"){
        drone.runMST();
    }
    else if (options.mode == "FASTTSP"){
        drone.runFASTTSP();
    }
    else if (options.mode == "OPTTSP"){
        drone.runOPTTSP();
    }
    return 0;
}
