import Image from 'next/image'
import { Inter } from 'next/font/google'
import {useState, useEffect} from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import { VotingAddress } from '../../contracts'
import Voting from '../contracts/Voting.json'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState(false)
  const [numOfVoters, setNumOfVoters] = useState('')
  const [winner, setWinner] = useState('')
  const [owner, setOwner] = useState('')
  const [result, setResult] = useState({names: '', medians: '', ranks: ''});
  const [individualResult, setIndividualResult] = useState({ MedianValue: '', Rank: '', ScoreGet: ''});
  const [getVoterScores, setGetVoterScores] = useState('');
  const [candidate, setCandidate] = useState('');
  const [voterAddress, setVoterAddress] = useState('');
  const [voterScores, setVoterScores] = useState('');
  const [VoteEnded, setVoteEnded] = useState(false);
  const [Vote, setVote] = useState([100,100,100,100,100,100,100,100,100,100,100]);//changehere
  const [tempvote, setTempvote] = useState([100,100,100,100,100,100,100,100,100,100,100]);//changehere
  const [activeButtonIndex1, setActiveButtonIndex1] = useState(-1);
  const [activeButtonIndex2, setActiveButtonIndex2] = useState(-1);
  const [activeButtonIndex3, setActiveButtonIndex3] = useState(-1);
  const [activeButtonIndex4, setActiveButtonIndex4] = useState(-1);
  const [activeButtonIndex5, setActiveButtonIndex5] = useState(-1);
  const [activeButtonIndex6, setActiveButtonIndex6] = useState(-1);
  const [activeButtonIndex7, setActiveButtonIndex7] = useState(-1);
  const [activeButtonIndex8, setActiveButtonIndex8] = useState(-1);
  const [activeButtonIndex9, setActiveButtonIndex9] = useState(-1);
  const [activeButtonIndex10, setActiveButtonIndex10] = useState(-1);
  const [activeButtonIndex11, setActiveButtonIndex11] = useState(-1);//changehere
  const mumbaiId = "0x13881";
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  
  const checkMetaMaskInstalled = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('MetaMaskをインストールしてください！');
    }
  }

  const checkChainId = async () => {
    const { ethereum } = window;
    if(ethereum) {
      const chain = await ethereum.request({method: 'eth_chainId'});
      console.log(`chain: ${chain}`);

      if (chain != mumbaiId) {
        alert('Mumbaiに接続してください')
        setChainId(false)
        return
      } else {
        setChainId(true)
      }
    }
  }

const connectWallet = async () => {
  try{
    const { ethereum } = window;
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts'
    });
    console.log(`account: ${accounts[0]}`)
    setAccount(accounts[0])

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const votingContract = new ethers.Contract(VotingAddress, Voting.abi, signer);


    try {
      const scores = await votingContract.getVoterScores();
      setGetVoterScores(scores);
    } catch (err) {
      setGetVoterScores('');
      console.error(err);
    }

    const numOfVoters = await votingContract.numOfVoters();
    console.log(`numOfVoters: ${numOfVoters}`);
    setNumOfVoters(numOfVoters);

    const Owner = await votingContract.owner();
    console.log(`owner: ${Owner}`);
    setOwner(Owner);

    const VoteEnded = await votingContract.voteEnded();
    console.log(`VoteEnded: ${VoteEnded}`);
    setVoteEnded(VoteEnded); 

    ethereum.on('accountsChanged', checkAccountChanged);
    ethereum.on('chainChanged', checkChainId);
  } catch (err) {
    console.log(err)
  }
}




const checkAccountChanged = () => {
  setAccount('');
  setOwner('');
  setNumOfVoters('');
  setWinner('');
  setResult({names: '', medians: '', ranks: ''});
  setIndividualResult({ MedianValue: '', Rank: '', ScoreGet: ''});
  setVoterAddress('');
  setVoterScores('');
  setGetVoterScores('');
  setVoteEnded(false);
  setTempvote([100,100,100,100,100,100,100,100,100,100,100]);//changehere
  setVote([]);
  setActiveButtonIndex1(-1);
  setActiveButtonIndex2(-1);
  setActiveButtonIndex3(-1);
  setActiveButtonIndex4(-1);
  setActiveButtonIndex5(-1);
  setActiveButtonIndex6(-1);
  setActiveButtonIndex7(-1);
  setActiveButtonIndex8(-1);
  setActiveButtonIndex9(-1);
  setActiveButtonIndex10(-1);
  setActiveButtonIndex11(-1);//changehere
  setCandidate('');
}


const handleAddressChange = (e) => {
  setVoterAddress(e.target.value); // アドレスを更新
};


