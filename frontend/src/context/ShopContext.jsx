import React, { createContext, use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const backendUrl = "http://localhost:4000";
  const [round,setRound] = useState([]);

const getRoundData = async ()=>{
      try{
          const response = await axios.get(backendUrl + '/api/round1/teams');
          if(response.data.success){
            setRound(response.data.round1);
          }
          else{
            toast.error(response.data.message);
          }
      }
      catch(e){
        toast.error(e.message);
      }
  }


    useEffect(()=>{
    getRoundData();
  },[])

  const value = {
    backendUrl,
    round
  }

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
}

export default ShopContextProvider;