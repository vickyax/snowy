// \pages\users\[name].js

import { useRouter } from "next/router";
const User = () => {
    const { query: { name } } = useRouter();
    return (
        <div>
            <h1>Hello! Welcome {name} </h1>
        </div>
    );
};
export default User;

