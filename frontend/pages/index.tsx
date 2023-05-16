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
  const [Vote, setVote] = useState([100,100,100,100]);//changehere
  const [tempvote, setTempvote] = useState([100,100,100,100]);//changehere
  const [activeButtonIndex1, setActiveButtonIndex1] = useState(-1);
  const [activeButtonIndex2, setActiveButtonIndex2] = useState(-1);
  const [activeButtonIndex3, setActiveButtonIndex3] = useState(-1);
  const [activeButtonIndex4, setActiveButtonIndex4] = useState(-1);//changehere
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
  setTempvote([100,100,100,100]);//changehere
  setVote([]);
  setActiveButtonIndex1(-1);
  setActiveButtonIndex2(-1);
  setActiveButtonIndex3(-1);
  setActiveButtonIndex4(-1);//changehere
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

  if (candidate == "Alice" || candidate == "Bob" || candidate =="Chris" || candidate == "David"){ //changehere
    const individualResult = await votingContract.getIndividualResults(candidate);
    setIndividualResult(individualResult);
  }
  else{
    alert('そのような名前の候補者はいません。もう一度確認してください。');
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
                          Alice:{`${voterScores[0].toString() === "1" ? "やめた方がいい" : voterScores[0].toString() === "2" ? "まあいいんじゃない" : voterScores[0].toString() === "3" ? "いいね/興味あり" : voterScores[0].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[0].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          Bob:{`${voterScores[1].toString() === "1" ? "やめた方がいい" : voterScores[1].toString() === "2" ? "まあいいんじゃない" : voterScores[1].toString() === "3" ? "いいね/興味あり" : voterScores[1].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[1].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          Chris:{`${voterScores[2].toString() === "1" ? "やめた方がいい" : voterScores[2].toString() === "2" ? "まあいいんじゃない" : voterScores[2].toString() === "3" ? "いいね/興味あり" : voterScores[2].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[2].toString() === "100" ? "棄権" : ""}`}
                        </span>
                        <span className="flex flex-col items-left font-semibold">
                          David:{`${voterScores[3].toString() === "1" ? "やめた方がいい" : voterScores[3].toString() === "2" ? "まあいいんじゃない" : voterScores[3].toString() === "3" ? "いいね/興味あり" : voterScores[3].toString() === "4" ? "ひとめぼれ/大好き" : voterScores[3].toString() === "100" ? "棄権" : ""}`}
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
                      あなたの投票結果：Alice:{`${getVoterScores[0].toString() === "1" ? "やめた方がいい" : getVoterScores[0].toString() === "2" ? "まあいいんじゃない" : getVoterScores[0].toString() === "3" ? "いいね/興味あり" : getVoterScores[0].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[0].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　Bob:{getVoterScores[1].toString() === "1" ? "やめた方がいい" : getVoterScores[1].toString() === "2" ? "まあいいんじゃない" : getVoterScores[1].toString() === "3" ? "いいね/興味あり" : getVoterScores[1].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[1].toString() === "100" ? "棄権" : ""}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　Chris:{`${getVoterScores[2].toString() === "1" ? "やめた方がいい" : getVoterScores[2].toString() === "2" ? "まあいいんじゃない" : getVoterScores[2].toString() === "3" ? "いいね/興味あり" : getVoterScores[2].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[2].toString() === "100" ? "棄権" : ""}`}
                    </span>
                    <span className="flex flex-col items-left font-semibold">
                      　　　　　　　　　David:{`${getVoterScores[3].toString() === "1" ? "やめた方がいい" : getVoterScores[3].toString() === "2" ? "まあいいんじゃない" : getVoterScores[3].toString() === "3" ? "いいね/興味あり" : getVoterScores[3].toString() === "4" ? "ひとめぼれ/大好き" : getVoterScores[3].toString() === "100" ? "棄権" : ""}`}
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
                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                    <span className="pb-4">Alice：〇〇党。こんにちは。私の名前はAliceです。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick1(4, 0,event)}
                      >
                        ひとめぼれ/大好き
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick1(3, 0,event)}
                      >
                        いいね/興味あり
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick1(2, 0,event)}
                      >
                        まあいいんじゃない
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick1(1, 0,event)}
                      >
                        やめた方がいい
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
                    <span className="pb-4">Bob：〇〇党。こんにちは。私の名前はBobです。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick2(4, 1,event)}
                      >
                        ひとめぼれ/大好き
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick2(3, 1, event)}
                      >
                        いいね/興味あり
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick2(2, 1,event)}
                      >
                        まあいいんじゃない
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick2(1, 1,event)}
                      >
                        やめた方がいい
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
                    <span className="pb-4">Chris：〇〇党。こんにちは。私の名前はChrisです。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick3(4, 2,event)}
                      >
                        ひとめぼれ/大好き
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick3(3, 2,event)}
                      >
                        いいね/興味あり
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick3(2, 2,event)}
                      >
                        まあいいんじゃない
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick3(1, 2,event)}
                      >
                        やめた方がいい
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
                    <span className="pb-4">David：〇〇党。こんにちは。私の名前はDavidです。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex4 === 4 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick4(4, 3,event)}
                      >
                        ひとめぼれ/大好き
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex4 === 3 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick4(3, 3,event)}
                      >
                        いいね/興味あり
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex4 === 2 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick4(2, 3,event)}
                      >
                        まあいいんじゃない
                      </button>
                      <button
                        className={`w-2/12 border-blue-500 hover:bg-blue-500 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex4 === 1 ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
                        onClick={(event) => handleButtonClick4(1, 3,event)}
                      >
                        やめた方がいい
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
                <div className="flex flex-col mt-20 items-left text-2xl font-semibold">アンケート</div>
                  <span className="flex flex-col items-left font-semibold">
                    もしよろしければアンケートにもご協力ください。
                  </span>
                  <span className="flex flex-col mt-5 items-left font-semibold">
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSc8Z8vPNJG2BmzK5o7nhQf4WjrT_vDQ3mPuJ924Ly2iZk8j-Q/viewform?usp=sf_link"
                      className="text-red-500 hover:text-red-400"
                    >
                      アンケートリンクはこちら
                    </a>
                  </span>
                <div className="flex flex-col mt-20 items-left text-2xl font-semibold">投票結果速報</div>
                <button 
                  className="w-2/8 mx-2 my-3 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
                  onClick={live}
                >速報値</button>
                {result.names.length > 0 && result.medians.length > 0 && result.ranks.length > 0 ? (
                  <div className="px-2 py-2 mb-2 bg-white border border-gray-400">
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
                      {// changehere
                      }
                  </div>
                ) : (<></>)}

                <div className="flex flex-col mt-10 items-left text-2xl font-semibold">投票結果速報(候補者別)</div>
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
                      {candidate === "Alice" || candidate === "Bob" || candidate === "Chris" || candidate === "David" ? ( //changehere
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
                          候補者の名前が違います
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
