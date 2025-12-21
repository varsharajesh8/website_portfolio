//project identifier: 1761414855B69983BD8035097EFBD312EB2517F0
#ifndef DRONE_H
#define DRONE_H

#include <vector>
#include <utility>
#include <string>
#include <limits>

enum class LocationType{
    MEDICAL, 
    BORDER, 
    NORMAL
}; 

struct Options{
    std::string mode = "";
    bool hasMode = false;
};
//struct to hold values of prim table
struct PrimVertex{
    bool innie = false;
    double minDist = std::numeric_limits<double>::infinity();
    int parent = -1;
};

//stryct to store delivery location
struct Location{
    int x;
    int y;
    LocationType locType;
};

class DroneDelivery{
    private:
    std::vector<Location> locations;
    //prim table holds entries of prim (primVertex)
    std::vector<PrimVertex> primTable;
    int numLocations;

    //getter func to get if medical, normal, or border
    LocationType getLocationType(int x, int y);

    //calculate euclidean distance between 2 locations
    double getDistance(int a, int b);

    //check if edge between 2 locations is valid
    //medical and normal can only connect through the border
    //same location type or at least 1 border alwats valid
    bool isValidEdge(LocationType type1, LocationType type2);


    //part b fasttsp
    std::vector<size_t> currentPath;
    std::vector<size_t> bestPath;
    double bestPathLength;
    //no edge validation needed for part b
    double getDistanceSquared(size_t a, size_t b);
    double getDistanceNoValidation(size_t a, size_t b);
    double calculatePathLength(const std::vector<size_t>& path);
    void furthestInsertion();

    //part c OPTTSP
    std::vector<size_t> optimalPath; //current path explored
    double optBestLength; //best complete path so far
    double currentLength;

    void genPerms(size_t permLength);
    bool promising(size_t permLength);
    double calculateMSTLowerBound(size_t permLength);

    public:
    //ctor
    DroneDelivery() : numLocations(0), 
                        bestPathLength(std::numeric_limits<double>::infinity()), 
                        optBestLength(std::numeric_limits<double>::infinity()), 
                        currentLength(0.0)
    {}

    //func to read input
    void readInput();

    //prims to find MST
    void runMST();

    //options
    void getOptions(int argc, char* argv[], Options &options);

    //fasttsp
    void runFASTTSP();

    //opttsp
    void runOPTTSP();
};
#endif