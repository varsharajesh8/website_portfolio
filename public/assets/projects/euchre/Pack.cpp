#include "Pack.hpp"
#include "Card.hpp"
#include <iostream>
#include <sstream>
#include <algorithm>
#include <cassert>
//default constructor
Pack::Pack(){
  int index = 0;
  for(int suit = SPADES; suit <= DIAMONDS; ++suit){
    for(int rank = NINE; rank <= ACE; ++rank){
      cards[index] = Card(static_cast<Rank>(rank), static_cast<Suit>(suit));
      index++;
    }
  }
  next = 0;
}
// REQUIRES: pack_input contains a representation of a Pack in the
  //           format required by the project specification
  // MODIFIES: pack_input
  // EFFECTS: Initializes Pack by reading from pack_input.
  // NOTE: The pack is initially full, with no cards dealt.
  Pack::Pack(std::istream& pack_input){
    int index = 0;
    std::string line;
    while(std::getline(pack_input, line) && index < PACK_SIZE){
        std::istringstream is(line);
        Card card;
        is >> card;
        cards[index] = card;
        index++;
    }
    next = 0;
  }
  // REQUIRES: cards remain in the Pack
  // EFFECTS: Returns the next card in the pack and increments the next index
  Card Pack :: deal_one(){ 
    assert(next < PACK_SIZE); //check if pack still has cards to deal
    return cards[next++]; //returns card at next index and increments next

  }
  // EFFECTS: Resets next index to first card in the Pack
  void Pack::reset(){
    next = 0; 
  }
    
  // EFFECTS: Shuffles the Pack and resets the next index. This
  //          performs an in shuffle seven times. See
  //          https://en.wikipedia.org/wiki/In_shuffle.
  void Pack::shuffle(){
    //to repeat shuffle 7 times
    for(int i = 0; i < 7; i++){
    //array to hold shuffled cards
      std::array<Card, PACK_SIZE> shuffle_cards;
      //starting indices of first and second half of pack
      int first_half = 0;
      int second_half = PACK_SIZE/2;
      for(int j = 0; j < PACK_SIZE; j++){
        //if j is even, put card from second half of pack into shuffle_cards array
        if(j % 2 == 0){
            //take a card from second half
            shuffle_cards[j] = cards[second_half];
            second_half++;
        }
        else{
            //take a card from first half
            shuffle_cards[j] = cards[first_half];
            first_half++;
        }
      }
      //copy shuffled cards back into cards array
      for (int k = 0; k < PACK_SIZE; k++){
        cards[k] = shuffle_cards[k];
      }
    }
    reset(); //reset next index after shuffle
  }
  

  // EFFECTS: returns true if there are no more cards left in the pack
  bool Pack::empty() const{
    return next == PACK_SIZE;  
  }