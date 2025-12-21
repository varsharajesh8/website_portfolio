//project identifier 01BD41C3BF016AD7E8B6F837DF18926EC3251350
#include "logman.h"
#include <iostream>
#include <string>

int main(int argc, char* argv[]){
    std::ios_base::sync_with_stdio(false);
    Options options;
    Logman logman;
    logman.getOptions(argc, argv, options);
    //read logman file
    logman.readFile(options.filename);
    logman.run();
    return 0;
}