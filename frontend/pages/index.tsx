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
  const [getVoterScores, setGetVoterScores] = useState([])
  const [voterAddress, setVoterAddress] = useState('');
  const [voterScores, setVoterScores] = useState('');
  const [VoteEnded, setVoteEnded] = useState(false);
  const [Vote, setVote] = useState([0,0,0]);
  const [tempvote, setTempvote] = useState<number[]>([]);
  const [activeButtonIndex1, setActiveButtonIndex1] = useState(-1);
  const [activeButtonIndex2, setActiveButtonIndex2] = useState(-1);
  const [activeButtonIndex3, setActiveButtonIndex3] = useState(-1);
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
      setGetVoterScores([]);
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
  setGetVoterScores([]);
  setVoteEnded(false);
  setTempvote([0,0,0]);
  setVote([]);
  setActiveButtonIndex1(-1);
  setActiveButtonIndex2(-1);
  setActiveButtonIndex3(-1);
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

  const getOtherScores = await votingContract.ForOwnerGetVoterScores(voterAddress); // アドレスを引数に渡す
  console.log(`his/her vote result: ${getOtherScores}`);
  setVoterScores(getOtherScores); // 結果を状態として保存
};

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
        投票アプリへようこそ
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
                    onClick={() => setVoteEnded(true)}
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
                      {voterScores !== '' ? (
                        <span className="flex flex-col items-left font-semibold">
                        his/her vote: {`${voterScores}`}
                        </span>
                      ) : (<></>)} 
                  </div>
                </>
                </div>
              ):(<></>)
              }
              <div className='px-2 py-2 bg-transparent'>
                <span className="flex flex-col items-left font-semibold">投票者数：{`${numOfVoters}`}</span>
                <span className="flex flex-col items-left font-semibold">投票開始状況：{`${VoteEnded}`}</span>
                <span className="flex flex-col items-left font-semibold">オーナー：{owner}</span>
              </div>
              <div className='px-2 py-2 mb-2 bg-white border border-gray-400'>
                <span className="flex flex-col items-left font-semibold">アドレス：{account}</span>
                {getVoterScores.length > 0 ? (
                  <span className="flex flex-col items-left font-semibold">
                    あなたの投票結果：{`${getVoterScores}`}
                  </span> 
                ) : ( 
                  <span className="flex flex-col items-left font-semibold">
                    あなたの投票結果：未投票
                  </span>
                )
                }
              </div>
              {getVoterScores.length == 0 ? (
              <>
                <form className="flex pl-1 pr-1 py-1 mb-1 bg-white border border-gray-400">
                  <div className= "w-full flex justify-between flex-col">
                    <span className="pb-4">Alice：〇〇党。こんにちは。私の名前はAliceです。</span>
                    <div className= "w-full flex justify-between" >
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 4 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick1(4, 0,event)}
                      >
                        大好き
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 3 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick1(3, 0,event)}
                      >
                        興味あり
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 2 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick1(2, 0,event)}
                      >
                        まあいいんじゃない
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 1 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick1(1, 0,event)}
                      >
                        やめた方がいい
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex1 === 100 ? "bg-blue-500 text-white" : ""}`}
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
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 4 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick2(4, 1,event)}
                      >
                        大好き
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 3 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick2(3, 1, event)}
                      >
                        興味あり
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 2 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick2(2, 1,event)}
                      >
                        まあいいんじゃない
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 1 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick2(1, 1,event)}
                      >
                        やめた方がいい
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex2 === 100 ? "bg-blue-500 text-white" : ""}`}
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
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 4 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick3(4, 2,event)}
                      >
                        大好き
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 3 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick3(3, 2,event)}
                      >
                        興味あり
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 2 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick3(2, 2,event)}
                      >
                        まあいいんじゃない
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 1 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick3(1, 2,event)}
                      >
                        やめた方がいい
                      </button>
                      <button
                        className={`w-2/12 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded ${activeButtonIndex3 === 100 ? "bg-blue-500 text-white" : ""}`}
                        onClick={(event) => handleButtonClick3(100, 2,event)}
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
                <div className="flex flex-col mt-20 items-left text-2xl font-semibold">投票結果速報</div>
                  <button 
                    className="w-2/8 mx-2 my-3 bg-white border-blue-500 hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
                    onClick={live}
                  >速報値</button>
                    {result.names.length > 0 && result.medians.length > 0 && result.ranks.length > 0 ? (
                      <div className="px-2 py-2 mb-2 bg-white border border-gray-400">
                          <span className="flex flex-col items-left font-semibold">
                            Name: {result.names[0].toString()}, Median: {result.medians[0].toString()}, Rank: {result.ranks[0].toString()}{Number(result.ranks[0]) === 1 ? 'st' : Number(result.ranks[0]) === 2 ? 'nd' : Number(result.ranks[0]) === 3 ? 'rd': 'th'}
                          </span>
                          <span className="flex flex-col items-left font-semibold">
                            Name: {result.names[1].toString()}, Median: {result.medians[1].toString()}, Rank: {result.ranks[1].toString()}{Number(result.ranks[1]) === 1 ? 'st' : Number(result.ranks[1]) === 2 ? 'nd' : Number(result.ranks[0]) === 3 ? 'rd': 'th'}
                          </span>
                          <span className="flex flex-col items-left font-semibold">
                            Name: {result.names[2].toString()}, Median: {result.medians[2].toString()}, Rank: {result.ranks[2].toString()}{Number(result.ranks[2]) === 1 ? 'st' : Number(result.ranks[2]) === 2 ? 'nd' : Number(result.ranks[0]) === 3 ? 'rd': 'th'}
                          </span>
                      </div>
                    ) : (<></>)}

              </div>)}
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
              <div>Mumbaiに接続してください</div>
            </div>)
        )}
      </div>
    </div>
  )
}
