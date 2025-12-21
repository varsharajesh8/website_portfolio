//Project Identifier: 01BD41C3BF016AD7E8B6F837DF18926EC3251350
#include "logman.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <cctype>
#include <utility>
#include <getopt.h>
#include <unordered_set>

// Expects ts to be in format mm:dd:hh:mm:ss
size_t convertTsStringToNum(std::string& ts) {
    size_t len = ts.length();
    size_t pos1 = ts.find_first_not_of(" \t");
    size_t pos2 = ts.find_last_not_of(" \t");
    if (pos2 < len - 1) {
        ts.erase(pos2 + 1, len - pos2);
    }
    if (pos1 > 0) {
        ts.erase(0, pos1);
    }
    return static_cast<size_t>(std::stoll(ts.substr(0,2) /* mm */ 
            + ts.substr(3,2) /* dd */ 
            + ts.substr(6,2) /* hh */ 
            + ts.substr(9,2) /* mm */ 
            + ts.substr(12,2) /* ss */));
}

void Logman::getOptions(int argc, char* argv[], Options &options){
    opterr = 0;
    int choice = 0;
    int index = 0;
    option longOptions[] = {
        {"help", no_argument, nullptr, 'h'},
        {"file", required_argument, nullptr, 'f'},
        {nullptr, 0, nullptr, '\0'}
    }; //longOptions[]
    while((choice = getopt_long(argc, argv, "hf:", longOptions, &index)) != -1){
        switch (choice){
            case 'h':
                std::cout << "-h, --help   display this help message\n"
                        << "-f, --file FILENAME specify input logfile\n";
                exit(0);
            case 'f':
                if(!options.filename.empty()){
                    std::cerr << "Error: multiple log files specified\n";
                    exit(1);
                }
                options.filename = optarg;
                break;
            default:
                std::cerr << "Error: invalid option\n";
                exit(1);
        }
    }
    if(options.filename.empty()){
        std::cerr << "Error: must specify log file with -f or --file\n";
        exit(1);
    }
}

void Logman::buildCategoryMap(){
    category_map.clear();
    for (const auto &e: masterList) {
        std::string cat = e.category;
        std::transform(cat.begin(), cat.end(), cat.begin(),
                    [](unsigned char c){ return std::tolower(c); });
        category_map[cat].push_back(static_cast<size_t>(e.entryID));
    }
}

void Logman::buildKeywordMap() {
    keyword_map.clear();
    for (const auto &e: masterList){
        std::istringstream iss(e.message + " " + e.category);
        std::string token;
        while (iss >> token) {
            std::string cleaned;
            for (char ch : token) {
                if (std::isalnum(static_cast<unsigned char>(ch))){
                    cleaned += static_cast<char>(std::tolower(static_cast<unsigned char>(ch)));
                } else {
                    if(!cleaned.empty()) {
                        keyword_map[cleaned].insert(static_cast<size_t>(e.entryID));
                        cleaned.clear();
                    }
                }
            }
            if (!cleaned.empty()) {
                keyword_map[cleaned].insert(static_cast<size_t>(e.entryID));
            }
        }
    }
}

void Logman::readFile(const std::string &filename){
    std::ifstream stream(filename);
    if (!stream) {
        std::cerr << "Error opening file: " << filename << "\n";
        exit(1);
    }
    masterList.clear();
    std::string line;
    size_t entryId = 0;
    while (getline(stream, line)){
        size_t first = line.find('|');
        size_t second = line.find('|', first + 1);
        LogEntry e;
        e.entryID = entryId++;
        e.ts = line.substr(0, first);
        e.category = line.substr(first + 1, second - (first + 1));
        e.message = line.substr(second + 1);
        masterList.push_back(std::move(e));
    }

    sortedMasterList.reserve(masterList.size());
    for (auto &e: masterList) {
        TimestampEntry t;
        t.entryId = e.entryID;
        t.timestamp = e.extractTimestampNum();
        sortedMasterList.push_back(t);
    }
    std::sort(sortedMasterList.begin(), sortedMasterList.end(), TimestampEntry::CompareByTimestamp());

    buildCategoryMap();
    buildKeywordMap();
    std::cout << masterList.size() << " entries read\n"; // match spec output
}

void Logman::printEntry(int id){
 if(id < 0 || id >= (int)masterList.size()){
     return;
 }
 const LogEntry &e = masterList[static_cast<size_t>(id)];
 std::cout << e.ts << "|" << e.category << "|" << e.message << "\n";
}

