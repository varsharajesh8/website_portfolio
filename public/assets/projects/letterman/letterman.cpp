//Project Identifier: 50EB44D3F029ED934858FFFCEAC3547C68251FC9
#include "letterman.h"
#include <getopt.h>
#include <iostream>
#include <algorithm>
#include <sstream>


//public functions
void Letterman::getOptions(int argc, char* argv[], Options &options) {
  opterr = 0; // Let us handle all error output for command line options
  int choice = 0;
  int index = 0;
  option longOptions[] = {
      {"help", no_argument, nullptr, 'h'},
      {"queue", no_argument, nullptr, 'q'},
      {"stack", no_argument, nullptr, 's'},
      {"begin", required_argument, nullptr, 'b'},
      {"end", required_argument, nullptr, 'e'},
      {"output", required_argument, nullptr, 'o'},
      {"change", no_argument, nullptr, 'c'},
      {"length", no_argument, nullptr, 'l'},
      {"swap", no_argument, nullptr, 'p'},
      {nullptr, 0, nullptr, '\0'},
  }; // longOptions[]

  while ((choice = getopt_long(argc, argv, "hqsb:e:o:clp", static_cast<option *>(longOptions), &index)) != -1) {
      switch (choice) {
          case 'h':
              std::cout << "Usage: ./letterman [options] < inputfile > outputfile\n"
              << "Options:\n"
              << " -h, --help Display this help message and exit\n"
              << " -q, --queue Use a queue\n"
              << " -s, --stack Use a stack\n"
              << " -b, --begin <str> Specifies word that Letterman starts with\n"
              << " -e, --end <str> Specifies word that Letterman must reach\n"
              << " -o, --output <W|M> W = word format output (default) or \n M = modification format output\n"
              << " -c, --change Allow change a letter in the word\n"
              << " -l, --length Allow inserting and deleting a letter in the word\n"
              << " -p, --swap Allow swapping of adjacent letters in the word\n";
              exit(0);
          case 'q':
              options.useQueue = true;
              break;
          case 's':
              options.useStack = true;
              break;
          case 'b':
              if (!options.beginWord.empty()) {
                  std::cerr << "Error: multiple begin words specified\n";
                  exit(1);
              }
              options.beginWord = optarg;
              break;
          case 'e':
              if (!options.endWord.empty()) {
                  std::cerr << "Error: multiple end words specified\n";
                  exit(1);
              }
              options.endWord = optarg;
              break;
          case 'o':
              if(optarg != nullptr) {
                  if(std::string(optarg) == "W"){
                      options.outputFormat = "word";
                  }
                  else if(std::string(optarg) == "M"){
                      options.outputFormat = "modification";
                  }
                  else{
                      std::cerr << "Error: invalid output format\n";
                      exit(1);
                  }
              }// already set default to word in options struct, no else needed
              break;
          case 'c':
              options.allowChange = true;
              break;
          case 'l':
              options.allowLength = true;
              break;
          case 'p':
              options.allowSwap = true;
              break;
          default:
          std::cerr << "Error: invalid option\n";
            exit(1);
      } 
  } // while
  if(!options.useQueue && !options.useStack){ //neither ADT specified
      std::cerr << "Error: no data structure specified. Please specify stack or queue.\n";
      exit(1);
  }
  if(options.useQueue && options.useStack){ //both ADTs specified
      std::cerr << "Error: cannot use both stack and queue\n";
      exit(1);
  }
  if(options.beginWord.empty()){ //missing begin word
      std::cerr << "Error: specify begin word\n";
      exit(1);
  }
  if(options.endWord.empty()){ //missing end word
      std::cerr << "Error: specify end word\n";
      exit(1);
  }
  if(!options.allowChange && !options.allowLength && !options.allowSwap){ //at least one modification specified
      std::cerr << "Error: At least one modification mode must be specified\n";
      exit(1);
  }
  this->options = options; //store options in member variable
}


