//project identifier: 1761414855B69983BD8035097EFBD312EB2517F0
#include "drone.h"
#include <iostream>
#include <limits>
#include <cmath>
#include <iomanip>
#include <utility>
#include <getopt.h>
#include <algorithm>

void DroneDelivery::getOptions(int argc, char* argv[], Options &options){
    opterr = 0;
    int choice = 0;
    int index = 0;
    option longOptions[] = {
        {"help", no_argument, nullptr, 'h'},
        {"mode", required_argument, nullptr, 'm'},
        {nullptr, 0, nullptr, '\0'}
    }; //longOptions[]
    while((choice = getopt_long(argc, argv, "hm:", longOptions, &index)) != -1){
        switch (choice){
            case 'h':
                std::cout << "-h, --help display this help message\n"
                        << "-m, --mode MODE specify mode {MST|FASTTSP|OPTTSP}\n" 
                        << "MST: Find the minimum spanning tree (MST) of the map\n"
                        << "FASTTSP: Find a fast, but not necessarily optimal, solution to the TSP\n" 
                        << "OPTTSP: Find the optimal solution to the TSP\n";
                exit(0);
            case 'm':
                options.mode = optarg;
                options.hasMode = true;
                break;
            default:
                std::cerr << "Error: Invalid command line option\n";
                exit(1);
        }
    }
    if(!options.hasMode){
        std::cerr <<"Error: No mode specified\n";
        exit(1);
    }
    if(!(options.mode == "MST" || options.mode == "FASTTSP" || options.mode == "OPTTSP")){
        std::cerr << "Error: Invalid mode\n";
        exit(1);
    }
}


LocationType DroneDelivery::getLocationType(int x, int y){
    if (x < 0 && y < 0){
        return LocationType::MEDICAL;
    }
    //wouldbe returned medical if within third so must be in border, neg x and y but not in medical 
    if (x <= 0 && y <= 0){
        return LocationType::BORDER;
    }
    //not either of above normal
    return LocationType::NORMAL;
}

void DroneDelivery::readInput(){
    std::cin >> numLocations;
    //resize locations vector to be numLocations
    locations.resize(static_cast<size_t>(numLocations));
    //read each loc, get its type
    for(int i = 0; i < numLocations; ++i){
        int x;
        int y;
        std::cin >> x >> y;
        //the member var x and y of each value of locations vector (holding struct) set to the values read in
        locations[static_cast<size_t>(i)].x = x;
        locations[static_cast<size_t>(i)].y = y;
        //get location type, initialize val
        locations[static_cast<size_t>(i)].locType = getLocationType(x, y);
    }

}

bool DroneDelivery::isValidEdge(LocationType type1, LocationType type2){
    //if same type, always valid
    if(type1 == type2){
        return true;
    }
    //if different types, at least 1 must be border
    if (type1 == LocationType::BORDER || type2 == LocationType::BORDER){
        return true;
    } 
    //else false
    return false;
}

double DroneDelivery::getDistance(int a, int b){
    //pass in indices a and b, get corresponding locations from locations vector
    const Location& loc1 = locations[static_cast<size_t>(a)];
    const Location& loc2 = locations[static_cast<size_t>(b)];

    //check if valid edge, if not return infinity so it wont ever be chosen
    if (!isValidEdge(loc1.locType, loc2.locType)) {
        return std::numeric_limits<double>::infinity();
    }

    //get distance, prevent int overflow by carrying out calculation as doubles
    double dx = static_cast<double>(loc1.x) - static_cast<double>(loc2.x);
    double dy = static_cast<double>(loc1.y) - static_cast<double>(loc2.y);
    //convert to double before multiplying
    return std::sqrt(dx * dx + dy * dy);
}

