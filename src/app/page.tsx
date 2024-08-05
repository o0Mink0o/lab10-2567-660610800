"use client";

import axios from "axios";
import { cleanUser } from "@/libs/cleanUser";
import { useState } from "react";
import UserCard from "@/components/UserCard";
import { UserCardProps } from "@/libs/types";
import { useEffect } from "react";

export default function RandomUserPage() {
  // annotate type for users state variable
  const [users, setUsers] = useState<UserCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);
  const [isFirstLoad, setisFirstLoad] = useState(true);
  useEffect(() => {
    if(isFirstLoad) {
        setisFirstLoad(false);
        return;
      }
    const  J= JSON.stringify(genAmount);
    localStorage.setItem('genAmount', J);
  },[genAmount]);

  useEffect(() => {
    const J= localStorage.getItem('genAmount');
    if(J !== null){
      const newGenAmount = JSON.parse(J);
      setGenAmount(newGenAmount);
    }
  },[])
  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;
    const cleanedUsers= users.map(cleanUser);
    setUsers(cleanedUsers);
  };
  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(+e.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users && !isLoading && users.map((user) => <UserCard {...user}/>)}
    </div>
  );
}