void Letterman::readDictionary(std::istream &in) {
    std::string line;
    char dictType = '\0';
    size_t N = 0; //number of words in dictionary

    //read dict type 
    while (std::getline(in, line)) {
        if(line.empty() || (line.size()>=2 && line[0]=='/' && line[1]=='/')) {
            continue;
        }
        dictType = line[0];
        break;
    }

    //error check for dict type
    if(dictType == '\0') {
        std::cerr << "Error: empty dictionary type\n";
        exit(1);
    }

    // read N 
    while(std::getline(in, line)){
        if(line.empty() || (line.size()>=2 && line[0]=='/' && line[1]== '/')){
            continue;
        }
        std::istringstream iss(line);
        iss >> N;
        break;
    }

    dictionary.clear();
    //reserve space for N words in dictionary 
    dictionary.reserve(N); 
    if(dictType == 'S'){
        readSimpleDictionary(in, N);
    }
    else if(dictType == 'C'){
        readComplexDictionary(in, N);
    }
    else{
        std::cerr << "Error: invalid dictionary type\n";
        exit(1);
    }
}

void Letterman::readSimpleDictionary(std::istream &in, size_t N){
    dictionary.clear();
    dictionary.reserve(N);
    beginWordIndex = size_t(-1);
    endWordIndex   = size_t(-1);
    std::string line;
    size_t count = 0;
    for(; count < N && std::getline(in, line); ){
        if(line.empty() || (line.size()>=2 && line[0]=='/' && line[1]=='/')){
            continue;
        }
        //debug print 
        // std::cerr << "Read word: '" << line << "'\n";

        //trying to only include USEFUl words-- from autograder 
        if (!options.allowLength && (line.size() != options.beginWord.size())){
            continue;
        }
        DictStruct newWord(line);
        dictionary.push_back(newWord);
        ++count; 
        
        // Track begin/end indices
        if (line == options.beginWord) beginWordIndex = dictionary.size() - 1;
        if (line == options.endWord)   endWordIndex = dictionary.size() - 1;

    }
    /*//dictionary is populated, now find begin and end word indices
    for(size_t i = 0; i < dictionary.size(); ++i){
        if(dictionary[i].word == options.beginWord){
            beginWordIndex = i;
        }
        if(dictionary[i].word == options.endWord){
            endWordIndex = i;
        }
    }*/
    if(beginWordIndex == size_t(-1) || endWordIndex == size_t(-1)){
        std::cerr << "Error: begin word not in dictionary\n";
        exit(1);
    }

    //inv 6 still  nto passing even with this??
    if(!options.allowLength && (options.allowChange || options.allowSwap) && dictionary[beginWordIndex].word.size() != dictionary[endWordIndex].word.size()) {
        std::cerr << "Error: begin and end words have different lengths, cannot use -c or -p without -l\n";
        exit(1);
    }
}