void DroneDelivery::runMST(){
    //resize prims table to be numLocations size
    primTable.resize(static_cast<size_t>(numLocations));
    //start at vertex 0
    primTable[0].minDist = 0.0;
    double totalWeight = 0.0; //sum of weights
    std::vector<std::pair<int, int>> edges;
    edges.reserve(static_cast<size_t>(numLocations - 1));

    //add 1 vertex to mst each iteration
    for (int i = 0; i < numLocations; ++i){
        int minVertex = -1;
        double minValue = std::numeric_limits<double>::infinity();

        for (int v = 0; v < numLocations; ++v){
            //look at only outies (!innies)
            if(!primTable[static_cast<size_t>(v)].innie && primTable[static_cast<size_t>(v)].minDist < minValue){
                minValue = primTable[static_cast<size_t>(v)].minDist;
                minVertex = v;
            }
        }

        //if no vertex found or distance is infinity, impossible mst
        if (minVertex == -1 || minValue == std::numeric_limits<double>::infinity()) {
            std::cerr << "Cannot construct MST\n";
            exit(1);
        }
        
        //add vertex to mst
        primTable[static_cast<size_t>(minVertex)].innie = true;

        //record edge that connected this vertex to MST
        //skip for first bc no parent
        if(primTable[static_cast<size_t>(minVertex)].parent != -1){
            totalWeight += minValue; //add weight to total

            //u is v's parent
            int u = primTable[static_cast<size_t>(minVertex)].parent;
            int v = minVertex;

            //make sure smallest idx first
            if(u > v){
                std::swap(u, v);
            }
            //add edge in order
            edges.push_back({u, v});
        }

        //update distances for all vertices not yet in mst by checking if newly added v gives shorter path
        for (int v = 0; v < numLocations; ++v){
            if (!primTable[static_cast<size_t>(v)].innie){
                double dist = getDistance(minVertex, v);
            
                //if dist better than current best update
                if (dist < primTable[static_cast<size_t>(v)].minDist){
                    primTable[static_cast<size_t>(v)].minDist = dist;
                    primTable[static_cast<size_t>(v)].parent = minVertex;
                }
            }
        }
    }
    //output
    //first line total weight
    std::cout << totalWeight << "\n";
    //rest of lines, print edges in order of mst
    for (const auto& e : edges){
        std::cout << e.first << " " << e.second << "\n";
    }
}

//fasttsp
// squared distance w/o edge validation
double DroneDelivery::getDistanceSquared(size_t a, size_t b){
    const Location& loc1 = locations[a];
    const Location& loc2 = locations[b];

    double dx = static_cast<double>(loc1.x) - static_cast<double>(loc2.x);
    double dy = static_cast<double>(loc1.y) - static_cast<double>(loc2.y);
    return dx * dx + dy * dy;
}

// distance w/o edge validation
double DroneDelivery::getDistanceNoValidation(size_t a, size_t b){
    return std::sqrt(getDistanceSquared(a, b));
}

//calculate total path length (make sure to include going back to start node)
double DroneDelivery::calculatePathLength(const std::vector<size_t>& path){
    double total = 0.0;

    //add distances between consecutive vertices
    for(size_t i = 0; i < path.size() - 1; ++i){
        total += getDistanceNoValidation(path[i], path[i + 1]);
    }

    //add distance from last vertex to first
    total += getDistanceNoValidation(path[path.size() - 1], path[0]);

    return total;
}

