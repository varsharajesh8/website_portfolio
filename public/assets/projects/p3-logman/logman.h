//project identifier 01BD41C3BF016AD7E8B6F837DF18926EC3251350
#ifndef LOGMAN_H
#define LOGMAN_H

#include <string>
#include <vector>
#include <deque>
#include <unordered_map>
#include <set>

size_t convertTsStringToNum(std::string& ts);

struct LogEntry {
    size_t entryID;
    std::string ts; // Stored as mm:dd:hh:mm:ss
    std::string category;
    std::string message;

    size_t extractTimestampNum() {
        return convertTsStringToNum(ts);
    }
};

struct TimestampEntry {
    size_t entryId; // Points to entryId in masterList
    size_t timestamp; // Integer representation of timestamp in log entry

    struct CompareByTimestamp {
        bool operator() (const TimestampEntry &a, const TimestampEntry &b) const {
            return a.timestamp < b.timestamp;
        }
    };
};

struct Options {
    std::string filename;
};

class Logman {
    private:
    std::vector<LogEntry> masterList;
    std::vector<TimestampEntry> sortedMasterList;
    std::deque<size_t> excerptList;
    std::vector<size_t>* most_recent_search;
    std::pair<std::string, std::string> extractTimestamps(const std::string& s);

    // Both maps below store original entryIDs NOT sorted
    std::unordered_map<std::string, std::vector<size_t>> category_map; 
    std::unordered_map<std::string, std::set<size_t>> keyword_map;

    void buildCategoryMap();
    void buildKeywordMap();
    void printEntry(int id);

    public:
    void getOptions(int argc, char* argv[], Options &options);
    void readFile(const std::string &filename);
    void run(); 

};

#endif