void Letterman::readComplexDictionary(std::istream &in, size_t N){
    dictionary.clear();
    dictionary.reserve(N * 3); //rough estimate, could be more
    beginWordIndex = size_t(-1);
    endWordIndex   = size_t(-1);
    std::string line;
    while(std::getline(in, line)){
        if(line.empty() || (line.size()>=2 && line[0]=='/' && line[1]=='/')){
            continue;
        }

        // Reverse &
        if(line.back() == '&'){
            std::string word = line.substr(0, line.size()-1);
            //try to only include USEFUL words-- from autograder
            if (options.allowLength || word.size() == options.beginWord.size()) {
                dictionary.push_back(DictStruct(word));
            }
            //debug
            //std::cerr << "Read word: '" << word << "'\n";

            std::string reverseWord = word;
            std::reverse(reverseWord.begin(), reverseWord.end());
            if (options.allowLength || reverseWord.size() == options.beginWord.size()) {
                dictionary.push_back(DictStruct(reverseWord));
            }            
            //debug
            //std::cerr << "Read reversed: '" << reverseWord << "'\n";
            continue;
        }

        // Insert each []
        size_t lbracket = line.find('[');
        size_t rbracket = line.find(']');
        if(lbracket != std::string::npos && rbracket != std::string::npos && rbracket > lbracket){
            std::string prefix = line.substr(0, lbracket);
            std::string suffix = line.substr(rbracket+1);
            std::string choices = line.substr(lbracket+1, rbracket - lbracket - 1);
            for(char choice : choices){
                std::string w = prefix + choice + suffix;
                if (options.allowLength || w.size() == options.beginWord.size()) {
                    dictionary.push_back(DictStruct(w));
                }               
                 //debug 
                //std::cerr << "Read word from []: '" << w << "'\n";
            }
            continue;
        }

        // Swap !
        size_t excl = line.find('!');
        if(excl != std::string::npos && excl >= 2){
            std::string original = line; 
            original.erase(excl, 1);
            if (options.allowLength || original.size() == options.beginWord.size()) {
                dictionary.push_back(DictStruct(original));
            }            
            //debug 
            //std::cerr << "Read original from !: '" << original << "'\n";

            std::string swapped = original;
            std::swap(swapped[excl-2], swapped[excl-1]);
            if(options.allowLength || swapped.size() == options.beginWord.size()) {
                dictionary.push_back(DictStruct(swapped));
            }
            //debug
            //std::cerr << "Read swapped from !: '" << swapped << "'\n";
            continue;
        }

        // Double ?
        size_t qmark = line.find('?');
        if(qmark != std::string::npos && qmark >= 1){
            std::string word = line;
            word.erase(qmark, 1);
            if (options.allowLength || word.size() == options.beginWord.size()) {
                dictionary.push_back(DictStruct(word));
            }            
            //debug
            //std::cerr << "Read original from ?: '" << word << "'\n";

            std::string doubled = word;
            doubled.insert(qmark, 1, word[qmark-1]);
            if (options.allowLength || doubled.size() == options.beginWord.size()) {
                dictionary.push_back(DictStruct(doubled));
            }            
            //debug
            //std::cerr << "Read doubled from ?: '" << doubled << "'\n";
            continue;
        }

        // Normal word
        if (options.allowLength || line.size() == options.beginWord.size()) {
            dictionary.push_back(DictStruct(line));
        }        
        //debug
        //std::cerr << "Read normal word: '" << line << "'\n";
    }

    //debug
    //std::cerr << "Total words in dictionary: " << dictionary.size() << "\n";
    //after populating dictionary, find begin and end word indices
    for(size_t i = 0; i < dictionary.size(); ++i){
        if(dictionary[i].word == options.beginWord){
            beginWordIndex = i;
        }
        if(dictionary[i].word == options.endWord){
            endWordIndex = i;
        }
    }

    if(beginWordIndex == size_t(-1) || endWordIndex == size_t(-1)){
        std::cerr << "Error: begin or end word not in dictionary\n";
        exit(1);
    }

    //inv 6 still  nto passing even with this??
    if(!options.allowLength && (options.allowChange || options.allowSwap) && dictionary[beginWordIndex].word.size() != dictionary[endWordIndex].word.size()) {
        std::cerr << "Error: begin and end words have different lengths, cannot use -c or -p without -l\n";
        exit(1);
    }
}

bool Letterman::isSimilar(const std::string &word, const std::string &candidate) const {
    size_t len1 = word.size();
    size_t len2 = candidate.size();

    if(options.allowChange && len1 == len2){
        size_t diffCount = 0;
        for(size_t i = 0; i < len1; ++i){
            if(word[i] != candidate[i]){
                ++diffCount;
                if(diffCount > 1) break;
            }
        }
        if(diffCount == 1){
            //debug print
            //std::cout << "Similar by change: " << word << " -> " << candidate << "\n";
            return true;
        }
    }

    //inserting or deleting
    if(options.allowLength){
        if(len1 + 1 == len2){
            size_t i = 0, j = 0;
            while(i < len1 && word[i] == candidate[j]){
                ++i;
                ++j;
            }
            ++j; //skip the extra char in candidate
            while(i < len1 && word[i] == candidate[j]){
                ++i;
                ++j;
            }
            if(i == len1 && j == len2){
                return true; 
            }
        }
        else if(len1 == len2 + 1){
            size_t i = 0, j = 0;
            while(i < len1 && word[i] == candidate[j]){
                ++i;
                ++j;
            }
            ++i; //skip the extra char in word
            while(i < len1 && word[i] == candidate[j]){
                ++i;
                ++j;
            }
            if(i == len1 && j == len2){
                return true;
            }
        }
    }
    //swapping
    if(options.allowSwap && len1 == len2 && len1 >= 2){
        size_t first_mismatch_index = SIZE_MAX;
        size_t second_mismatch_index = SIZE_MAX;
        bool shouldCompare = true; 
        for(size_t i = 0; i < len1; ++i){
            if(word[i] != candidate[i]){
                if(first_mismatch_index == SIZE_MAX){
                    first_mismatch_index = i;
                }
                else if(second_mismatch_index == SIZE_MAX){
                    second_mismatch_index = i;
                }
                else{
                    shouldCompare = false;
                    break; //more than 2 mismatches, cannot be swap
                }
            }
        }
        if(shouldCompare && second_mismatch_index - first_mismatch_index == 1 && 
           word[first_mismatch_index] == candidate[second_mismatch_index] &&
           word[second_mismatch_index] == candidate[first_mismatch_index]){
            return true;
        }
    }
    //not similar
    return false;
}