// Check if string is a number
bool isNumber(const std::string &s){
 return !s.empty() && std::all_of(s.begin(), s.end(), ::isdigit);
}

void Logman::run() {
    std::vector<size_t>* new_list_ptr = new std::vector<size_t>;
    most_recent_search = nullptr;
    char cmd;
    do {
        if (std::cin.fail()) {
            std::cerr << "cin entered fail state: exiting" << std::endl;
            delete new_list_ptr;
            most_recent_search = nullptr;
            exit(1);
        } // if
        std::cout << "% ";
        std::string line;
        if (!std::getline(std::cin, line)) {
            break;
        } // if
        if (line.empty()) {
            continue;
        } // if
        cmd = line[0];

        // Command read: '" << cmd << "'" << std::endl;
        //std::cout << "[DEBUG] most_recent_search pointer: " << most_recent_search << std::endl;
        if (most_recent_search) {
            //std::cout << "[DEBUG] most_recent_search size: " << most_recent_search->size() << std::endl;
        }

        switch (cmd) {
            case 'q': {
                //std::cout << "[DEBUG] Quit command" << std::endl;
                break; // quit
            } // q
            case '#': {
                break; // comment, ignore line
            } // #
            case 'a': {
                if (line.size() < 3) {
                    std::cerr << "Invalid command for a\n";
                    break;
                } // if
                size_t id = SIZE_MAX;
                try {
                    id = static_cast<size_t>(std::stoi(line.substr(2)));
                } catch (...) {
                    std::cerr << "Invalid command for a\n";
                    break;
                } // try-catch 
                if (id < masterList.size()) {
                    excerptList.push_back(id);
                    std::cout << "log entry " << id << " appended\n";
                } else {
                    std::cerr << "Invalid position for command a\n";
                }
                break;
            } // a
            case 'p': {
                for (size_t i = 0; i < excerptList.size(); ++i) {
                    const auto &e = masterList[excerptList[i]];
                    std::cout << i << "|" << e.entryID << "|" << e.ts << "|"
                            << e.category << "|" << e.message << "\n";
                } // for
                break;
            } // p
            case 't': {
                auto sep = line.find('|');
                if (sep == std::string::npos || line.size() < 31) {
                    // std::cerr << "Invalid timestamp range\n";
                    break;
                } // if

                most_recent_search = new_list_ptr;
                most_recent_search->clear();

                std::string input = line.substr(2);
                std::pair<std::string, std::string> timestamps = extractTimestamps(input);
                if(timestamps.first.length()!=14){
                    std::cerr << "first timestamp not of valid 14 char length\n";
                    break;
                }
                if(timestamps.second.length()!=14){
                    std::cerr << "second timestamp not of valid 14 char length\n";
                    break;
                }

                std::string &ts1 = timestamps.first;
                std::string &ts2 = timestamps.second;

                TimestampEntry dummy;
                dummy.entryId = SIZE_MAX; // This value does not matter

                dummy.timestamp = convertTsStringToNum(ts1);
                auto lower = std::lower_bound(sortedMasterList.begin(), sortedMasterList.end(), dummy, TimestampEntry::CompareByTimestamp());

                if (lower == sortedMasterList.end()) {
                    // No lower bound found
                    std::cout << "Timestamps search: 0 entries found\n";
                    break;
                } // if

                dummy.timestamp = convertTsStringToNum(ts2);
                auto upper = std::upper_bound(sortedMasterList.begin(), sortedMasterList.end(), dummy, TimestampEntry::CompareByTimestamp());

                for (auto it = lower; it != upper; ++it) {
                    most_recent_search->push_back(it->entryId);
                } // for

                std::cout << "Timestamps search: " << most_recent_search->size() << " entries found\n";
                break;
            } // t
            case 'r': {
                 //std::cout << "[DEBUG] most_recent_search size: "
              //<< (most_recent_search ? most_recent_search->size() : 0)
              //<< std::endl;
                //std::cout << "[DEBUG] Running 'r' command" << std::endl;
                if (most_recent_search == nullptr) {
                    std::cerr << "Previous search has not occurred for command r\n" << std::endl;
                    break;
                } // if
                std::sort(most_recent_search->begin(), most_recent_search->end(), [this](int a, int b) {
                    const auto &ea = masterList[static_cast<size_t>(a)];
                    const auto &eb = masterList[static_cast<size_t>(b)];
                    if (ea.ts != eb.ts) return ea.ts < eb.ts;
                    if (ea.category != eb.category) return ea.category < eb.category;
                    return ea.entryID < eb.entryID;
                });
                //std::cout << "[DEBUG] Sorting complete" << std::endl;
                for (auto &e : *most_recent_search) {
                    //std::cout << "[DEBUG] Appending entryID: " << e << std::endl;
                    excerptList.push_back(e);
                }
                //std::cout << "[DEBUG] Excerpt list size: " << excerptList.size() << std::endl;
                std::cout << most_recent_search->size() << " log entries appended\n";
                break;
            } // r
            case 'm': {
                if (line.size() < 16) {
                    std::cerr << "Invalid timestamp range\n";
                    break;
                } // if

                most_recent_search = new_list_ptr;
                most_recent_search->clear();


                std::string input = line.substr(2);
                std::pair<std::string, std::string> timestamp = extractTimestamps(input);

                std::string &ts1 = timestamp.first;

                if(timestamp.first.length() != 14){
                    std::cerr << "invalid timestamp length not 14 chars\n";
                }

                TimestampEntry dummy;
                dummy.entryId = SIZE_MAX; // This value does not matter
                dummy.timestamp = convertTsStringToNum(ts1);

                auto lower = std::lower_bound(sortedMasterList.begin(), sortedMasterList.end(), dummy, TimestampEntry::CompareByTimestamp());
                if (lower == sortedMasterList.end()) {
                    // No lower bound found
                    std::cout << "Timestamp search: 0 entries found\n";
                    break;
                } // if
                auto upper = std::upper_bound(sortedMasterList.begin(), sortedMasterList.end(), dummy, TimestampEntry::CompareByTimestamp());

                for (auto it = lower; it != upper; ++it) {
                    most_recent_search->push_back(it->entryId);
                } // for

                std::cout << "Timestamp search: " << most_recent_search->size() << " entries found\n";
                break;
            } // m
            case 'c': {
                std::string category = line.substr(1);
                size_t len = category.length();
                size_t pos1 = category.find_first_not_of(" \t");
                size_t pos2 = category.find_last_not_of(" \t");
                if (pos2 < len - 1) {
                    category.erase(pos2 + 1, len - pos2);
                }
                category.erase(0, pos1);
                std::transform(category.begin(), category.end(), category.begin(),
                            [](unsigned char c){ return std::tolower(c); });
                auto it = category_map.find(category);
                if (it != category_map.end()) {
                    most_recent_search = &(it->second);
                } else {
                    most_recent_search = new_list_ptr;
                    most_recent_search->clear();
                }
                std::cout << "Category search: " << most_recent_search->size() << " entries found\n";
                break;
            } // c
            case 'd': {
                std::string x = line.substr(1);
                size_t len = x.length();
                size_t pos1 = x.find_first_not_of(" \t");
                size_t pos2 = x.find_last_not_of(" \t");
                if (pos2 < len - 1) {
                    x.erase(pos2 + 1, len - pos2);
                }
                x.erase(0, pos1);
                if (!isNumber(x)) {
                    std::cerr << "Invalid position for d\n";
                    break;
                }
                int idx = std::stoi(x);
                if (idx < 0 || idx >= static_cast<int>(excerptList.size())) {
                    std::cerr << "Invalid position for command d\n";
                    break;
                }
                excerptList.erase(excerptList.begin() + idx);
                std::cout << "Deleted excerpt list entry " << idx << "\n";
                break;
            } // d
            case 'b': {
                std::string x = line.substr(1);
                size_t len = x.length();
                size_t pos1 = x.find_first_not_of(" \t");
                size_t pos2 = x.find_last_not_of(" \t");
                if (pos2 < len - 1) {
                    x.erase(pos2 + 1, len - pos2);
                }
                x.erase(0, pos1);
                if (!isNumber(x)) {
                    std::cerr << "Invalid position for b\n";
                    break;
                }
                int idx = std::stoi(x);
                if (idx < 0 || idx >= static_cast<int>(excerptList.size())) {
                    std::cerr << "Invalid position for command b\n";
                    break;
                }
                size_t newBeginID = excerptList[static_cast<size_t>(idx)];
                excerptList.erase(excerptList.begin() + idx);
                excerptList.push_front(newBeginID);
                std::cout << "Moved excerpt list entry " << idx << "\n";
                break;
            } // b
            case 'e': {
                std::string x = line.substr(1);
                size_t len = x.length();
                size_t pos1 = x.find_first_not_of(" \t");
                size_t pos2 = x.find_last_not_of(" \t");
                if (pos2 < len - 1) {
                    x.erase(pos2 + 1, len - pos2);
                }
                x.erase(0, pos1);
                if (!isNumber(x)) {
                    std::cerr << "Invalid position for e\n";
                    break;
                }
                int idx = std::stoi(x);
                if (idx < 0 || idx >= static_cast<int>(excerptList.size())) {
                    std::cerr << "Invalid position for command e\n";
                    break;
                }
                size_t endID = excerptList[static_cast<size_t>(idx)];
                excerptList.erase(excerptList.begin() + idx);
                excerptList.push_back(endID);
                std::cout << "Moved excerpt list entry " << idx << "\n";
                break;
            } // e
            case 'l': {
                if (excerptList.empty()) {
                    std::cout << "excerpt list cleared\n(previously empty)\n";
                    break;
                }
                const LogEntry* firstEntry = &masterList[excerptList.front()];
                const LogEntry* lastEntry = &masterList[excerptList.back()];
                std::cout << "excerpt list cleared\nprevious contents:\n";
                std::cout << "0|" << firstEntry->entryID << "|" << firstEntry->ts << "|" 
                        << firstEntry->category << "|" << firstEntry->message << "\n";
                std::cout << "...\n";
                std::cout << (excerptList.size() - 1) << "|" << lastEntry->entryID << "|"
                           << lastEntry->ts << "|" << lastEntry->category << "|"
                           << lastEntry->message << "\n";
           
                excerptList.clear();
                break;
            } // l
            case 's': {
                if (excerptList.empty()) {
                    std::cout << "excerpt list sorted\n(previously empty)\n";
                    break;
                } // if

                const LogEntry* oldFirst = &masterList[excerptList.front()];
                const LogEntry* oldLast = &masterList[excerptList.back()];
                std::cout << "excerpt list sorted\nprevious ordering:\n";
                std::cout << "0|" << oldFirst->entryID << "|" << oldFirst->ts << "|"
                        << oldFirst->category << "|" << oldFirst->message << "\n";
                std::cout << "...\n";
                std::cout << (excerptList.size() - 1) << "|" << oldLast->entryID << "|"
                           << oldLast->ts << "|" << oldLast->category << "|"
                           << oldLast->message << "\n";

                std::sort(excerptList.begin(), excerptList.end(), [this](size_t a, size_t b) {
                    const LogEntry* ea = &masterList[a];
                    const LogEntry* eb = &masterList[b];
                    if (ea->ts != eb->ts) return ea->ts < eb->ts;
                    if (ea->category != eb->category) return ea->category < eb->category;
                    return ea->entryID < eb->entryID;
                });

                const LogEntry* newFirst = &masterList[excerptList.front()];
                const LogEntry* newLast = &masterList[excerptList.back()];
                std::cout << "new ordering:\n";
                std::cout << "0|" << newFirst->entryID << "|" << newFirst->ts << "|"
                       << newFirst->category << "|" << newFirst->message << "\n";
                std::cout << "...\n";
                std::cout << (excerptList.size() - 1) << "|" << newLast->entryID << "|"
                           << newLast->ts << "|" << newLast->category << "|"
                           << newLast->message << "\n";
                
                break;
            } // s
            case 'g': {
                //std::cout << "[DEBUG] Running 'g' command" << std::endl;
                if (most_recent_search == nullptr) {
                    std::cerr << "Previous search has not occurred for g\n" << std::endl;
                    break;
                }
                for (size_t id : *most_recent_search) {
                    const LogEntry* e = &masterList[id];
                    std::cout << e->entryID << "|" << e->ts << "|" << e->category << "|" << e->message << "\n";
                }
                break;
            } // g
            case 'k': {
                if (line.size() < 3) {
                    std::cerr << "Invalid keyword\n";
                    break;
                }
                std::string keywordString = line.substr(2);
                size_t len = keywordString.length();
                size_t pos1 = keywordString.find_first_not_of(" \t");
                size_t pos2 = keywordString.find_last_not_of(" \t");
                if (pos2 < len - 1) {
                    keywordString.erase(pos2 + 1, len - pos2);
                }
                keywordString.erase(0, pos1);

                // Split on non-alphanumeric characters and make lowercase
                std::vector<std::string> fixedKeywords;
                std::string token;
                for (char ch : keywordString) {
                    if (std::isalnum(static_cast<unsigned char>(ch))) {
                        token += static_cast<char>(std::tolower(static_cast<unsigned char>(ch)));
                    } else {
                        if (!token.empty()) {
                            fixedKeywords.push_back(token);
                            token.clear();
                        }
                    }
                }
                if (!token.empty()) fixedKeywords.push_back(token);

                if (fixedKeywords.empty()) {
                    std::cerr << "Invalid keywords\n";
                    break;
                }
                /*std::istringstream input(keywordString);
                std::string word;
                std::vector<std::string> fixedKeywords;
                while (input >> word) {
                    std::string cleanedWord;
                    for (char ch : word) {
                        if (std::isalnum(static_cast<unsigned char>(ch))){
                            cleanedWord += static_cast<char>(std::tolower(static_cast<unsigned char>(ch)));
                        } // if
                    } // for
                    if (!cleanedWord.empty()) {
                        fixedKeywords.push_back(cleanedWord);
                    } // if
                } // while
                if (fixedKeywords.empty()) {
                    std::cerr << "Invalid keywords\n";
                    break;
                } // if
                */

                most_recent_search = new_list_ptr;
                most_recent_search->clear();

                auto it = keyword_map.find(fixedKeywords[0]);
                if (it == keyword_map.end()) {
                    std::cout << "Keyword search: 0 entries found\n";
                    break;
                }
                for (size_t e : it->second) {
                    most_recent_search->push_back(e);
                }

                for (size_t word = 1; word < fixedKeywords.size(); ++word) {
                    if (most_recent_search->empty()) {
                        break;
                    }
                    std::vector<size_t> intersection;
                    auto nextWordIt = keyword_map.find(fixedKeywords[word]);
                    if (nextWordIt != keyword_map.end()) {
                        // New keyword found. Compute intersection.
                        const auto &nextVec = nextWordIt->second;

                        std::set_intersection(
                            most_recent_search->begin(), most_recent_search->end(),
                            nextVec.begin(), nextVec.end(),
                            std::back_inserter(intersection)
                        );
                        *most_recent_search = std::move(intersection);
                    } else {
                        // New keyword not found. Clear search results and end search.
                        most_recent_search->clear();
                    }
                }
                std::cout << "Keyword search: " << most_recent_search->size() << " entries found\n";
                break;
            } // k
            default: {
                std::cerr << "Unknown command\n";
                break;
            } // default
        } // switch
    } while (cmd != 'q');
    //std::cout << "[DEBUG] Deleting new_list_ptr at end: " << new_list_ptr << std::endl;

    delete new_list_ptr;
    most_recent_search = nullptr;
}

