import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";
// fbase가 firebase Instance

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
    // setUserObj(authService.currentUser);
    //authService.currentUser처럼 큰 object의 값의 변화를 렌더링하는건 react에게 결정장애를 일으킬 수 있다. 판단하기 어렵게 만든다. 따라서 렌더링하는 대상의 크기를 줄여줄 필요가 있다.
  };
  //firebase에서 변경된 사항을 react.js의 userObj에 바로 적용시키는 것이다. 그래서 firebase와 연결되지 않은 Profile.js에서도 바로 써먹을 수 있게.
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        "initializing..."
      )}
    </>
  );
}

export default App;