void Letterman::search(){
    outputPath.clear();

    std::deque<size_t> searchContainer;
    searchContainer.push_back(beginWordIndex);
    dictionary[beginWordIndex].discovered = true;
    wordsDiscovered = 1;
    bool found = false;

    while(!searchContainer.empty()){
        size_t currentIndex;
        if(options.useQueue){
            currentIndex = searchContainer.front();
            searchContainer.pop_front(); //queue behavior
        }
        else{ //use stack
            currentIndex = searchContainer.back();
            searchContainer.pop_back(); //stack behavior
        }
        //debug 
        //std::cerr << "Visiting: " << dictionary[currentIndex].word << "\n"; // <- here


        //find all similar words that are not discovered yet
        for(size_t i = 0; i < dictionary.size(); ++i){
            if(!dictionary[i].discovered && isSimilar(dictionary[currentIndex].word, dictionary[i].word)){
                dictionary[i].discovered = true;
                dictionary[i].prev = currentIndex;
                searchContainer.push_back(i);
                ++wordsDiscovered;
                if(i == endWordIndex){
                    found = true;
                    break;
                }
            }
        }
        if(found) break;
    }

    //construct output path
    if (!dictionary[endWordIndex].discovered) {
        std::cout << "No solution, " << wordsDiscovered << " words discovered.\n";
        return;
    }

    size_t cur = endWordIndex;
    while(cur != SIZE_MAX){
        outputPath.push_back(cur);
        if(cur == beginWordIndex){
            break;
        }
        if(dictionary[cur].prev == SIZE_MAX){
            //no valid prev word
            outputPath.clear();
            break;
        }
        cur = dictionary[cur].prev;
    }
    //chamge from end to begin to begin to end
    std::reverse(outputPath.begin(), outputPath.end());
}

std::string Letterman::getModification(const std::string &prev, const std::string &curr) const {
    size_t lenprev = prev.size();
    size_t lencurr = curr.size();

    //diff length
    if(lenprev + 1 == lencurr){ //insertion
        size_t i = 0, j = 0;
        while(i < lenprev && prev[i] == curr[j]){
            ++i;
            ++j;
        }
        //j is the index of inserted char
        return "i," + std::to_string(j) + "," + curr[j];
    }
    if(lenprev == lencurr + 1){ //deletion
        size_t i = 0, j = 0;
        while(j < lencurr && prev[i] == curr[j]){
            ++i;
            ++j;
        }
        return "d," + std::to_string(i);
    }

    // same length so swap or change
    if(lenprev == lencurr){
        // check for swap first
        if(lenprev >= 2) {
            for(size_t i = 0; i + 1 < lenprev; ++i){
                if(prev[i] != curr[i] && prev[i+1] != curr[i+1] &&
                    prev[i] == curr[i+1] && prev[i+1] == curr[i]){
                    //check rest of the string to see if matches
                    bool restMatch = true;
                    for(size_t j = 0; j < lenprev; ++j){
                        if(j != i && j != i+1 && prev[j] != curr[j]){
                            restMatch = false;
                            break;
                        }
                    }
                    if(restMatch){
                        return "s," + std::to_string(i);
                    }
                    
                }
            }
        }
        // if not swap, then it's a change
        for(size_t i = 0; i < lenprev; ++i){
            if(prev[i] != curr[i]){
                return "c," + std::to_string(i) + "," + std::string(1, curr[i]);
            }
        }
    }
    return ""; //should not reach here
}


void Letterman::output() const {
    if(outputPath.empty()){
        //no path found, print nothing
        return;
    }
    if (options.outputFormat == "word") {
        std::cout << "Words in morph: " << outputPath.size() << "\n";
        for (auto idx : outputPath) {
            std::cout << dictionary[idx].word << "\n";
        }
    } else if (options.outputFormat == "modification") {
        std::cout << "Words in morph: " << outputPath.size() << "\n";
        std::cout << dictionary[outputPath[0]].word << "\n"; // begin word
        for (size_t i = 1; i < outputPath.size(); ++i) {
            std::cout << getModification(dictionary[outputPath[i - 1]].word, dictionary[outputPath[i]].word) << "\n";
        }
    }
}