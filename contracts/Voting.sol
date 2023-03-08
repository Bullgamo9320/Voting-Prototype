// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Voting {
    struct Voter {
        bool voted;
        uint[] scores;
    }

    struct Candidate {
        uint score;
        string name;
    }

    Candidate[] public candidates;
    mapping(address => Voter) public voters;

    constructor() {
        candidates.push(Candidate(0, "Alice"));
        candidates.push(Candidate(0, "Bob"));
        candidates.push(Candidate(0, "Chris"));
        candidates.push(Candidate(0, "David"));
        candidates.push(Candidate(0, "Edward"));
    }

    function vote(uint[] memory _scores) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted.");
        require(_scores.length == candidates.length, "Invalid number of scores.");
        uint totalScore = 0;
        for (uint i = 0; i < candidates.length; i++) {
            require(_scores[i] >= 1 && _scores[i] <= 5, "Invalid score.");
            totalScore += _scores[i];
        }
        require(totalScore == 15, "Total score must be 15.");
        sender.voted = true;
        sender.scores = _scores;
        for (uint i = 0; i < candidates.length; i++) {
            candidates[i].score += _scores[i];
        }
    }

    function getWinner() public view returns (string memory) {
        uint winningScore = 0;
        uint winnerIndex = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].score > winningScore) {
                winningScore = candidates[i].score;
                winnerIndex = i;
            }
        }
        return candidates[winnerIndex].name;
    }

    function getResults() public view returns (string[] memory, uint[] memory, uint[] memory) {
        uint[] memory scores = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            scores[i] = candidates[i].score;
        }
        uint[] memory ranks = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            uint rank = 1;
            for (uint j = 0; j < candidates.length; j++) {
                if (candidates[j].score > candidates[i].score) {
                    rank++;
                }
            }
            ranks[i] = rank;
        }
        string[] memory names = new string[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            names[i] = candidates[i].name;
        }
        return (names, scores, ranks);
    }
}
