export const UserAPI = (() => {
    let KEY = "";
    const signUp = async userData => {

        const response = await fetch("http://localhost:8080/api/v1/user", {
                                    method: "POST",
                                    headers: new Headers({"content-type": "application/json"}),
                                    body: JSON.stringify(userData)
                                });
        return response;
    }
    const authenticate = async (email, password) => {

        const response = await fetch("http://localhost:8080/api/v1/auth", {
                                    method: "POST",
                                    headers: new Headers({"content-type": "application/json"}),
                                    body: JSON.stringify({email, password})
                               });
        return response;
    }
    const getKey = () => {
        return KEY;
    }
    const setKey = key => {
        KEY = key;
    }
    return {
        signUp,
        authenticate,
        getKey,
        setKey
    };
})();