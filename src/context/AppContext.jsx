import { createContext, useEffect, useState } from "react";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
    
    const getLocal = (key) => {
        const v = localStorage.getItem(key);
        return v ? v : null;
    };
    const [token, setToken] = useState(() => getLocal("auth_token"));
    const [user, setUser] = useState(() => getLocal("auth_user"));
    const [record, setRecord] = useState(null);

    useEffect(() => {
        // keep state in sync if other code updates localStorage
        const t = getLocal("auth_token");
        const u = getLocal("auth_user");
        if (t || u) {
            setToken(t);
            setUser(u);
        }
    }, []);

    const refreshRecord = (val) => {
        setRecord(val);
    };

    return (
        <AppContext.Provider value={{ token, user, setToken, setUser, record, refreshRecord }}>
            {props.children}
        </AppContext.Provider>
    );
}
export default AppContextProvider;