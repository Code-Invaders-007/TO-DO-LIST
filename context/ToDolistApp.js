import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

import { toDoListAddress, toDoListABI } from "./constants";

const fetchContract = (signerOrProvider) => new ethers.Contract(toDoListAddress, toDoListABI, signerOrProvider);

export const ToDoListContext = React.createContext();

export const ToDoListProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [error, setError] = useState("");
    const [allToDoList, setAllToDoList] = useState([]);
    const [myList, setMyList] = useState([]);
    const [allAddress, setAllAddress] = useState([]);


    //----CONNECTING METAMASK
    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return setError("Please Install MetaMask");

        const account = await window.ethereum.request({ method: "eth_accounts" });

        if (account.length) {
            setCurrentAccount(account[0]);
            console.log(account[0]); 
        } else {
            setError("Please Install MetaMask & Connect, Reload");
        }
    }
    const connectWallet = async () => {
        if (!window.ethereum) return setError("Please Install MetaMask");

        const account = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        setCurrentAccount(account[0]);
    }

const toDoList = async (message) => {
try {   
    console.log("df")
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();   
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = await fetchContract(signer);
    console.log("heldo")
    const createList = await contract.createList(message);
    createList.wait();
    console.log(createList);
    console.log(contract)
    

}catch(error){
    setError("Error Creating List");

}
    }
    const getToDoList = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract =await fetchContract(signer);
           
            const getAllAddress = await contract.getAddress();
            setAllAddress(getAllAddress);

            console.log(getAllAddress);

            getAllAddress.map(async (address) => {
                const getSingleData = await contract.getCreatorData(address);
                allToDoList.push(getSingleData);
                console.log(getSingleData)
            })
            const allMessage = await contract.getMessage();
            setMyList(allMessage);
        } catch (error) {
            setError("Error Fetching List");
        }
    }
    // CHANGE STATE OF TODOLIST TO FALSE TO TRUE
        const change = async(address) =>{
            try{
                const web3Modal = new Web3Modal();
                const connection = await web3Modal.connect();
                const provider = new ethers.providers.Web3Provider(connection);
                const signer = provider.getSigner();
                const contract =await fetchContract(signer);
               const state = await contract.toggle(address);
               state.wait()
               console.log(state);
            }catch(error){
                setError("Error Changing List");
        }
    }
    return (   
        <ToDoListContext.Provider value={{
            checkIfWalletIsConnected,
            connectWallet,
            getToDoList,
            toDoList,
            change,
            currentAccount,
            error,
            allToDoList,
            myList,
            allAddress,
            }}>
            {children}
        </ToDoListContext.Provider>
    )
}
