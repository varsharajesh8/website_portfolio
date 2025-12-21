//Project Identifier: 50EB44D3F029ED934858FFFCEAC3547C68251FC9
#ifndef LETTERMAN_H
#define LETTERMAN_H


#include <iostream>
#include <vector>
#include <deque>
#include <string>


struct Options{
   bool useQueue = false;
   bool useStack = false; 
   bool allowChange = false;
   bool allowLength = false;
   bool allowSwap = false;
   std::string beginWord;
   std::string endWord;
   std::string outputFormat = "word"; //default to word
};

struct DictStruct{
   std::string word;
   size_t prev = SIZE_MAX; //index of previous word in path
   bool discovered = false;

   DictStruct(const std::string& w) : word(w) {}
};

class Letterman{
public:
   Letterman() = default;

   void getOptions(int argc, char* argv[], Options &options);
   void readDictionary(std::istream &in);
   void search();
   void output() const;

   
private:
   Options options;
   std::vector<size_t> outputPath; 
   size_t beginWordIndex = size_t(-1);
   size_t endWordIndex = size_t(-1);
   std::vector<DictStruct> dictionary; //vector of dictionaries
   size_t wordsDiscovered = 0; 

  //helper funcs
  void readSimpleDictionary(std::istream &in, size_t N);
  void readComplexDictionary(std::istream &in, size_t N);
  bool isSimilar(const std::string& word, const std::string& candidate) const;
  std::string getModification(const std::string &prev, const std::string &curr) const; 


};


#endif