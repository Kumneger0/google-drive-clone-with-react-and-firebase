import { useState, useEffect, useRef, createContext } from "react";
import { app } from "./firebase/initapp";
import Auth from "./auth/Auth";
import Nav from "./nav/Nav";
import Main from "./main/main";
import Sidebar from "./sidebar/sidebar";
import { FaSignOutAlt } from "react-icons/fa";
import Sm from "./Sm";
import { UploadFiles } from "./main/main";

export const userContext = createContext();
function App() {
  const [selectedItem, setSelectedItem] = useState("Images");
  const [user, setUser] = useState(null);
  const [shouldDisplay, setShouldDisplay] = useState(null);
  const sideBarRef = useRef();
  useEffect(() => {
    async function checkUser() {
      const { getAuth, onAuthStateChanged } = await import("firebase/auth");
      const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        if (user) setUser(user);
        if (!user) setUser(null);
      });
    }
    checkUser();
  });

  const signOut = async () => {
    const { signOut, getAuth } = await import("firebase/auth");
    const auth = getAuth(app);
    signOut(auth).then((res) => {
      // setUser(null);
    });
  };

  const togglerNavBar = () => {
    setShouldDisplay((prv) => !prv);
  };

  return (
    <div className="App">
      <Nav togglerNavBar={togglerNavBar} user={user} />
      {!user ? (
        <div className="wrapper main auth">
          <Auth />
        </div>
      ) : (
        <>
          <div className="container">
            <userContext.Provider
              value={{ user, setUser, selectedItem, setSelectedItem }}
            >
              <Sm shouldDisplay={shouldDisplay} togglerNavBar={togglerNavBar} />
              <div className="parentWrapper">
                <div ref={sideBarRef} className="sideBar">
                  <Sidebar />
                </div>
                <div className="wrapper main">
                  <div className="mainBody">
                    <Main />
                    <div className="UploadFilesStyle">
                      <UploadFiles />
                    </div>
                  </div>
                </div>
              </div>
              <div className="signOutBtnWrapper">
                <button onClick={signOut}>
                  <FaSignOutAlt />
                </button>
              </div>
            </userContext.Provider>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
