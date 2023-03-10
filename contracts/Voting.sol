// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract Voting {
    struct Candidate {
        string name;
        uint[] score;
    }
    struct Voter {
        bool voted;
        uint[] scores;
    }

    Candidate[] public candidates;
    mapping(address => Voter) public voters;
    address public owner;


    constructor(string[] memory candidateNames) {
        /// require(candidateNames.length == 5, "The number of candidates must be 5.");
        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], new uint[](0)));

            
            for(uint j = i + 1; j < candidateNames.length; j++) {
                require(!compareStrings(candidateNames[i], candidateNames[j]), "Each candidate's name must be different");
            }
            
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner.");
        _;
    }



    function searchIndex(string[] memory strArr, string memory str) internal pure returns (uint) {
        for (uint i = 0; i < strArr.length; i++) {
            if (keccak256(abi.encodePacked(strArr[i])) == keccak256(abi.encodePacked(str))) {
                return i;
            }
        }
        int errInt = -1;
        uint errUint = uint(errInt);
        errUint = uint(int(errUint) + errInt);
        return errUint;

    }


    /// @dev 2つのstringが同じかどうかを見比べる
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }


    function vote(uint[] memory _scores) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted.");
        require(_scores.length == candidates.length, "Invalid number of scores.");
        for (uint i = 0; i < _scores.length; i++) {
            require(_scores[i] >= 1 && _scores[i] <= 5, "The point must be between 1 and 5.");
            candidates[i].score.push(_scores[i]);
            sender.scores.push(_scores[i]);
        }
        sender.voted = true;
    }

    function getVoterScores() public view returns (uint[] memory) {
        Voter storage sender = voters[msg.sender];
        require(sender.voted, "You have not voted yet.");
        return sender.scores;
    }

    /*
     * @dev
     * - オーナーだけが他の人の投票結果を見られるようにしたいが、オーナーを認識しないエラーが出たまま。
    function getVoterScoresForOwner(address voterAddress) public view onlyOwner returns (uint[] memory) {
        Voter storage voter = voters[voterAddress];
        require(voter.voted, "This voter has not voted yet.");
        return voter.scores;
    }
    */


    function calculateMedian(uint[] memory _arr) private pure returns (uint) {
        uint len = _arr.length;
        if (len == 0) return 0;
        uint mid = len / 2;
        uint[] memory arr = _arr;

        for (uint i = 0; i < len; i++) {
            uint min = i;
            for (uint j = i + 1; j < len; j++) {
                if (arr[j] < arr[min]) {
                    min = j;
                }
            }
            uint tmp = arr[min];
            arr[min] = arr[i];
            arr[i] = tmp;
        }

        if (len % 2 == 0) {
            return (arr[mid - 1] + arr[mid]) / 2;
        } else {
            return arr[mid];
        }
    }

    function uint2str(uint _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint k = length;
        while (_i != 0) {
            k = k-1;
            uint8 temp = uint8(48 + _i % 10);
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        str = string(bstr);
    }

    function getWinner() public view returns (string memory winnerName) {
        uint[] memory medians = new uint[](candidates.length);

        for (uint i = 0; i < candidates.length; i++) {
            medians[i] = calculateMedian(candidates[i].score);
        }

        uint highestMedian = 0;

        for (uint i = 0; i < medians.length; i++) {
            if (medians[i] > medians[highestMedian]) {
                highestMedian = i;
            }
        }

        return candidates[highestMedian].name;
    }


    function getResults() public view returns (string[] memory name_, uint[] memory median_, uint[] memory rank_) {
        
        uint[] memory medians = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            medians[i] = calculateMedian(candidates[i].score);
        }

        uint[] memory ranks = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            uint rank = 1;
            for (uint j = 0; j < candidates.length; j++) {
                if (medians[j] > medians[i]) {
                    rank++;
                }
            }
            ranks[i] = rank;
        }

        string[] memory names = new string[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            names[i] = candidates[i].name;
        }


        return (names, medians, ranks);
    }

    /*
    function getPersonalResults(uint CandidateNum) public view returns (string memory MedianValue, uint Rank) {
        
        uint[] memory medians = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            medians[i] = calculateMedian(candidates[i].score);
        }

        uint[] memory ranks = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            uint rank = 1;
            for (uint j = 0; j < candidates.length; j++) {
                if (medians[j] > medians[i]) {
                    rank++;
                }
            }
            ranks[i] = rank;
        }

        string[] memory names = new string[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            names[i] = candidates[i].name;
        }

        MedianValue = uint2str(medians[CandidateNum]);
        Rank = ranks[CandidateNum];        

        return (MedianValue, Rank);
    }
    */

    function getPersonalResults(string memory CandidateName) public view returns (string memory MedianValue, uint Rank) {
        
        uint[] memory medians = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            medians[i] = calculateMedian(candidates[i].score);
        }

        uint[] memory ranks = new uint[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            uint rank = 1;
            for (uint j = 0; j < candidates.length; j++) {
                if (medians[j] > medians[i]) {
                    rank++;
                }
            }
            ranks[i] = rank;
        }

        string[] memory names = new string[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            names[i] = candidates[i].name;
        }

        uint CandidateNum = searchIndex(names, CandidateName);

        MedianValue = uint2str(medians[CandidateNum]);
        Rank = ranks[CandidateNum];        

        return (MedianValue, Rank);
    }

}