void DroneDelivery::furthestInsertion(){
    bestPath.clear();
    bestPath.reserve(static_cast<size_t>(numLocations));
    
    if (numLocations == 0){
        return;
    }

    // start at 0
    bestPath.push_back(0);

    if (numLocations == 1){
        bestPathLength = 0.0;
        return;
    }

    const size_t N = static_cast<size_t>(numLocations);

    // prim-like table, using squared distances
    std::vector<bool> inPath(N, false);
    std::vector<double> minDistSquaredToPath(N, std::numeric_limits<double>::infinity());

    inPath[0] = true;

    // initialize distances to vertex 0
    for (size_t i = 0; i < N; ++i){
        if (i != 0){
            minDistSquaredToPath[i] = getDistanceSquared(0, i);
        }
    }

    // find farthest vertex from 0 using squared distances
    size_t farthest = 1;
    double maxDistSquared = minDistSquaredToPath[1];
    for (size_t i = 2; i < N; ++i){
        if (minDistSquaredToPath[i] > maxDistSquared){
            maxDistSquared = minDistSquaredToPath[i];
            farthest = i;
        }
    }

    bestPath.push_back(farthest);
    inPath[farthest] = true;

    // update minDistSquaredToPath using newly added vertex
    for (size_t i = 0; i < N; ++i){
        if (!inPath[i]){
            double distSquared = getDistanceSquared(farthest, i);
            if (distSquared < minDistSquaredToPath[i]){
                minDistSquaredToPath[i] = distSquared;
            }
        }
    }

    //distance from each path vertex to the current farthestVertex
    std::vector<double> distToFarthest(N);

    // insert remaining vertices one at a time
    for (size_t count = 2; count < N; ++count){
        // find farthest vertex from current path (by squared distance)
        size_t farthestVertex = 0;
        double maxDistSquaredValue = -1.0;

        for (size_t v = 0; v < N; ++v){
            if (!inPath[v] && minDistSquaredToPath[v] > maxDistSquaredValue){
                maxDistSquaredValue = minDistSquaredToPath[v];
                farthestVertex = v;
            }
        }

        const size_t pathSize = bestPath.size();

        // precompute d(bestPath[pos], farthestVertex) once per pos
        for (size_t pos = 0; pos < pathSize; ++pos){
            size_t idx = bestPath[pos];
            distToFarthest[pos] = getDistanceNoValidation(idx, farthestVertex);
        }

        // find best position to insert the farthest vertex (where it increases length the least)
        double minIncrease = std::numeric_limits<double>::infinity();
        size_t bestPos = 0;

        for (size_t pos = 0; pos < pathSize; ++pos){
            size_t next = (pos + 1 == pathSize) ? 0 : (pos + 1);

            double oldCost = getDistanceNoValidation(bestPath[pos], bestPath[next]);
            double newCost = distToFarthest[pos] + distToFarthest[next];

            double increase = newCost - oldCost;

            if (increase < minIncrease){
                minIncrease = increase;
                bestPos = next;  // insert before next
            }
        }

        // insert farthest vertex at bestPos
        bestPath.insert(bestPath.begin() + static_cast<long>(bestPos), farthestVertex);
        inPath[farthestVertex] = true;

        // update minDistSquaredToPath using newly inserted vertex
        for (size_t i = 0; i < N; ++i){
            if (!inPath[i]){
                double distSquared = getDistanceSquared(farthestVertex, i);
                if (distSquared < minDistSquaredToPath[i]){
                    minDistSquaredToPath[i] = distSquared;
                }
            }
        }
    }

    bestPathLength = calculatePathLength(bestPath);
}


void DroneDelivery::runFASTTSP(){
    //use farthest insertion
    //ed said no 2 opt
    furthestInsertion();

    //rotate path to start w 0
    auto it = std::find(bestPath.begin(), bestPath.end(), static_cast<size_t>(0));
    if (it != bestPath.end() && it != bestPath.begin()){
        std::rotate(bestPath.begin(), it, bestPath.end());
    }
    
    std::cout << bestPathLength << "\n";
    for (size_t i = 0; i < bestPath.size(); ++i){
            std::cout<< bestPath[i];
            if (i < bestPath.size() - 1){
                std::cout << " ";
            }
    }
    std::cout << "\n";
}

//part c

//calculate mst lower bound for remaining unvisited
double DroneDelivery::calculateMSTLowerBound(size_t permLength){
    const size_t numUnvisited = static_cast<size_t>(numLocations) - permLength;

    if (numUnvisited <= 1){
        return 0.0; //all visited
    }
    
    //build mst on remaining, only unvisited
    std::vector<bool> innie(numUnvisited, false);
    std::vector<double> minDist(numUnvisited, std::numeric_limits<double>::infinity());

    minDist[0] = 0.0;
    double mst_weight = 0.0;

    for (size_t i = 0; i < numUnvisited; ++i){
        size_t minIndex = numUnvisited;
        double minVal = std::numeric_limits<double>::infinity();

        for (size_t j = 0; j < numUnvisited; ++j){
            if (!innie[j] && minDist[j] < minVal){
                minVal = minDist[j];
                minIndex = j;
            }
        }

        if (minIndex == numUnvisited){
            break;  //no more vertices
        }

        innie[minIndex] = true;
        mst_weight += minVal;

        size_t vertex = optimalPath[permLength + minIndex];
        for (size_t j = 0; j < numUnvisited; ++j){
            if (!innie[j]){
                size_t otherVertex = optimalPath[permLength + j];
                double dist = getDistanceNoValidation(vertex, otherVertex);
                if (dist < minDist[j]){
                    minDist[j] = dist;
                }
            }
        }
    }
    return mst_weight;
}