//method to validate 14 chars in timestamp search
std::pair<std::string, std::string> Logman::extractTimestamps(const std::string& s) {
    size_t pipePos = s.find('|');
    if (pipePos == std::string::npos) {
        size_t start = 0;
        size_t end = s.size();

        // Trim leading whitespace
        while (start < s.size() && std::isspace(s[start])) ++start;
        // Trim trailing whitespace
        while (end > start && std::isspace(s[end - 1])) --end;

        std::string timestamp = s.substr(start, end - start);
        return {timestamp, ""};
    }

    // Extract left timestamp (go left until whitespace or start)
    size_t leftEnd = pipePos;
    size_t leftStart = leftEnd;
    while (leftStart > 0 && !std::isspace(s[leftStart - 1])) {
        --leftStart;
    }
    std::string leftTimestamp = s.substr(leftStart, leftEnd - leftStart);

    // Extract right timestamp (go right until whitespace or end)
    size_t rightStart = pipePos + 1;
    while (rightStart < s.size() && std::isspace(s[rightStart])) ++rightStart; // skip spaces
    size_t rightEnd = rightStart;
    while (rightEnd < s.size() && !std::isspace(s[rightEnd])) ++rightEnd;
    std::string rightTimestamp = s.substr(rightStart, rightEnd - rightStart);

    return {leftTimestamp, rightTimestamp};
}