const handleResultDisplay = async (event) => {

  event.preventDefault();

  const { ethereum } = window;
  const accounts = await ethereum.request({
    method: 'eth_requestAccounts'
  });
  console.log(`account: ${accounts[0]}`)
  setAccount(accounts[0])

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const votingContract = new ethers.Contract(VotingAddress, Voting.abi, signer);

  try{
    const getOtherScores = await votingContract.ForOwnerGetVoterScores(voterAddress); // アドレスを引数に渡す
    console.log(`his/her vote result: ${getOtherScores}`);
    setVoterScores(getOtherScores); // 結果を状態として保存
  } catch (err) {
    console.log(err)
    setVoterScores('no')
  }
};

const handleCandidate = (e) => {
  setCandidate(e.target.value);
}

const IndividualLive = async (event) => {
  event.preventDefault();

  const { ethereum } = window;
  const accounts = await ethereum.request({
    method: 'eth_requestAccounts'
  });
  console.log(`account: ${accounts[0]}`)
  setAccount(accounts[0])

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const votingContract = new ethers.Contract(VotingAddress, Voting.abi, signer);

  if (candidate == "PJ1" || candidate == "PJ2" || candidate =="PJ3" || candidate == "PJ4" || candidate == "PJ5" || candidate == "PJ6" || candidate == "PJ7" || candidate == "PJ8" || candidate == "PJ9" || candidate == "PJ10"  || candidate == "PJ11"){ //changehere
    const individualResult = await votingContract.getIndividualResults(candidate);
    setIndividualResult(individualResult);
  }
  else{
    alert('「PJ⚪︎」(例：PJ1,PJ9)のような形で記入してください');
    setIndividualResult({ MedianValue: '', Rank: '', ScoreGet: ''});
  }
}



const handleButtonClick1 = (value: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  const newTempvote = [...tempvote];
  newTempvote.splice(index, 1, value);
  setTempvote(newTempvote);
  setActiveButtonIndex1(value);
};
const handleButtonClick2 = (value: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  const newTempvote = [...tempvote];
  newTempvote.splice(index, 1, value);
  setTempvote(newTempvote);
  setActiveButtonIndex2(value);
};
const handleButtonClick3 = (value: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  const newTempvote = [...tempvote];
  newTempvote.splice(index, 1, value);
  setTempvote(newTempvote);
  setActiveButtonIndex3(value);
};
const handleButtonClick4 = (value: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  const newTempvote = [...tempvote];
  newTempvote.splice(index, 1, value);
  setTempvote(newTempvote);
  setActiveButtonIndex4(value);
};
const handleButtonClick5 = (value: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  const newTempvote = [...tempvote];
  newTempvote.splice(index, 1, value);
  setTempvote(newTempvote);
  setActiveButtonIndex5(value);
};
const handleButtonClick6 = (value: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  const newTempvote = [...tempvote];
  newTempvote.splice(index, 1, value);
  setTempvote(newTempvote);
  setActiveButtonIndex6(value);
};
const handleButtonClick7 = (value: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  const newTempvote = [...tempvote];
  newTempvote.splice(index, 1, value);
  setTempvote(newTempvote);
  setActiveButtonIndex7(value);
};
const handleButtonClick8 = (value: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  const newTempvote = [...tempvote];
  newTempvote.splice(index, 1, value);
  setTempvote(newTempvote);
  setActiveButtonIndex8(value);
};
const handleButtonClick9 = (value: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  const newTempvote = [...tempvote];
  newTempvote.splice(index, 1, value);
  setTempvote(newTempvote);
  setActiveButtonIndex9(value);
};
const handleButtonClick10 = (value: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  const newTempvote = [...tempvote];
  newTempvote.splice(index, 1, value);
  setTempvote(newTempvote);
  setActiveButtonIndex10(value);
};
const handleButtonClick11 = (value: number, index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  event.preventDefault();
  const newTempvote = [...tempvote];
  newTempvote.splice(index, 1, value);
  setTempvote(newTempvote);
  setActiveButtonIndex11(value);
};//changehere

const voting = async (event) => {
  event.preventDefault();
  const { ethereum } = window;
  const accounts = await ethereum.request({
    method: 'eth_requestAccounts'
  });
  console.log(`account: ${accounts[0]}`)
  setAccount(accounts[0])

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const votingContract = new ethers.Contract(VotingAddress, Voting.abi, signer);

  const VOTE = await votingContract.vote(tempvote);
  await VOTE.wait();

}

const endvote = async (event) => {
  event.preventDefault();
  const { ethereum } = window;
  const accounts = await ethereum.request({
    method: 'eth_requestAccounts'
  });
  console.log(`account: ${accounts[0]}`)
  setAccount(accounts[0])

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const votingContract = new ethers.Contract(VotingAddress, Voting.abi, signer);

  const END = await votingContract.endVoting();
  setVoteEnded(true);
  await END.wait();
}

const live = async (event) => {
  event.preventDefault();
  const { ethereum } = window;
  const accounts = await ethereum.request({
    method: 'eth_requestAccounts'
  });
  console.log(`account: ${accounts[0]}`)
  setAccount(accounts[0])

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const votingContract = new ethers.Contract(VotingAddress, Voting.abi, signer);

  const result = await votingContract.getResults();
  console.log(`name: ${result}`);
  setResult(result);

}