//promising (can current path lead to better solution)
bool DroneDelivery::promising(size_t permLength){
    //if currLength along exceeds best, immediatley prune
    if (currentLength >= optBestLength){
        return false;
    }
    const size_t numUnvisited = static_cast<size_t>(numLocations) - permLength;

    //shortest edge from currvertex to an unvisited vertex
    double minEdgeToUnvisited = std::numeric_limits<double>::infinity();
    double minEdgeToStart = std::numeric_limits<double>::infinity();
    size_t currentVertex = optimalPath[permLength - 1]; //last vertex currently in path
    size_t startVertex = optimalPath[0];
    for (size_t i = permLength; i < static_cast<size_t>(numLocations); ++i){
        size_t vertex = optimalPath[i];
        double distToCurrent = getDistanceNoValidation(currentVertex, vertex);
        double distToStart = getDistanceNoValidation(vertex, startVertex); 

        if (distToCurrent < minEdgeToUnvisited){
            minEdgeToUnvisited = distToCurrent;
        }
        if (distToStart < minEdgeToStart){
            minEdgeToStart = distToStart;
        }
    }

    if (minEdgeToUnvisited == std::numeric_limits<double>::infinity()){
        minEdgeToUnvisited = 0.0;
    }
    if (minEdgeToStart == std::numeric_limits<double>::infinity()){
        minEdgeToStart = 0.0;
    }

    double lowerBound;

    if (numUnvisited <= 4){
        //small k skip mst
        lowerBound = currentLength + minEdgeToUnvisited + minEdgeToStart;
    }
    else{
        //larger k, mst saves time by pruning
        double cheapBound = currentLength + minEdgeToUnvisited + minEdgeToStart;
        if (cheapBound >= optBestLength){
            return false; //already too expensive without mst, NOT promising
        }

        //passed cheap bound now do w mst
        double boundMST = calculateMSTLowerBound(permLength);
        lowerBound = currentLength + boundMST + minEdgeToStart + minEdgeToUnvisited;
    }
    return lowerBound < optBestLength;
}

//genperm w branch and bound
void DroneDelivery::genPerms(size_t permLength){
    if (permLength == static_cast<size_t>(numLocations)){
        // add closing edge
        double lastEdge = getDistanceNoValidation(optimalPath[permLength - 1], optimalPath[0]);
        double tourLength = currentLength + lastEdge;
        if(tourLength < optBestLength){
            optBestLength = tourLength;
            bestPath = optimalPath;
        }
        return;
    }
    
    for (size_t i = permLength; i < static_cast<size_t>(numLocations); ++i){
        std::swap(optimalPath[permLength], optimalPath[i]);

        double edge = getDistanceNoValidation(optimalPath[permLength - 1], optimalPath[permLength]);
        currentLength += edge;
        
        if (promising(permLength + 1)){
            genPerms(permLength + 1);
        }
        
        currentLength -= edge;
        std::swap(optimalPath[permLength], optimalPath[i]);
    }
}

void DroneDelivery::runOPTTSP(){
    if (numLocations <= 0) {
        std::cout << 0.0 << "\n\n";
        return;
    }
    if (numLocations == 1) {
        std::cout << 0.0 << "\n0\n";
        return;
    }
    if (numLocations == 2) {
        double length = getDistanceNoValidation(0, 1) * 2.0;
        std::cout << length << "\n0 1\n";
        return;
    }
    //initialize w FASTTSP solution as upper bound
    furthestInsertion();
    optBestLength = bestPathLength;

    //rotate so it starts at 0
    auto it0 = std::find(bestPath.begin(), bestPath.end(), static_cast<size_t>(0));
    if (it0 != bestPath.end() && it0 != bestPath.begin()){
        std::rotate(bestPath.begin(), it0, bestPath.end());
    }

    //use as starting permutation, FASTTSP
    optimalPath = bestPath;

    currentLength = 0.0;
    //start w vertex 0 fixed so
    genPerms(1);

    //rotate to make it start with 0
    auto it = std::find(bestPath.begin(), bestPath.end(), static_cast<size_t>(0));
    if (it != bestPath.end() && it != bestPath.begin()){
        std::rotate(bestPath.begin(), it, bestPath.end());
    }

    //output
    std::cout << optBestLength << "\n";
    for (size_t i = 0; i < bestPath.size(); ++i){
        std::cout << bestPath[i];
        if (i < bestPath.size() - 1){
            std::cout << " "; //space after all but last
        }
    }
    std::cout << "\n";
}