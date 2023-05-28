import React, { useEffect, useState } from 'react';

function App() {
    const [data, setData] = useState('');

    useEffect(() => {
        fetch('/api')
            .then((response) => response.text())
            .then((data) => setData(data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h1>Hello, Frontend!</h1>
            <div>{data}</div>
        </div>
    );
}

export default App;