const GetWinner = async (event) => {
  event.preventDefault();
  const { ethereum } = window;
  const accounts = await ethereum.request({
    method: 'eth_requestAccounts'
  });
  console.log(`account: ${accounts[0]}`)
  setAccount(accounts[0])

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const votingContract = new ethers.Contract(VotingAddress, Voting.abi, signer);

  const winner = await votingContract.getWinner();
  console.log(`winner: ${winner}`);
  setWinner(winner);
}



  useEffect(() => {
    checkMetaMaskInstalled()
    checkChainId()
  }, [])
  return (
    <div className={'flex flex-col items-center bg-slate-100 text-blue-900 min-h-screen'}>
      <Head>
        <title>VotingDApp</title>
        <meta name ="description" content="Generated by create next app"></meta>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <h2 className={"text-6xl font-bold my-12 mt-8"}>
        Voting DApp
      </h2>
      <div className='mt-8 mb-16 hover:rotate-180 hover:scale-105 transition duration-700 ease-in-out'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='160'
          height='160'
          viewBox='0 0 350 350'
        >
          <polygon points="0 0, 175 0, 175 175, 0 175" stroke="black" fill="#0000ff" />
          <polygon points="0 175, 175 175, 175 350, 0 350" stroke="black" fill="#ffc0cb" />
          <polygon points="175 0, 350 0, 350 175, 175 175" stroke="black" fill="#90EE90" />
          <polygon points="175 175, 350 175, 350 350, 175 350" stroke="black" fill="#ffff00" />
        </svg>
      </div>
      <div className={'flex mt-1'}>
        {account === '' ? (
          <button className={'bg-transparent text-blue-700 font-semibold py-2 px-4 border border-blue-500 rounded hover:border-transparent hover:text-white hover:bg-blue-500 hover:cursor-pointer'}
          onClick={connectWallet}>
          Metamaskを接続
          </button>
        ) : (
          chainId ? (
            <div >
              {account.toLowerCase() === owner.toLowerCase() ? (
                <div className='px-2 py-2 bg-transparent'>
                  <span className="flex flex-col items-left font-semibold">あなたはオーナーです</span>
                  <button 
                    className="w-2/8 mx-2 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
                    onClick={endvote}
                  >投票終了</button>
                  
                <>
                  <div>
                    <input
                      type="text"
                      className="w-7/12 ml-2 text-center border border-gray-400"
                      name="VoterAddress"
                      placeholder="アドレスを入力"
                      onChange={handleAddressChange}
                      value={voterAddress} // アドレスの状態を反映
                    />
                    <button
                      className="w-2/8 mx-2 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
                      onClick={handleResultDisplay} // ボタンクリック時に結果を取得
                    >
                      結果表示
                    </button>
                    {voterScores !== "no" && voterScores !== '' ? (
                      <div>
                        <span className="flex flex-col items-left font-semibold">
                          PJ1:{`${voterScores[0].toString() === "1" ? "やめた方がいい" : voterScores[0].toString() === "2" ? "まあいいんじゃない" : voterScores[0].toString() === "3" ? "いいね/興味あり" : voterScores[0].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[0].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          PJ2:{`${voterScores[1].toString() === "1" ? "やめた方がいい" : voterScores[1].toString() === "2" ? "まあいいんじゃない" : voterScores[1].toString() === "3" ? "いいね/興味あり" : voterScores[1].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[1].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          PJ3:{`${voterScores[2].toString() === "1" ? "やめた方がいい" : voterScores[2].toString() === "2" ? "まあいいんじゃない" : voterScores[2].toString() === "3" ? "いいね/興味あり" : voterScores[2].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[2].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          PJ4:{`${voterScores[3].toString() === "1" ? "やめた方がいい" : voterScores[3].toString() === "2" ? "まあいいんじゃない" : voterScores[3].toString() === "3" ? "いいね/興味あり" : voterScores[3].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[3].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          PJ5:{`${voterScores[4].toString() === "1" ? "やめた方がいい" : voterScores[4].toString() === "2" ? "まあいいんじゃない" : voterScores[4].toString() === "3" ? "いいね/興味あり" : voterScores[4].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[4].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          PJ6:{`${voterScores[5].toString() === "1" ? "やめた方がいい" : voterScores[5].toString() === "2" ? "まあいいんじゃない" : voterScores[5].toString() === "3" ? "いいね/興味あり" : voterScores[5].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[5].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          PJ7:{`${voterScores[6].toString() === "1" ? "やめた方がいい" : voterScores[6].toString() === "2" ? "まあいいんじゃない" : voterScores[6].toString() === "3" ? "いいね/興味あり" : voterScores[6].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[6].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          PJ8:{`${voterScores[7].toString() === "1" ? "やめた方がいい" : voterScores[7].toString() === "2" ? "まあいいんじゃない" : voterScores[7].toString() === "3" ? "いいね/興味あり" : voterScores[7].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[7].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          PJ9:{`${voterScores[8].toString() === "1" ? "やめた方がいい" : voterScores[8].toString() === "2" ? "まあいいんじゃない" : voterScores[8].toString() === "3" ? "いいね/興味あり" : voterScores[8].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[8].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          PJ10:{`${voterScores[9].toString() === "1" ? "やめた方がいい" : voterScores[9].toString() === "2" ? "まあいいんじゃない" : voterScores[9].toString() === "3" ? "いいね/興味あり" : voterScores[9].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[9].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          PJ11:{`${voterScores[10].toString() === "1" ? "やめた方がいい" : voterScores[10].toString() === "2" ? "まあいいんじゃない" : voterScores[10].toString() === "3" ? "いいね/興味あり" : voterScores[10].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[10].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        {//changehere
                        }
                      </div>
                    ) : (
                      <div>
                        {voterScores === "no" && (
                          <span className="flex flex-col items-left font-semibold">
                            未投票
                          </span>
                        )}
                      </div>
                    )}

                  </div>
                </>
                </div>
              ):(<></>)
              }
              <div className='px-2 py-2 bg-transparent'>
                {VoteEnded == false ? (
                  <span className="flex flex-col mb-5 items-left text-2xl font-semibold">
                    投票受付中
                  </span>
                ) : (
                  <span className="flex flex-col mb-5 items-left text-4xl font-semibold">
                    投票終了
                  </span>
                )}
                <span className="flex flex-col items-left font-semibold">投票者数：{`${numOfVoters}`}</span>
                <span className="flex flex-col items-left font-semibold">オーナー：{owner}</span>
              </div>
              <div className='px-2 py-2 mb-2 bg-white border border-gray-400'>
                <span className="flex flex-col items-left font-semibold">あなたのアドレス：{account}</span>
                {getVoterScores.length > 0 ? (
                  <div>
                    <span className="flex flex-col items-left font-semibold">
                      あなたの投票結果：PJ1:{`${getVoterScores[0].toString() === "1" ? "やめた方がいい" : getVoterScores[0].toString() === "2" ? "まあいいんじゃない" : getVoterScores[0].toString() === "3" ? "いいね/興味あり" : getVoterScores[0].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[0].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　PJ2:{getVoterScores[1].toString() === "1" ? "やめた方がいい" : getVoterScores[1].toString() === "2" ? "まあいいんじゃない" : getVoterScores[1].toString() === "3" ? "いいね/興味あり" : getVoterScores[1].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[1].toString() === "100" ? "棄権" : ""}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　PJ3:{`${getVoterScores[2].toString() === "1" ? "やめた方がいい" : getVoterScores[2].toString() === "2" ? "まあいいんじゃない" : getVoterScores[2].toString() === "3" ? "いいね/興味あり" : getVoterScores[2].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[2].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　PJ4:{`${getVoterScores[3].toString() === "1" ? "やめた方がいい" : getVoterScores[3].toString() === "2" ? "まあいいんじゃない" : getVoterScores[3].toString() === "3" ? "いいね/興味あり" : getVoterScores[3].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[3].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　PJ5:{`${getVoterScores[4].toString() === "1" ? "やめた方がいい" : getVoterScores[4].toString() === "2" ? "まあいいんじゃない" : getVoterScores[4].toString() === "3" ? "いいね/興味あり" : getVoterScores[4].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[4].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　PJ6:{`${getVoterScores[5].toString() === "1" ? "やめた方がいい" : getVoterScores[5].toString() === "2" ? "まあいいんじゃない" : getVoterScores[5].toString() === "3" ? "いいね/興味あり" : getVoterScores[5].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[5].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　PJ7:{`${getVoterScores[6].toString() === "1" ? "やめた方がいい" : getVoterScores[6].toString() === "2" ? "まあいいんじゃない" : getVoterScores[6].toString() === "3" ? "いいね/興味あり" : getVoterScores[6].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[6].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　PJ8:{`${getVoterScores[7].toString() === "1" ? "やめた方がいい" : getVoterScores[7].toString() === "2" ? "まあいいんじゃない" : getVoterScores[7].toString() === "3" ? "いいね/興味あり" : getVoterScores[7].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[7].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　PJ9:{`${getVoterScores[8].toString() === "1" ? "やめた方がいい" : getVoterScores[8].toString() === "2" ? "まあいいんじゃない" : getVoterScores[8].toString() === "3" ? "いいね/興味あり" : getVoterScores[8].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[8].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　PJ10:{`${getVoterScores[9].toString() === "1" ? "やめた方がいい" : getVoterScores[9].toString() === "2" ? "まあいいんじゃない" : getVoterScores[9].toString() === "3" ? "いいね/興味あり" : getVoterScores[9].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[9].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　PJ11:{`${getVoterScores[10].toString() === "1" ? "やめた方がいい" : getVoterScores[10].toString() === "2" ? "まあいいんじゃない" : getVoterScores[10].toString() === "3" ? "いいね/興味あり" : getVoterScores[10].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[10].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    {//changehere
                    }
                  </div>
                ) : ( 
                  <span className="flex flex-col items-left font-semibold">
                    あなたの投票結果：未投票
                  </span>
                )
                }
              </div>
              {getVoterScores.length == 0 && VoteEnded === false ? (
              <>
              <span className="flex flex-col mt-10 items-left font-semibold">各マークの意味</span>
              <span className="flex flex-col mb-10 items-left font-semibold">❤️：ひとめぼれ/大好き、👍：いいね/興味あり、😐：まあいいんじゃない、👎：やめた方がいい</span>
                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                    <span className="pb-4 text-base font-semibold">PJ1：講義情報と開講棟・教室を簡易検索できるデジタルサイネージの設置</span>
                    <span className="pb-4 text-base">予算：1000万円</span>
                    <span className="pb-1 text-sm">本郷キャンパスを初めて利用する学生にとって、部局横断科目を履修する際に開講教室に迷うことがあるため、</span>
                    <span className="pb-1 text-sm">その改善に向けてキャンパス内の要所要所にデジタルサイネージにて個々人が即時検索できる環境の構築を行うことで、</span>
                    <span className="pb-4 text-sm">より良いキャンパスに寄与できると考えます。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick1(4, 0,event)}
                      >
                        ❤️
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick1(3, 0,event)}
                      >
                        👍
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick1(2, 0,event)}
                      >
                        😐
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick1(1, 0,event)}
                      >
                        👎
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 100 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick1(100, 0,event)}
                      >
                        棄権する
                      </button>
                    </div>      
                  </div>
            
                </form>
                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                  <span className="pb-4 text-base font-semibold">PJ2：たこやき屋を作る</span>
                    <span className="pb-4 text-base">予算：1000万円</span>
                    <span className="pb-4 text-sm">大学にいるときに小腹が空くことが多々あるので、そのときに軽く食べられるたこ焼き屋を構内に設置する。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick2(4, 1,event)}
                      >
                        ❤️
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick2(3, 1, event)}
                      >
                        👍
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick2(2, 1,event)}
                      >
                        😐
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick2(1, 1,event)}
                      >
                        👎
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 100 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick2(100, 1,event)}
                      >
                        棄権する
                      </button>
                    </div>      
                  </div>
            
                </form>
                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                  <span className="pb-4 text-base font-semibold">PJ3：食堂を増やす</span>
                    <span className="pb-4 text-base">予算：1億円</span>
                    <span className="pb-1 text-sm">食堂が混み過ぎて、2限3限が両方ある時に利用すると授業に遅刻するため使えない。</span>
                    <span className="pb-4 text-sm">増やすことが出来れば、2限3限が両方ある人でも食堂で健康的な食事を摂ることが出来るようになる。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick3(4, 2,event)}
                      >
                        ❤️
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick3(3, 2,event)}
                      >
                        👍
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick3(2, 2,event)}
                      >
                        😐
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick3(1, 2,event)}
                      >
                        👎
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 100 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick3(100, 2,event)}
                      >
                        棄権する
                      </button>
                    </div>      
                  </div>
                </form>
                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                    {// changehere
                    }
                    <span className="pb-4 text-base font-semibold">PJ4：キャンパス内限定の無料バイクシェアリングサービスの設置</span>
                    <span className="pb-4 text-base">予算：1000万円</span>
                    <span className="pb-4 text-sm">キャンパスが広すぎるので移動を楽にする。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex4 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick4(4, 3,event)}
                      >
                        ❤️
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex4 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick4(3, 3,event)}
                      >
                        👍
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex4 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick4(2, 3,event)}
                      >
                        😐
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex4 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick4(1, 3,event)}
                      >
                        👎
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex4 === 100 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick4(100, 3,event)}
                      >
                        棄権する
                      </button>
                    </div>      
                  </div>
                </form>
                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                  <span className="pb-4 text-base font-semibold">PJ5：銀杏の木の根本に大量の消臭剤を設置</span>
                    <span className="pb-4 text-base">予算：100万円</span>
                    <span className="pb-4 text-sm">秋~冬は匂いのせいで大学に行きたくなくなる</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex5 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick5(4, 4,event)}
                      >
                        ❤️
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex5 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick5(3, 4,event)}
                      >
                        👍
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex5 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick5(2, 4,event)}
                      >
                        😐
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex5 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick5(1, 4,event)}
                      >
                        👎
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex5 === 100 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick5(100, 4,event)}
                      >
                        棄権する
                      </button>
                    </div>      
                  </div>
                </form>
                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                  <span className="pb-4 text-base font-semibold">PJ6：セルフプリントサービス</span>
                    <span className="pb-4 text-base">予算：400万円</span>
                    <span className="pb-4 text-sm">各校舎や図書館にプリンターを設置する。楽にプリントできる。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex6 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick6(4, 5,event)}
                      >
                        ❤️
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex6 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick6(3, 5,event)}
                      >
                        👍
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex6 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick6(2, 5,event)}
                      >
                        😐
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex6 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick6(1, 5,event)}
                      >
                        👎
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex6 === 100 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick6(100, 5,event)}
                      >
                        棄権する
                      </button>
                    </div>      
                  </div>
                </form>
                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                  <span className="pb-4 text-base font-semibold">PJ7：パン屋設置</span>
                    <span className="pb-4 text-base">予算：150万円</span>
                    <span className="pb-4 text-sm">パン屋が欲しい</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex7 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick7(4, 6,event)}
                      >
                        ❤️
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex7 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick7(3, 6,event)}
                      >
                        👍
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex7 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick7(2, 6,event)}
                      >
                        😐
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex7 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick7(1, 6,event)}
                      >
                        👎
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex7 === 100 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick7(100, 6,event)}
                      >
                        棄権する
                      </button>
                    </div>      
                  </div>
                </form>
                
                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                  <span className="pb-4 text-base font-semibold">PJ8：多目的スペースを増やす</span>
                    <span className="pb-4 text-base">予算：2000万円</span>
                    <span className="pb-1 text-sm">交流、接客、通話、歓談、間食などのために短時間滞在できるオープンスペースを増やして欲しいです。</span>
                    <span className="pb-1 text-sm">キャンパスの中で建物の間などにある小規模の空き地にベンチやテーブル、椅子を設置することを提案します。</span>
                    <span className="pb-4 text-sm">工事予算は200万円*10ヶ所とします。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex8 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick8(4, 7,event)}
                      >
                        ❤️
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex8 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick8(3, 7,event)}
                      >
                        👍
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex8 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick8(2, 7,event)}
                      >
                        😐
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex8 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick8(1, 7,event)}
                      >
                        👎
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex8 === 100 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick8(100, 7,event)}
                      >
                        棄権する
                      </button>
                    </div>      
                  </div>
                </form>

                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                  <span className="pb-4 text-base font-semibold">PJ9：モバイルバッテリー貸し出しサービス</span>
                    <span className="pb-4 text-base">予算：200万円</span>
                    <span className="pb-4 text-sm">コンセントがない教室も多いので、モバイルバッテリー貸し出しを行なってほしい。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex9 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick9(4, 8,event)}
                      >
                        ❤️
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex9 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick9(3, 8,event)}
                      >
                        👍
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex9 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick9(2, 8,event)}
                      >
                        😐
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex9 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick9(1, 8,event)}
                      >
                        👎
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex9 === 100 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick9(100, 8,event)}
                      >
                        棄権する
                      </button>
                    </div>      
                  </div>
                </form>

                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                  <span className="pb-4 text-base font-semibold">PJ10：ミニ美術館/博物館の設置</span>
                    <span className="pb-4 text-base">予算：500万円</span>
                    <span className="pb-4 text-sm">気持ちをリフレッシュしたい時や気が向いた時にふらっと立ち寄れるような美術館/博物館が欲しい。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex10 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick10(4, 9,event)}
                      >
                        ❤️
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex10 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick10(3, 9,event)}
                      >
                        👍
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex10 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick10(2, 9,event)}
                      >
                        😐
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex10 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick10(1, 9,event)}
                      >
                        👎
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex10 === 100 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick10(100, 9,event)}
                      >
                        棄権する
                      </button>
                    </div>      
                  </div>
                </form>

                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                  <span className="pb-4 text-base font-semibold">PJ11：休憩室の設置</span>
                    <span className="pb-4 text-base">予算：100万円</span>
                    <span className="pb-1 text-sm">建物によっては（GraSSPなど）、座り心地の良いソファや毛布などがあり安心して昼寝や休憩ができるような部屋もあります。</span>
                    <span className="pb-4 text-sm">そういう部屋をもっと全建物に増やしてほしいです。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex11 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick11(4, 10,event)}
                      >
                        ❤️
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex11 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick11(3, 10,event)}
                      >
                        👍
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex11 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick11(2, 10,event)}
                      >
                        😐
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex11 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick11(1, 10,event)}
                      >
                        👎
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex11 === 100 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick11(100, 10,event)}
                      >
                        棄権する
                      </button>
                    </div>      
                  </div>
                </form>

                <div className="flex justify-center py-5">
                  <button
                    className="items-center w-2/12 bg-white border-red-500 hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-2 border border-red-500 hover:border-transparent rounded"
                    onClick={voting}
                  >
                    投票
                  </button>
                </div>

              </>) : (
              <div>
                <div className='px-2 py-2 mb-2 bg-white border border-gray-400'>
                  <span className="flex flex-col items-left font-semibold text-lg">＜PJ一覧＞</span>
                  <span className="flex flex-col items-left text-base">PJ1：講義情報と開講棟・教室を簡易検索できるデジタルサイネージの設置</span>
                  <span className="flex flex-col items-left text-base">PJ2：たこ焼き屋を作る</span>
                  <span className="flex flex-col items-left text-base">PJ3：食堂を増やす</span>
                  <span className="flex flex-col items-left text-base">PJ4：キャンパス内限定の無料バイクシェアリングサービス</span>
                  <span className="flex flex-col items-left text-base">PJ5：銀杏の木の根本に大量の消臭剤を設置</span>
                  <span className="flex flex-col items-left text-base">PJ6：セルフプリントサービス</span>
                  <span className="flex flex-col items-left text-base">PJ7：パン屋設置</span>
                  <span className="flex flex-col items-left text-base">PJ8：多目的スペースを増やす</span>
                  <span className="flex flex-col items-left text-base">PJ9：モバイルバッテリー貸し出し</span>
                  <span className="flex flex-col items-left text-base">PJ10：ミニ美術館/博物館</span>
                  <span className="flex flex-col items-left text-base">PJ11：休憩室の設置</span>

                </div>
                <div className="flex flex-col mt-10 items-left text-2xl font-semibold">アンケート</div>
                  <span className="flex flex-col items-left font-semibold">
                    もしよろしければアンケートにもご協力ください。
                  </span>
                  <span className="flex flex-col mt-5 items-left font-semibold">
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSc8Z8vPNJG2BmzK5o7nhQf4WjrT_vDQ3mPuJ924Ly2iZk8j-Q/viewform?usp=sf_link"
                      className="text-red-500 hover:text-red-400 underline"
                    >
                      アンケートリンクはこちら
                    </a>
                  </span>
                <div className="flex flex-col mt-10 items-left text-2xl font-semibold">投票結果速報</div>
                <button 
                  className="w-2/8 mx-2 my-3 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
                  onClick={live}
                >速報値</button>
                {result.names.length > 0 && result.medians.length > 0 && result.ranks.length > 0 ? (
                  <div className="px-2 py-2 mb-2 bg-white border border-gray-400">
                    <span className="flex flex-col items-left mb-4 font-semibold">※10000位となっているものは票数が少ないことによるランク外扱いです</span>
                      <span className="flex flex-col items-left font-semibold">
                        Name: {result.names[0].toString()}, Median: {result.medians[0].toString()}, Rank: {result.ranks[0].toString()}{Number(result.ranks[0]) === 1 ? 'st' : Number(result.ranks[0]) === 2 ? 'nd' : Number(result.ranks[0]) === 3 ? 'rd' : 'th'}
                      </span>
                      <span className="flex flex-col items-left font-semibold">
                        Name: {result.names[1].toString()}, Median: {result.medians[1].toString()}, Rank: {result.ranks[1].toString()}{Number(result.ranks[1]) === 1 ? 'st' : Number(result.ranks[1]) === 2 ? 'nd' : Number(result.ranks[1]) === 3 ? 'rd' : 'th'}
                      </span>
                      <span className="flex flex-col items-left font-semibold">
                        Name: {result.names[2].toString()}, Median: {result.medians[2].toString()}, Rank: {result.ranks[2].toString()}{Number(result.ranks[2]) === 1 ? 'st' : Number(result.ranks[2]) === 2 ? 'nd' : Number(result.ranks[2]) === 3 ? 'rd' : 'th'}
                      </span>
                      <span className="flex flex-col items-left font-semibold">
                        Name: {result.names[3].toString()}, Median: {result.medians[3].toString()}, Rank: {result.ranks[3].toString()}{Number(result.ranks[3]) === 1 ? 'st' : Number(result.ranks[3]) === 2 ? 'nd' : Number(result.ranks[3]) === 3 ? 'rd' : 'th'}
                      </span>
                      <span className="flex flex-col items-left font-semibold">
                        Name: {result.names[4].toString()}, Median: {result.medians[4].toString()}, Rank: {result.ranks[4].toString()}{Number(result.ranks[4]) === 1 ? 'st' : Number(result.ranks[4]) === 2 ? 'nd' : Number(result.ranks[4]) === 3 ? 'rd' : 'th'}
                      </span>
                      <span className="flex flex-col items-left font-semibold">
                        Name: {result.names[5].toString()}, Median: {result.medians[5].toString()}, Rank: {result.ranks[5].toString()}{Number(result.ranks[5]) === 1 ? 'st' : Number(result.ranks[5]) === 2 ? 'nd' : Number(result.ranks[5]) === 3 ? 'rd' : 'th'}
                      </span>
                      <span className="flex flex-col items-left font-semibold">
                        Name: {result.names[6].toString()}, Median: {result.medians[6].toString()}, Rank: {result.ranks[6].toString()}{Number(result.ranks[6]) === 1 ? 'st' : Number(result.ranks[6]) === 2 ? 'nd' : Number(result.ranks[6]) === 3 ? 'rd' : 'th'}
                      </span>
                      <span className="flex flex-col items-left font-semibold">
                        Name: {result.names[7].toString()}, Median: {result.medians[7].toString()}, Rank: {result.ranks[7].toString()}{Number(result.ranks[7]) === 1 ? 'st' : Number(result.ranks[7]) === 2 ? 'nd' : Number(result.ranks[7]) === 3 ? 'rd' : 'th'}
                      </span>
                      <span className="flex flex-col items-left font-semibold">
                        Name: {result.names[8].toString()}, Median: {result.medians[8].toString()}, Rank: {result.ranks[8].toString()}{Number(result.ranks[8]) === 1 ? 'st' : Number(result.ranks[8]) === 2 ? 'nd' : Number(result.ranks[8]) === 3 ? 'rd' : 'th'}
                      </span>
                      <span className="flex flex-col items-left font-semibold">
                        Name: {result.names[9].toString()}, Median: {result.medians[9].toString()}, Rank: {result.ranks[9].toString()}{Number(result.ranks[9]) === 1 ? 'st' : Number(result.ranks[9]) === 2 ? 'nd' : Number(result.ranks[9]) === 3 ? 'rd' : 'th'}
                      </span>
                      <span className="flex flex-col items-left font-semibold">
                        Name: {result.names[10].toString()}, Median: {result.medians[10].toString()}, Rank: {result.ranks[10].toString()}{Number(result.ranks[10]) === 1 ? 'st' : Number(result.ranks[10]) === 2 ? 'nd' : Number(result.ranks[10]) === 3 ? 'rd' : 'th'}
                      </span>
                      {// changehere
                      }
                  </div>
                ) : (<></>)}

                <div className="flex flex-col mt-10 items-left text-2xl font-semibold">投票結果速報(PJ別)</div>
                <div className="mb-10">
                    <input
                      type="text"
                      className="w-7/12 ml-2 text-center border border-gray-400"
                      name="Candidate"
                      placeholder="候補者名を入力"
                      onChange={handleCandidate}
                      value={candidate} // アドレスの状態を反映
                    />
                    <button
                      className="w-2/8 mx-2 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
                      onClick={IndividualLive} // ボタンクリック時に結果を取得
                    >
                      結果表示
                    </button>
                    {candidate === '' ? (
                      <></>
                    ) : (
                    <div>
                      {candidate === "PJ1" || candidate === "PJ2" || candidate === "PJ3" || candidate === "PJ4" || candidate === "PJ5" || candidate === "PJ6" || candidate === "PJ7" || candidate === "PJ8" || candidate === "PJ9" || candidate === "PJ10" || candidate === "PJ11" ? ( //changehere
                        <div>
                          <span className="flex flex-col mt-2 mb-5 items-left font-semibold">
                            Median: {individualResult.MedianValue.toString()}
                          </span>
                          <span className="flex flex-col mt-2 mb-5 items-left font-semibold">
                            Rank: {individualResult.Rank.toString()}{individualResult.Rank.toString() === "1" ? 'st' : individualResult.Rank.toString() === "2" ? 'nd' : individualResult.Rank.toString() === "3" ? 'rd' : 'th'}
                          </span>
                          <span className="flex flex-col mt-2 mb-5 items-left font-semibold">
                            ScoreGet: ひとめぼれ/大好き{individualResult.ScoreGet.toString().split(',')[0]}％、いいね/興味あり{individualResult.ScoreGet.toString().split(',')[1]}％、まあいいんじゃない{individualResult.ScoreGet.toString().split(',')[2]}％、やめた方がいい{individualResult.ScoreGet.toString().split(',')[3]}％
                          </span>
                        </div>
                      ) : (
                        <span className="flex flex-col mt-2 mb-5 items-left font-semibold">
                          「PJ1」、「PJ2」のように入力してください。PJ1〜11まであります。
                        </span>)}
                    </div>
                    )}
                </div>

                {VoteEnded === true ? (
                  <div>
                  <button 
                    className="w-2/8 mx-2 mb-5 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
                    onClick={GetWinner}
                  >優勝者</button>
                  {winner !== '' ? (
                    <span>Winner: {`${winner}`} </span>
                  ):(<></>)}
                  </div>
                ) : (<></>)}

              </div>)}
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
              <div>Polygon Mumbaiに接続してください</div>
            </div>)
        )}
      </div>
    </div>
  )
}
