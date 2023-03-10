// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Voting {

    /// @dev オーナーはこのコントラクトをデプロイしたアカウント
    address public owner = msg.sender;

    /// @dev 候補者・投票者それぞれのデータ構造
    struct Candidate {
        string name;
        uint[] score;
    }
    struct Voter {
        bool voted;
        uint[] scores;
    }

    /// @dev 候補者の配列、アドレスと投票者を結びつけるマッピング
    Candidate[] public candidates;
    mapping(address => Voter) public voters;


    constructor(string[] memory candidateNames) {
        /*
         * @dev もし候補者の人数に制限があるなら
         * - require(candidateNames.length == 5, "The number of candidates must be 5.");
         */

        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], new uint[](0)));

            /// @dev 候補者の名前に被りがあってはならない
            for(uint j = i + 1; j < candidateNames.length; j++) {
                require(!compareStrings(candidateNames[i], candidateNames[j]), "Each candidate's name must be different");
            }
            
        }
    }

    /// @dev オーナーだけができる、というのを示すmodifier修飾子
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner.");
        _;
    }


    /// @dev 配列の中から文字を検索し、それが配列の何番目にあるかを返す
    function searchIndexStr(string[] memory strArr, string memory str) internal pure returns (uint) {
        for (uint i = 0; i < strArr.length; i++) {
            if (keccak256(abi.encodePacked(strArr[i])) == keccak256(abi.encodePacked(str))) {
                return i;
            }
        }

        /// @dev もし検索して出てこなければ-1を返す
        int errInt = -1;
        uint errUint = uint(errInt);
        errUint = uint(int(errUint) + errInt);
        return errUint;

    }

    
    function searchIndexUint(uint[] memory uintArr, uint num) internal pure returns (int) {
        for (uint i = 0; i < uintArr.length; i++) {
            if (uintArr[i] == num) {
                return int(i);
            }
        }

        // 検索して見つからなかった場合は-1を返す
        return -1;
    }

    


    /// @dev 2つのstringが同じかどうかを見比べる
    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    /* 
     * @dev 
     * - 投票
     * - 一度投票したら二度と投票できない
     * - 候補者の数と同じ数の配列であることを確認
     * - 点数は1-5点
     */
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

    /// @dev 自分の投票内容を見る
    function getVoterScores() public view returns (uint[] memory) {
        Voter storage sender = voters[msg.sender];
        require(sender.voted, "You have not voted yet.");
        return sender.scores;
    }

    /// @dev オーナーのみ他人の投票内容を確認できる。
    function ForOwnerGetVoterScores(address voterAddress) public view onlyOwner returns (uint[] memory) {
        Voter storage voter = voters[voterAddress];
        require(voter.voted, "This voter has not voted yet.");
        return voter.scores;
    }

    /// @dev 中央値の計算。外部の状態は参照しないし変更もしないのでpure
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

    function greaterMed(uint[] memory Arr) public pure returns (uint) {
        uint counter = 0;
        uint median = calculateMedian(Arr);
        for(uint i = 0; i < Arr.length; i++) {
            if (median < Arr[i]) {
                counter++;
            }
        }
        return counter;
    }

    /// @dev uint型をstring型に変換
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

    /* @dev 優勝者を返す
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
    */

    /// @dev 全体の結果を表示
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
                else if (medians[j] == medians[i]){
                    if (greaterMed(candidates[j].score) > greaterMed(candidates[i].score)) {
                        rank++;
                    }
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

    /// @dev 優勝者を返す
    function getWinner() public view returns (string memory winnerName) {
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
                else if (medians[j] == medians[i]){
                    if (greaterMed(candidates[j].score) < greaterMed(candidates[i].score)) {
                        rank++;
                    }
                }
            }
            ranks[i] = rank;
        }
        int myInt = 1;
        uint winner = uint(searchIndexUint(ranks, uint(myInt)));
        return candidates[winner].name;

    }

    /*
     * @dev
     * - インデックスで各々の結果を調べたいならこれを有効化
    function getIndividualResults(uint CandidateNum) public view returns (string memory MedianValue, uint Rank) {
        
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

    /// @dev 候補者名を入れると、その人の中央値と順位が返される
    function getIndividualResults(string memory CandidateName) public view returns (string memory MedianValue, uint Rank) {
        
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

        uint CandidateNum = searchIndexStr(names, CandidateName);

        MedianValue = uint2str(medians[CandidateNum]);
        Rank = ranks[CandidateNum];        

        return (MedianValue, Rank);
    }

}