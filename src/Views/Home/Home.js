import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../Store/actions";
import { mockUsers } from "../../utils/mocks";
import Minesweeper from "../../Games/Minesweeper";

import "./Home.scss";

function Home() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.dataSet.userData.user);
  const usersStatus = useSelector(state => state.dataSet.userData.status);

  useEffect(() => {
    dispatch(fetchUsers(mockUsers));
  }, [dispatch]);

  return (
    <div className="Home">
      <Minesweeper />
    </div>
  );
}

export default Home;
