//Project Identifier: 50EB44D3F029ED934858FFFCEAC3547C68251FC9
#include "letterman.h"
#include <getopt.h>
#include <iostream>
#include <fstream>
#include <sstream>
#include <deque>
#include <string>
#include <unordered_map>
#include <unordered_set>

int main(int argc, char* argv[]){
    std::ios_base::sync_with_stdio(false);
    Letterman letterman;    
    Options options; 
    letterman.getOptions(argc, argv, options);
    letterman.readDictionary(std::cin);
    letterman.search();
    letterman.output();
    return 0; 
}